from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import data_processor as dp
from typing import List, Dict
from pydantic import BaseModel
import numpy as np

class WardData(BaseModel):
    name: str
    risk_category: str
    tree_cover: float
    population: int

app = FastAPI(title="HeatShield AI API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "HeatShield AI Smart City Backend is running"}

@app.get("/api/heat-risk")
async def get_heat_risk():
    try:
        data = dp.get_heat_risk_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/energy-forecast")
async def get_energy_forecast():
    try:
        data = dp.get_energy_predictions()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/energy-mix")
async def get_energy_mix():
    try:
        data = dp.get_energy_mix()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ward-energy")
async def get_ward_energy():
    try:
        data = dp.get_ward_energy()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sustainability")
async def get_sustainability():
    try:
        wards = dp.get_heat_risk_data()
        for ward in wards:
            # Sustainability Score = (Tree Cover * 0.6) + (1 - Heat Risk * 0.4)
            ward["sustainability_score"] = round((ward["tree_cover"] / 30 * 60) + (1 - ward["risk_score"]) * 40, 1)
        return wards
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/recommendations")
async def get_recommendations():
    wards = dp.get_heat_risk_data()
    # Logic to pick wards with high risk and low tree cover
    priority_wards = sorted(wards, key=lambda x: (100 - x['tree_cover'], x['risk_score']), reverse=True)[:5]
    
    recs = []
    for ward in priority_wards:
        recs.append({
            "ward": ward["name"],
            "suggestions": [
                f"Plant {np.random.randint(500, 2000)} native trees to increase canopy cover",
                "Install smart cooling shelters at high-density transit points",
                "Implement white roofing (cool roofs) mandate for commercial buildings",
                "Develop green corridors to connect existing parks"
            ],
            "priority": "Critical" if ward["risk_category"] == "High" else "High"
        })
    return recs

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
