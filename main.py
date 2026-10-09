from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
import pandas as pd
import joblib
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal


ml_model = {}
project_dir = Path(__file__).resolve().parent
static_dir = project_dir / "static"

@asynccontextmanager
async def lifespan(_app: FastAPI):
  model_dir = project_dir / "notebook"
  ml_model["model"] = joblib.load(model_dir / "credit_risk_model.pkl")
  ml_model["threshold"] = joblib.load(model_dir / "best_threshold.pkl")

  yield

  ml_model.clear()


app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_methods=["*"],
  allow_headers=["*"]
)

# The only columns that user will see and provide inputs
class LoanApplication(BaseModel):
 person_age: int = Field(ge=18, le=100)
 person_income: float = Field(gt=0)
 person_home_ownership: Literal["RENT", "MORTGAGE", "OWN", "OTHER"]
 person_emp_length: float = Field(ge=0, le=60)
 loan_intent: Literal[
  "PERSONAL",
  "EDUCATION",
  "MEDICAL",
  "VENTURE",
  "HOMEIMPROVEMENT",
  "DEBTCONSOLIDATION",
 ]
 loan_grade: Literal["A", "B", "C", "D", "E", "F", "G"]
 loan_amnt: float = Field(gt=0)
 loan_int_rate: float | None = Field(default=None, ge=0, le=100)
 loan_percent_income: float = Field(ge=0, le=1)
 cb_person_default_on_file: Literal["Y", "N"]
 cb_person_cred_hist_length: int = Field(ge=0, le=80)


@app.get("/")
def greet():
  return FileResponse(static_dir / "index.html")

@app.get("/health")
def health():
  return {"status": "ok"}


@app.post("/predict")
def predict(data : LoanApplication):
  input_df = pd.DataFrame([data.model_dump()])

  probability = ml_model["model"].predict_proba(input_df)[:,1][0]

  prediction = int(probability >= ml_model["threshold"])

  return {
    "default_probability": float(probability),
    "default_prediction": prediction,
    "threshold": float(ml_model["threshold"]),
    "result": "High Risk" if prediction == 1 else "Low Risk"
  }