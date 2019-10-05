#!/bin/bash
cd api
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
python3 run.py

