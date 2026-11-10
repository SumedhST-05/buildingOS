class OptimizerEngine:
    def __init__(self):
        pass

    def generate_recommendations(self, target_floor: int = 3):
        return [
            {
                "id": "rec_lighting_01",
                "title": "Increase Energy Efficiency (Smart Dimming)",
                "description": "Adjust corridor and classroom ambient lighting based on live occupancy. Transition Floor 3 & 4 fixtures to 60% daylight harvesting.",
                "target": f"Floor {target_floor} & 4 DALI Panels",
                "kwhSavings": 18.4,
                "costSavings": 42.50,
                "co2Reduction": 12.6
            },
            {
                "id": "rec_hvac_02",
                "title": "Classroom 304 Dynamic Setpoint Reset",
                "description": "Shift Classroom 304 cooling setpoint from 22.0°C to 23.5°C during the afternoon low-attendance period (18 students / 45 seats).",
                "target": "Classroom 304 & AHU-3",
                "kwhSavings": 24.2,
                "costSavings": 58.00,
                "co2Reduction": 16.8
            },
            {
                "id": "rec_solar_03",
                "title": "Solar Pre-Cooling Optimization",
                "description": "Leverage peak rooftop solar PV generation (11:00 - 13:00) to sub-cool the lecture hall thermal mass before afternoon grid peak tariffs.",
                "target": "Grand Lecture Hall 201 & Chiller 01",
                "kwhSavings": 31.0,
                "costSavings": 74.20,
                "co2Reduction": 21.4
            }
        ]

optimizer_engine = OptimizerEngine()
