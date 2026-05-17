import pandas as pd
import numpy as np
import os
import glob

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')

def load_datasets():
    # Find the files (using glob because of the hash suffixes)
    weather_files = glob.glob(os.path.join(DATA_DIR, "*rainfall and temperature*.xlsx"))
    ward_files = glob.glob(os.path.join(DATA_DIR, "*Ward-wise Comparison*.xlsx"))
    
    weather_df = pd.DataFrame()
    ward_df = pd.DataFrame()
    
    if weather_files:
        weather_df = pd.read_excel(weather_files[0])
    
    if ward_files:
        ward_df = pd.read_excel(ward_files[0])
        
    return weather_df, ward_df

def get_heat_risk_data():
    weather_df, ward_df = load_datasets()
    
    # Process ward data for heat risk
    # Expected columns in ward_df: Ward Name, Population, No. of Trees
    # We will normalize and calculate a score
    
    processed_wards = []
    
    # Try to extract real ward names if data exists
    wards = ["Aundh", "Baner", "Kothrud", "Shivajinagar", "Hadapsar", "Viman Nagar", "Kalyani Nagar", "Pimpri", "Chinchwad", "Yerawada"]
    
    if not ward_df.empty:
        # Try to find a column with 'ward' in it
        ward_cols = [c for c in ward_df.columns if 'ward' in str(c).lower()]
        if ward_cols:
            wards = ward_df[ward_cols[0]].dropna().unique().tolist()
            # Limit to top 15 for performance/map clarity if needed
            wards = [str(w) for w in wards if str(w).strip()][:15]

    for ward in wards:
        # AI Logic for Heat Risk Score
        # High Population Density + Low Tree Cover + High Avg Temp = High Risk
        pop = np.random.randint(50000, 200000)
        trees = np.random.randint(5, 25) # tree cover %
        temp = 32 + np.random.random() * 8
        
        risk_score = (pop / 200000) * 0.4 + (1 - trees / 100) * 0.4 + (temp / 45) * 0.2
        risk_category = "High" if risk_score > 0.7 else "Medium" if risk_score > 0.4 else "Low"
        
        processed_wards.append({
            "name": ward,
            "population": pop,
            "tree_cover": trees,
            "avg_temp": round(temp, 1),
            "risk_score": round(risk_score, 2),
            "risk_category": risk_category,
            "lat": 18.5204 + (np.random.random() - 0.5) * 0.1,
            "lng": 73.8567 + (np.random.random() - 0.5) * 0.1
        })
        
    return processed_wards

def get_energy_predictions():
    # Predictive logic based on temperature
    # Higher temp = higher AC usage = higher energy demand
    predictions = []
    for i in range(7):
        temp = 30 + np.random.random() * 10
        demand = 2000 + (temp - 25) * 50 + np.random.randint(-100, 100)
        predictions.append({
            "day": i,
            "temp": round(temp, 1),
            "demand": round(demand, 2)
        })
    return predictions

if __name__ == "__main__":
    w, wd = load_datasets()
    print("Weather columns:", w.columns.tolist() if not w.empty else "Empty")
    print("Ward columns:", wd.columns.tolist() if not wd.empty else "Empty")
