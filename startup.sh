#!/bin/bash
gunicorn --bind=0.0.0.0:8080 --timeout 600 app:app 