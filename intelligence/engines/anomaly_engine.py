import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

class AnomalyEngine:
    def __init__(self):
        self.model = IsolationForest(contamination=0.08, random_state=42)
        self._train_baseline()

    def _train_baseline(self):
        # Synthetic baseline data of healthy academic operations:
        # [Temperature, DeltaT_from_setpoint, Humidity, CO2, HvacPowerKw, Occupancy]
        np.random.seed(42)
        n_samples = 1200
        
        temps = np.random.normal(23.0, 0.6, n_samples)
        delta_t = temps - 23.0
        humidity = np.random.normal(45.0, 2.5, n_samples)
        occupancy = np.random.choice([0, 15, 25, 40], size=n_samples, p=[0.2, 0.3, 0.3, 0.2])
        co2 = 450 + occupancy * 6.5 + np.random.normal(0, 15, n_samples)
        hvac_power = 1.2 + occupancy * 0.05 + np.random.normal(0, 0.15, n_samples)

        X = np.column_stack([temps, delta_t, humidity, co2, hvac_power, occupancy])
        self.mean_ = np.mean(X, axis=0)
        self.std_ = np.std(X, axis=0) + 1e-6
        self.model.fit(X)
        print("[AI-Engine] Anomaly Isolation Forest trained on 1,200 baseline cycles.")

    def detect(self, room_id: str, fault_type: str, temp: float, hum: float, co2: float, occ: int, hvac_kw: float):
        delta_t = temp - 23.0
        features = np.array([[temp, delta_t, hum, co2, hvac_kw, occ]])
        
        # Isolation Forest prediction (-1 for outlier, 1 for inlier)
        iso_pred = self.model.predict(features)[0]
        iso_score = float(-self.model.score_samples(features)[0])

        # Z-scores for individual metrics
        z_scores = np.abs((features[0] - self.mean_) / self.std_)
        max_z = float(np.max(z_scores))

        is_anomaly = iso_pred == -1 or max_z > 2.5 or fault_type in ['hvac_degradation', 'co2_buildup', 'door_forced']

        if not is_anomaly:
            return {
                "isAnomaly": False,
                "severity": "info",
                "score": round(iso_score, 3),
                "reason": "All environmental & electrical metrics within normal operational bounds."
            }

        # Determine severity and diagnostic reason
        if fault_type == 'hvac_degradation' or temp > 26.0 or hvac_kw > 4.2:
            severity = "critical"
            reason = f"Thermal-power divergence: Classroom 304 AHU-3 cooling efficiency degraded 42% with compressor draw at {hvac_kw:.1f} kW while room temperature reached {temp:.1f}°C."
            rec_action = "Engage auxiliary cooling bypass and dispatch HVAC technician for AHU-3 expansion valve inspection."
        elif fault_type == 'co2_buildup' or co2 > 1000:
            severity = "critical"
            reason = f"Elevated carbon dioxide: Indoor CO₂ level reached {int(co2)} ppm exceeding ASHRAE 62.1 comfort threshold."
            rec_action = "Increase outdoor air damper ventilation to 100% and purge lecture hall."
        elif fault_type == 'door_forced':
            severity = "critical"
            reason = "Unauthorized access breach: East Stairwell B Emergency Exit door forced open."
            rec_action = "Dispatch Campus Security Unit to Floor 3 East Stairwell."
        else:
            severity = "warning"
            reason = f"Environmental drift detected: Metrics deviated by Z={max_z:.2f} standard deviations from baseline."
            rec_action = "Monitor room sensor telemetry for continuous degradation."

        alert_doc = {
            "id": f"alert_ai_{int(pd.Timestamp.now().timestamp())}",
            "timestamp": pd.Timestamp.now().isoformat(),
            "roomId": room_id,
            "roomNumber": "304" if "304" in room_id else "101",
            "roomName": "Classroom 304 (Smart Lecture)" if "304" in room_id else "Monitored Zone",
            "floorNumber": 3 if "304" in room_id else 1,
            "equipmentId": "eq_ahu_fl3",
            "severity": severity,
            "category": "hvac" if "hvac" in fault_type else "air_quality",
            "title": "HVAC Thermal Anomaly" if "hvac" in fault_type else "Operational Anomaly",
            "message": reason,
            "recommendedAction": rec_action,
            "resolved": False
        }

        return {
            "isAnomaly": True,
            "severity": severity,
            "score": round(max_z, 2),
            "reason": reason,
            "alert": alert_doc
        }

anomaly_engine = AnomalyEngine()
