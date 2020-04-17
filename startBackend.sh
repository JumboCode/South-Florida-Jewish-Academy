#!/bin/sh
cd api
python3 -m venv backendEnv
source backendEnv/bin/activate
pip install -r requirements.txt
eval $(egrep -v '^#' ../.env | xargs) python3 run.py

