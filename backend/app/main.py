from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional
from pydantic import BaseModel
import mysql.connector
from .auth import verify_password, get_password_hash, create_access_token
import qrcode
import io
import base64
from PIL import Image
from jose import JWTError, jwt

# Constants for JWT
SECRET_KEY = "your-secret-key-here"  # In production, use a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme for token handling
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function to decode and verify JWT token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Verify and decode JWT token to get current user
    Args:
        token: JWT token from request
    Returns:
        username: String containing the username from token
    Raises:
        HTTPException: If token is invalid or expired
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode JWT token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this for security in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/time")
def read_root():
    return {"time": datetime.now().isoformat()}

class EchoRequest(BaseModel):
    text: str
    number: int

@app.post("/api/echo")
def echo(request: EchoRequest):
    return {"message": request.text, "number": request.number}

# Database connection
def get_db():
    db = mysql.connector.connect(
        host="database",
        user="myuser",
        password="mypassword",
        database="myapp"
    )
    try:
        yield db
    finally:
        db.close()

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@app.post("/api/signup", response_model=Token)
async def signup(user: UserCreate, db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    
    # Check if username is already taken in the database
    cursor.execute("SELECT username FROM users WHERE username = %s", (user.username,))
    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="This username is already taken"
        )
    
    # Check if email is already registered in the database
    cursor.execute("SELECT email FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="An account with this email already exists"
        )
    
    # If both checks pass, create new user with hashed password
    try:
        hashed_password = get_password_hash(user.password)
        cursor.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
            (user.username, user.email, hashed_password)
        )
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Failed to create account. Please try again."
        )
    
    # Generate JWT token for the new user
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: mysql.connector.MySQLConnection = Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    
    # Check if user exists in database
    cursor.execute(
        "SELECT * FROM users WHERE username = %s",
        (form_data.username,)
    )
    user = cursor.fetchone()
    
    # Return error if username not found
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password against stored hash
    if not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Generate JWT token for successful login
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/qr/create")
async def create_qr(url: str, current_user: str = Depends(get_current_user), db: mysql.connector.MySQLConnection = Depends(get_db)):
    try:
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        
        # Add data to QR code
        qr.add_data(url)
        qr.make(fit=True)

        # Create image from QR code
        qr_image = qr.make_image(fill_color="black", back_color="white")
        
        # Convert PIL image to base64 string
        buffered = io.BytesIO()
        qr_image.save(buffered, format="PNG")
        qr_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        # Get user_id from username
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE username = %s", (current_user,))
        user = cursor.fetchone()
        
        # Save QR code to database
        cursor.execute(
            "INSERT INTO qr_codes (user_id, qr_data) VALUES (%s, %s)",
            (user['id'], url)
        )
        db.commit()
        
        # Return the base64 encoded image
        return {
            "qr_code": f"data:image/png;base64,{qr_base64}",
            "url": url
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.get("/api/qr")
async def get_user_qr_codes(current_user: str = Depends(get_current_user), db: mysql.connector.MySQLConnection = Depends(get_db)):
    try:
        cursor = db.cursor(dictionary=True)
        
        # Get user_id from username
        cursor.execute("SELECT id FROM users WHERE username = %s", (current_user,))
        user = cursor.fetchone()
        
        # Get all QR codes for the user
        cursor.execute("""
            SELECT qr_codes.id, qr_codes.qr_data as url, qr_codes.created_at
            FROM qr_codes 
            WHERE user_id = %s 
            ORDER BY created_at DESC
        """, (user['id'],))
        
        qr_codes = cursor.fetchall()
        
        # Generate QR code images for each record
        for qr in qr_codes:
            # Create QR code instance
            qr_generator = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # Add data to QR code
            qr_generator.add_data(qr['url'])
            qr_generator.make(fit=True)
            
            # Create image from QR code
            qr_image = qr_generator.make_image(fill_color="black", back_color="white")
            
            # Convert PIL image to base64 string
            buffered = io.BytesIO()
            qr_image.save(buffered, format="PNG")
            qr_base64 = base64.b64encode(buffered.getvalue()).decode()
            
            # Add base64 image to the response
            qr['qr_code'] = f"data:image/png;base64,{qr_base64}"
        
        return qr_codes
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
