from flask import Flask
from flask_pymongo import PyMongo
from datetime import datetime
from pytz import timezone
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# Creates new form.
def createForm(data):
    initData = {
                'form_name': 'New Form',
                'form_data': data,
                'date_created': datetime.now(timezone('US/Eastern'))
                }
    result = mongo.db.blankForms.insert_one(initData)
    return result.inserted_id

def getAll():
    res = list()
    cursor = mongo.db.blankForms.find({})
    for document in cursor:
        res.append({
            'id': str(document['_id']),
            'name': document['form_name']
        })

    return res

        # print(document)


def getBlankFormName(id):
    contents = list(mongo.db.blankForms.find({'_id': id }))
    for content in contents:
        return content['form_name']

def getBlankFormDetails():
    contents = list(mongo.db.blankForms.find())
    forms = []
    for content in contents:
        info = {
            'form_id': str(content['_id']),
            'form_name': content['form_name'],
            'date_created': content['date_created'],
            'form_data': content['form_data']
        }
        forms.append(info)
    return forms

def deleteForm(id):
    mongo.db.blankForms.delete_many({'_id': id })

def updateFormName(id, name):
    form = mongo.db.blankForms.find({'_id': id})
    mongo.db.blankForms.update({'_id': id}, {'$set': {'form_name': name}})

