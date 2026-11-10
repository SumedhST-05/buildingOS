from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DetectRequest(BaseModel):
    roomId: str = "room_304"
    type: Optional[str] = "hvac_degradation"
    temperature: Optional[float] = 25.8
    humidity: Optional[float] = 45.0
    co2: Optional[float] = 620.0
    occupancy: Optional[int] = 18
    hvacPowerKw: Optional[float] = 4.8
    timestamp: Optional[str] = None

class DetectResponse(BaseModel):
    isAnomaly: bool
    severity: str  # info, warning, critical
    score: float
    reason: str
    alert: Optional[Dict[str, Any]] = None

class EquipmentRisk(BaseModel):
    id: str
    name: str
    roomNumber: str
    floorNumber: int
    healthScore: int
    ttfHours: float
    failureRisk: int
    stressor: str

class FailurePredictResponse(BaseModel):
    equipment: List[EquipmentRisk]

class HourlyDemand(BaseModel):
    hour: str
    occupancy: int
    kwh: float
    upperCi: float
    lowerCi: float
    cleanSolarKw: float

class DemandPredictResponse(BaseModel):
    forecast: List[HourlyDemand]

class SimulateRequest(BaseModel):
    scenarioType: str = "fire_evacuation"  # fire_evacuation, hvac_failure, power_outage, occupancy_surge
    targetFloor: int = 5
    durationMinutes: Optional[int] = 60

class SimulateResponse(BaseModel):
    scenarioType: str
    targetFloor: int
    clearanceTimeSeconds: Optional[int] = None
    bottleneck: Optional[str] = None
    evacuatedCount: Optional[int] = None
    flowRatePeoplePerSec: Optional[float] = None
    peakDriftTemp: Optional[float] = None
    affectedRoomsCount: Optional[int] = None
    results: str

class OptimizeRequest(BaseModel):
    targetFloor: Optional[int] = 3
    optimizationTarget: Optional[str] = "energy_cost"

class RecommendationItem(BaseModel):
    id: str
    title: str
    description: str
    target: str
    kwhSavings: float
    costSavings: float
    co2Reduction: float

class OptimizeResponse(BaseModel):
    recommendations: List[RecommendationItem]
