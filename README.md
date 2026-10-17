# BuildingOS — Intelligent Building Operating System

> *"One intelligent brain for the building. Every system. One smarter ecosystem."*  
> **Challenge Track:** Smart Buildings  
> **Team:** Hanshal Surya • Atharva Sharma • Sumedh Tapkire

---

## 1. Executive Summary & Product Vision

In conventional buildings, critical systems—HVAC, lighting, CCTV, access control, energy distribution, and elevators—operate in disconnected silos. Data is fragmented across legacy panels, problems are detected only after occupant complaints or mechanical failures occur, and energy and safety operations remain reactive.

**BuildingOS** unifies building telemetry into a single proactive ecosystem powered by a live 3D Digital Twin and a continuous closed-loop intelligence cycle:

$$\text{MONITOR} \longrightarrow \text{DETECT} \longrightarrow \text{PREDICT} \longrightarrow \text{SIMULATE} \longrightarrow \text{OPTIMIZE}$$

1. **Monitor:** Collects real-time telemetry from across the building every 2 seconds.
2. **Detect:** Identifies multivariate anomalies using an Isolation Forest and rolling Z-scores.
3. **Predict:** Forecasts equipment degradation, remaining useful life (TTF), and 24h energy/occupancy demand with 95% confidence intervals.
4. **Simulate:** Runs emergency and operational scenarios (fire evacuation egress bottlenecks, HVAC thermal drift, power outages).
5. **Optimize:** Generates setpoint and daylight harvesting recommendations with one-click execution and real-time savings tracking.

---

## 2. System Architecture & Workflow

```
[Building Systems & Sensors]
 (Classrooms, Labs, Chiller Plant, 60 Cameras, Elevators)
                     │
                     ▼
  [Sensor Simulator & Collector (Node.js)]
   • 2-second telemetry loop
   • Fault injection API (HVAC degradation, CO2 spike, door forced)
                     │
                     ▼
  [BuildingOS Backend (Node.js + Socket.io)]  ◄───►  [MongoDB / In-Memory Mock]
   • REST API (:5001)                                 • Auto zero-config fallback
   • Socket.io real-time streaming (:5001)
                     ▲
                     │ (REST Proxy & Anomaly Pipeline)
                     ▼
  [Intelligence Layer (Python FastAPI :8000)]
   • Anomaly Detection (Isolation Forest + Z-score)
   • Equipment Failure Predictor & TTF
   • 24h Demand Forecaster with Confidence Bands
   • Scenario Simulation Engine (Evacuation Graphs & Thermal Diffusion)
   • Operational Setpoint & Lighting Optimizer
                     │
                     ▼
  [Operations Dashboard & Digital Twin (React + Vite + R3F :3000)]
   • Procedural 3D stacked exploded building
   • Slide 5 Multi-Floor Operations Status cards
   • Room 304 slide-over inspection drawer
   • Three Intelligence Functions (Predict, Simulate, Optimize)
```

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, Three.js via React Three Fiber (`@react-three/fiber`, `@react-three/drei`), Tailwind CSS, Zustand, Recharts, Lucide Icons, Canvas-Confetti.
- **Backend & Streaming:** Node.js, Express, Socket.io, Axios.
- **Intelligence Layer:** Python 3.11+, FastAPI, Uvicorn, scikit-learn, NumPy, Pandas, Pydantic.
- **Persistence:** MongoDB with transparent, zero-friction **In-Memory Storage Fallback** (if MongoDB is not running locally, the prototype automatically boots in-memory with full seeding and persistence).
- **Orchestration:** Monorepo runner via `concurrently`.

---

## 4. Quick Start: One Command Startup

### Prerequisites
- Node.js 18+ / 20+
- Python 3.10+ / 3.11+ / 3.14+

### Installation & Launch

```bash
# 1. Clone or navigate to the repository root
cd e:/yy

# 2. Run everything with a single command
npm run dev
```

This starts:
- 🏢 **Core Backend + Simulator:** `http://localhost:5001`
- 🧠 **Intelligence Layer (FastAPI):** `http://localhost:8000` (Docs: `http://localhost:8000/docs`)
- 💻 **Frontend Digital Twin:** `http://localhost:3000`

---

## 5. Primary User Flow (Pitch Deck Slide 5)

$$\text{Select Floor} \longrightarrow \text{Choose Floor 3} \longrightarrow \text{Open Room 304} \longrightarrow \text{See Live Conditions} \longrightarrow \text{Receive Action}$$

1. In the top or left floor selector, click **Floor 3**.
2. The camera smoothly zooms into Floor 3 (Engineering & Computing Wing) while other floors ghost out.
3. Click **Classroom 304** (marked with a glowing pill on the 3D twin).
4. The slide-over **Room Drawer** opens:
   - Live Temp ($23.5^\circ\text{C}$), Humidity ($45\%$), $\text{CO}_2$ ($580\text{ ppm}$), Occupancy ($18\text{ students}$), Lighting ($450\text{ lux}$), HVAC ($2.4\text{ kW}$), Door (Secure), and CCTV (Online).
   - 24-hour historical temperature drift sparkline.
5. **Receive Action:** Click **"Execute Setpoint Reset"** to dynamically apply the AI recommendation (+1.5°C deadband) and save 24.2 kWh.

---

## 6. End-to-End Demo Script Walkthrough

Follow these 7 steps to present the complete hackathon prototype:

### Step 1: Baseline Health Overview
- Open `http://localhost:3000`.
- Observe the modern SaaS control center (off-white `#F3F6FA` background, deep navy `#0B2A5B` sidebar, deck teal `#00A9A0` accents).
- Review the **Multi-Floor Operations Status** cards:
  - **Total Site Energy Portfolio:** 24h Clean Energy (Solar) vs. Grid draw AreaChart.
  - **HVAC & Air Quality:** Gauges displaying average temp ($23.5^\circ\text{C}$ Ideal), $\text{CO}_2$ ($580\text{ ppm}$ Good), Humidity ($45\%$ Ideal).
  - **Security & Occupancy:** Total campus occupancy ($95\text{ people}$), Floor 3 ($18$), active cameras ($58/60$), Perimeter: Secure.
  - **Recommended Action:** AI card prompting to increase energy efficiency.

### Step 2: Primary Navigation Flow (Slide 5)
- Click **Floor 3** in the floor selector $\to$ click **Classroom 304**.
- Inspect live conditions, 24h telemetry trend, and execute room-specific setpoint adjustment.

### Step 3: Fault Injection (Anomalies & Detection)
- Click the **"Inject Fault"** button in the header.
- Select **"HVAC Degradation (Floor 3 • Room 304)"**.
- Notice within 2 seconds:
  - The loop indicator switches from `MONITOR` to **`DETECT`** (amber/red glow).
  - An anomaly toast alert pops up: *"Thermal-power divergence: Classroom 304 AHU-3 cooling efficiency degraded 42%..."*
  - On the 3D twin, Classroom 304 turns **amber**, then **crimson red**.

### Step 4: Predictive Analytics (Predict Tab)
- Open the **Intelligence Engine** panel $\to$ navigate to the **`PREDICT`** tab.
- Review the **Equipment Failure Risk Ranking**:
  - `AHU-3 (Floor 3)` is ranked #1 with **84% Risk** and **3.8h Estimated Time-to-Failure (TTF)**.
  - Stressor diagnostics reveal compressor thermal overload and refrigerant delta-P drop.
- Review the **24h Demand Forecast Chart** showing projected energy draw and occupancy with 95% confidence intervals.

### Step 5: Emergency Simulation (Simulate Tab)
- Navigate to the **`SIMULATE`** tab.
- Select **"Fire Evacuation"** on **Floor 5** $\to$ click **"Run 3D Digital Twin Simulation"**.
- Watch animated egress vector tubes render on the 3D twin guiding occupants to Stairwells A & B.
- A glowing red marker identifies the bottleneck congestion at **Stairwell B Entrance** with clearance time ($59\text{ seconds}$) and flow rate ($1.8\text{ people/sec}$).
- Switch to **"HVAC Failure"** on Floor 3 to observe thermal drift diffusion across adjacent labs.

### Step 6: Proactive Optimization (Optimize Tab)
- Navigate to the **`OPTIMIZE`** tab or return to the main dashboard.
- On the **Recommended Action** card ("Increase Energy Efficiency: Adjust lighting based on usage"), click the teal **`ACTIVATE`** button.
- Celebratory confetti fires!
- The simulator applies daylight harvesting dimming (-35%) to Floor 3 & 4 corridors.
- Total building power draw drops immediately, and the **Operational Savings Counter** begins incrementing kWh, dollars, and $\text{CO}_2$ avoided.

### Step 7: Explore Secondary Pages
- Use the navy sidebar to inspect:
  - **Security Hub:** 12-camera live surveillance grid and perimeter access statuses.
  - **Asset Management:** Full campus equipment registry with health scores and TTF meters.
  - **Sustainability:** Clean solar generation vs. grid offset and carbon avoidance metrics.
  - **Reports:** ISO 50001 compliance summary with PDF export trigger.

---

## 7. REST API Endpoints

### Backend (`:5001`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/building` | Building metadata and real-time campus KPI |
| `GET` | `/api/floors` | 5-floor hierarchy with room arrays |
| `GET` | `/api/rooms/:id` | Room details and baseline targets |
| `GET` | `/api/rooms/:id/history` | 24-hour historical telemetry sparkline data |
| `GET` | `/api/equipment` | Equipment registry with health scores |
| `GET` | `/api/alerts` | Real-time and historical alerts |
| `POST`| `/api/alerts/:id/resolve` | Mark an alert resolved |
| `GET` | `/api/recommendations` | Active AI recommendations |
| `POST`| `/api/recommendations/:id/apply` | Apply recommendation to simulator |
| `POST`| `/api/simulator/fault` | Inject fault (`hvac_degradation`, `co2_buildup`, etc.) |
| `POST`| `/api/simulator/fault/reset` | Restore baseline healthy operations |

### Intelligence Layer (`:8000`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST`| `/detect` | Isolation Forest + Z-score anomaly detection |
| `POST`| `/predict/failure` | Equipment degradation ranking and TTF forecasting |
| `POST`| `/predict/demand` | 24h occupancy & energy forecast with 95% CI |
| `POST`| `/simulate` | Evacuation graph flow & thermal heat transfer simulation |
| `POST`| `/optimize` | Setpoint reset & daylight harvesting savings calculator |
#   p r o t o - b u i l d i n g O S  
 #   p r o t o - b u i l d i n g O S  
 