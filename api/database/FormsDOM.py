from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# get all the keys 
def getStuff():
    return list(mongo.db.forms.find({}))

# Creates new form.
def createForm(id, date, required, num, comp, data):
    initData = {
                'form_id': id,
                'last_updated': date,
                'last_viewed': '0000-00-00',
                'required': required,
                'form_num': num,
                'percent_completed': comp,
                'form_data': data
                }
    result = mongo.db.forms.insert_one(initData)
    return result.inserted_id

# Deletes form.
def deleteForm(id):
        results = mongo.db.forms.delete_one({'form_id': str(id)})
        return results

# Gets form info.
def getInfo(id, key):
    contents = list(mongo.db.forms.find({'form_id': str(id)}))
    for content in contents:
        return content[key]

# Gets form data.
def getFormData(id):
    contents = list(mongo.db.forms.find({'form_id': str(id)}))
    for content in contents:
        return content['form_data']

# Updates form data.
def updateFormData(id, ques, ans):
    writeR = dict(mongo.db.forms.update({'form_id': str(id)}, {'$set': {'form_data.' + str(ques): ans}}))
    return writeR['nModified'] > 0