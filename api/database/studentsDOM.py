from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

# Creates a new student in the database. Takes pre-made
# basicInfo and formIds dictionaries.
def postStudent(id, basicInfo, formIds):
    initData = {
                'student_id': id,
                'basic_info': basicInfo,
                'form_ids': formIds,
            }
    result = mongo.db.students.insert_one(initData)
    return result.inserted_id
    
# Updates student basic info.
def putInfo(id, key, update):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$set': {'basic_info.' + str(key): update}}))
    if writeR['nModified'] > 0:
        return True
    return False

# Gets student basic info.
def getInfo(id, key):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        return content['basic_info'][key]

# Get form id of a student form.
def getForm(id, formNum):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        return content['form_ids'][str(formNum)]

# Add new form.
def postForm(id, formNum, formId):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$set': {'form_ids.' + str(formNum): str(formId)}}))
    if writeR['nModified'] > 0:
        return True
    return False

def getStudentForm(id, formNum):
    content = mongo.db.students.find({'id': str(id)})
    forms = dict(content['form'])
    return forms[formNum]

