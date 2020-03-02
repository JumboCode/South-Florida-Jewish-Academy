from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# Creates new form.
def createForm(data):
    initData = {
                'form_name': 'New Form',
                'created': 
                'form_data': data
                }
    result = mongo.db.blankForms.insert_one(initData)
    return result.inserted_id
