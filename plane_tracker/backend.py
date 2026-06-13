from flask import Flask, render_template, url_for, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/apiData")
def planeData():
    # response = requests.get("https://opensky-network.org/api/states/all")
    # data = response.json()
    # return jsonify(data)
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get("https://opensky-network.org/api/states/all", headers=headers, timeout=10)
        response.raise_for_status() 
        data = response.json()
        return jsonify(data)
        
    except Exception as e:
        print(f"Error fetching from OpenSky: {e}")
        return jsonify({"states": [], "error": "Could not fetch data"}), 500

if(__name__ == "__main__"):
    app.run(debug = True)
