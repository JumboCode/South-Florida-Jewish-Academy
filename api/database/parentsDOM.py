from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

# update info
# given all info make new parent
# list student(s) associated with parent
# if student_id is changed, change here also

def listStudents(id, key):
	contents = getInfo(id, 'student_ids')
	return contents

def getInfo(id, key):
    contents = list(mongo.db.parents.find({'parent_id': id}))
    for content in contents:
        return content['basic_info'][key]

def getParentForm(id, formNum):
	contents = list(mongo.db.parents.find({'parent_id': id}))
	for content in contents:
		return content['form_ids'][formNum]

def updateInfo(id, key, update):
    writeR = dict(mongo.db.parents.update({'parent_id': id}, {'$set': {'basic_info' + str(key): update}}))
    if writeR['nModified'] > 0:
        return True
    return False

def addForm(id, formNum, formId):
    writeR = dict(mongo.db.parents.update({'parent_id': id}, {'$set': {'form_ids.' + str(formNum): str(formId)}}))
    return writeR['nModified'] > 0

def removeForm(id, formNum):
    writeR = dict(mongo.db.parents.update({'parent_id': id}, {'$unset': {'form_ids.' + str(formNum): ''}}))
    return writeR['nModified'] > 0
