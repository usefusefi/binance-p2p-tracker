#!/bin/bash

# Activate the virtual environment
source antenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Gunicorn with the correct port
gunicorn --bind 0.0.0.0:8080 --timeout 600 app:app 