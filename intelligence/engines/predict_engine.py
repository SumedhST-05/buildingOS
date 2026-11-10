import numpy as np
import pandas as pd
from datetime import datetime

class PredictEngine:
    def __init__(self):
        pass

    def predict_failure_risks(self):
        # Ranked equipment list with degradation metrics
        equipment = [
            {
                "id": "eq_ahu_fl3",
                "name": "Floor 3 Air Handling Unit (AHU-3)",
                "roomNumber": "304",
                "floorNumber": 3,
                "healthScore": 42,
                "ttfHours": 3.8,
                "failureRisk": 84,
                "stressor": "Compressor thermal overload, evaporator coil frosting, refrigerant delta-P drop"
            },
            {
                "id": "eq_chiller_02",
                "name": "Auxiliary Chiller 02 (Rooftop)",
                "roomNumber": "512",
                "floorNumber": 5,
                "healthScore": 76,
                "ttfHours": 48.5,
                "failureRisk": 38,
                "stressor": "Condenser fan motor bearing vibration harmonics"
            },
            {
                "id": "eq_chiller_01",
                "name": "Main Chilled Water Plant 01",
                "roomNumber": "512",
                "floorNumber": 5,
                "healthScore": 94,
                "ttfHours": 1850.0,
                "failureRisk": 8,
                "stressor": "Nominal thermal efficiency (COP: 4.82)"
            },
            {
                "id": "eq_elevator_01",
                "name": "Passenger Elevator Alpha (High Speed)",
                "roomNumber": "106",
                "floorNumber": 1,
                "healthScore": 91,
                "ttfHours": 320.0,
                "failureRisk": 14,
                "stressor": "Hoist cable tension variance within 2% tolerance"
            },
            {
                "id": "eq_solar_array",
                "name": "Rooftop Bifacial Solar PV Array (140kW)",
                "roomNumber": "512",
                "floorNumber": 5,
                "healthScore": 98,
                "ttfHours": 8500.0,
                "failureRisk": 2,
                "stressor": "Inverter MPPT efficiency optimal (98.6%)"
            }
        ]

        # Sort ranked by failureRisk descending
        equipment.sort(key=lambda x: x["failureRisk"], reverse=True)
        return equipment

    def predict_demand(self):
        # 24-hour diurnal profile starting from current hour
        current_hour = datetime.now().hour
        forecast = []

        for i in range(24):
            h = (current_hour + i) % 24
            # Diurnal bell curve (peaks at 13:00)
            solar_factor = max(0.0, float(np.sin(((h - 6) / 14) * np.pi)))
            occ_factor = max(0.0, float(np.sin(((h - 7) / 15) * np.pi))) if 8 <= h <= 20 else 0.05

            occupancy = int(round(occ_factor * 95))
            kwh = round(22.0 + occ_factor * 38.0 + (5.0 if 11 <= h <= 15 else 0.0), 1)
            upper_ci = round(kwh * 1.12, 1)
            lower_ci = round(kwh * 0.88, 1)
            solar_kw = round(solar_factor * 85.0, 1)

            forecast.append({
                "hour": f"{h:02d}:00",
                "occupancy": occupancy,
                "kwh": kwh,
                "upperCi": upper_ci,
                "lowerCi": lower_ci,
                "cleanSolarKw": solar_kw
            })

        return forecast

predict_engine = PredictEngine()
