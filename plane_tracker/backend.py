from flask import Flask, render_template, url_for, jsonify
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/apiData")
def planeData():
    response = requests.get("https://opensky-network.org/api/states/all")
    data = response.json()
    return jsonify(data)

if(__name__ == "__main__"):
    app.run(debug = True)