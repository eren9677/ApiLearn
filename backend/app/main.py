from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from pydantic import BaseModel
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
