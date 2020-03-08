#!/bin/sh
cd api
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
MONGODB_URI=mongodb://localhost:27017/sfja python3 run.py

