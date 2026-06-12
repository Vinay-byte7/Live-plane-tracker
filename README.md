Live Flight Tracker
A real-time flight tracking web application built with Python (Flask) and Leaflet.js. This project pulls live aviation data from the OpenSky Network API and plots active aircraft on a custom night-themed map.

Features
Real-Time Data: Fetches live flight coordinates, barometric altitude, speed, and heading using the free OpenSky Network API.

Custom Map Layer: Uses NASA's Black Marble night imagery combined with bright Esri reference labels for a high-contrast, "aerospace radar" look.

Interactive Search: Features a modern glassmorphism UI search bar that allows users to filter active flights by country or callsign.

Auto-Camera: Automatically bounds and zooms the map camera to fit the results of a user's search.

Optimized Rendering: Uses Leaflet Layer Groups to cleanly clear and redraw markers, preventing browser lag during repeated searches.

Tech Stack
Backend: Python, Flask, Requests

Frontend: HTML, CSS, Vanilla JavaScript

Mapping: Leaflet.js

Icons: FontAwesome
