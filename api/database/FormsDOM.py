from flask import Flask
from flask_pymongo import PyMongo
from database import blankFormsDOM
from bson.objectid import ObjectId
import os
from bson.objectid import ObjectId

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
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
        results = mongo.db.forms.delete_one({'form_id': str(id)})
        return results

# Gets form info, specifically.
def getInfo(id, key):
    contents = list(mongo.db.forms.find({'form_id': str(id)}))
    for content in contents:
        return content[key]

# Gets form data.
def getFormData(id):
    contents = list(mongo.db.forms.find({'_id': str(id)}))

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

# Updates form data.
def updateFormData(id, ques, ans):
    writeR = dict(mongo.db.forms.update({'form_id': str(id)}, {'$set': {'form_data.' + str(ques): ans}}))
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

def getBlankForm(id):
    contents = list(mongo.db.forms.find({'_id': id}))
    
    if len(contents) != 1:
        return False
    
    for content in contents:
        return blankFormsDOM.getFormData(ObjectId(content['blank_forms_id']))
        
def isComplete(id):
    contents = list(mongo.db.forms.find({'_id':ObjectId(id)}))
    if (len(contents) != 1):
        raise RuntimeError
    return contents[0]['completed']

