from flask import Flask
from flask_pymongo import PyMongo
from database import blankFormsDOM
import os
from bson.objectid import ObjectId
from datetime import datetime

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

# Creates new form.
def createForm(id, lastUpdated, lastViewed, required, completed, data, parentID):
    initData = {
                'blank_forms_id': id,
                'last_updated': lastUpdated,
                'last_viewed': lastViewed,
                'required': required,
                'completed': completed,
                'form_data': data,
                'parent_id': parentID
                }
    result = mongo.db.forms.insert_one(initData)
    return result.inserted_id

# Deletes form.
def deleteForm(id):
        results = mongo.db.forms.delete_one({'_id': id})
        return results

# Gets form info, specifically.
def getInfo(id, key):
    contents = list(mongo.db.forms.find({'_id': id}))
    for content in contents:
        return content[key]

# Gets form data.
def getFormData(id):
    contents = list(mongo.db.forms.find({'_id': id}))

    if len(contents) != 1:
        return False
    
    for content in contents:
        return content['form_data']

# Gets allform data.
def getForm(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    for content in contents:
        content['_id'] = str(content['_id'])
        content['parent_id'] = str(content['parent_id'])
        return content

def getParentID(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    for content in contents:
        return content['parent_id']

# Updates form data.
def updateFormData(id, data):
    writeR = dict(mongo.db.forms.update({'_id': ObjectId(id)}, {'$set': {'form_data': data}}))
    writeR = dict(mongo.db.forms.update({'_id': ObjectId(id)}, {'$set': {'last_updated': datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")}}))
    return writeR['nModified'] > 0


def getForms():
    contents = list(mongo.db.forms.find())
    forms = []
    for content in contents:
        info = {
            'form_id': content['form_id'],
            'form_num': content['form_num'],
            'last_updated': content['last_updated'],
            'form_data': content['form_data']
        }
        forms.append(info)
    return forms


def testCreateForm(data):
    result = mongo.db.forms.insert_one(data)
    return result.inserted_id

def getFormName(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    
    if len(contents) != 1:
        return False
    
    for content in contents:
        return blankFormsDOM.getFormName(ObjectId(content['blank_forms_id']))

def getLastUpdated(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    
    if len(contents) != 1:
        return False
    
    for content in contents:
        return content['last_updated']

def getLastViewed(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    
    if len(contents) != 1:
        return False
    
    for content in contents:
        return content['last_viewed']

def getBlankFormId(id):
    contents = list(mongo.db.forms.find({'_id': id}))

    assert len(contents) == 1

    for content in contents:
        return content['blank_forms_id']
        
def isComplete(id):
    contents = list(mongo.db.forms.find({'_id':ObjectId(id)}))
    if (len(contents) != 1):
        raise RuntimeError
    return len(contents[0]['form_data']) != 0

