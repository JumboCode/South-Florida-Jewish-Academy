from flask import Flask
from flask_pymongo import PyMongo
from datetime import datetime
from pytz import timezone
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

# Creates new form.
def createForm(formName, formYear, data):
    initData = {
                'form_name': formName,
                'form_data': data,
                'form_year': formYear,
                'date_created': datetime.now(timezone('US/Eastern')),
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


def getFormName(id):
    contents = list(mongo.db.blankForms.find({'_id': id}))

    if len(contents) != 1:
        return False

    return contents[0]['form_name']

def getFormData(id):
    contents = list(mongo.db.blankForms.find({'_id': id}))

    if len(contents) != 1:
        return False

    return contents[0]['form_data']
    
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
            'form_data': content['form_data'],
            'form_year': content['form_year'],
        }
        forms.append(info)
    return forms

def deleteForm(id):
    mongo.db.blankForms.delete_many({'_id': id })

def updateFormName(id, name):
    mongo.db.blankForms.update({'_id': id}, {'$set': {'form_name': name}})

def getFormYear(id):
    contents = list(mongo.db.blankForms.find({'_id': id}))

    if len(contents) != 1:
        return False

    return contents[0]['form_year']

