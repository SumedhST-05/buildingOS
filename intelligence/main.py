import sys
import os

# Ensure UTF-8 output encoding on Windows consoles
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.schemas import (
    DetectRequest, DetectResponse,
    FailurePredictResponse,
    DemandPredictResponse,
    SimulateRequest, SimulateResponse,
    OptimizeRequest, OptimizeResponse
)
from engines.anomaly_engine import anomaly_engine
from engines.predict_engine import predict_engine
from engines.simulation_engine import simulation_engine
from engines.optimizer_engine import optimizer_engine

app = FastAPI(
    title="BuildingOS Intelligence Layer",
    description="ML Anomaly Detection, Degradation Prediction, Scenario Simulation, and Setpoint Optimization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "BuildingOS Intelligence Layer",
        "engines": ["IsolationForest", "RollingZScore", "DegradationPredictor", "EvacuationGraph", "Thermodynamics", "Optimizer"]
    }

@app.post("/detect", response_model=DetectResponse)
def detect_anomaly(req: DetectRequest):
    result = anomaly_engine.detect(
        room_id=req.roomId,
        fault_type=req.type or "normal",
        temp=req.temperature or 23.5,
        hum=req.humidity or 45.0,
        co2=req.co2 or 580.0,
        occ=req.occupancy or 18,
        hvac_kw=req.hvacPowerKw or 2.4
    )
    return result

@app.post("/predict/failure", response_model=FailurePredictResponse)
def predict_failure():
    risks = predict_engine.predict_failure_risks()
    return {"equipment": risks}

@app.post("/predict/demand", response_model=DemandPredictResponse)
def predict_demand():
    forecast = predict_engine.predict_demand()
    return {"forecast": forecast}

@app.post("/simulate", response_model=SimulateResponse)
def run_simulation(req: SimulateRequest):
    result = simulation_engine.run_simulation(
        scenario_type=req.scenarioType,
        target_floor=req.targetFloor,
        duration_minutes=req.durationMinutes or 60
    )
    return result

@app.post("/optimize", response_model=OptimizeResponse)
def get_optimization_recommendations(req: OptimizeRequest):
    recs = optimizer_engine.generate_recommendations(target_floor=req.targetFloor or 3)
    return {"recommendations": recs}

if __name__ == "__main__":
    print("\n========================================================")
    print("[AI-Engine] BuildingOS Intelligence Layer running on port 8000")
    print("[AI-Engine] Swagger Docs available at http://localhost:8000/docs")
    print("========================================================\n")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
