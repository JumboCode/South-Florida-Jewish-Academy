from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# Creates a new student in the database. Takes pre-made
# basicInfo and formIds dictionaries.
def createStudent(id, basicInfo, formIds):
    initData = {
                'student_id': id,
                'basic_info': basicInfo,
                'form_ids': formIds,
                }
    result = mongo.db.students.insert_one(initData)
    return result.inserted_id

# Deletes student.
def deleteStudent(id):
    results = mongo.db.students.delete_one({'student_id': id})
    return results
    
# Updates student basic info.
def updateInfo(id, key, update):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$set': {'basic_info.' + str(key): update}}))
    return writeR['nModified'] > 0

# Gets student basic info.
def getInfo(id, key):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        return content['basic_info'][key]

# Get form id of a student form.
def getForm(id, formNum):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        if str(formNum) in content['form_ids']:
            return content['form_ids'][str(formNum)]
        else:
            return None

# Add new form.
def addForm(id, formNum, formId):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$set': {'form_ids.' + str(formNum): [str(formId)]}}))
    return writeR['nModified'] > 0

# Removes form from student data.
def removeForm(id, formNum):
    writeR = dict(mongo.db.students.update({'student_id': id}, {'$unset': {'form_ids.' + str(formNum): ''}}))
    return writeR['nModified'] > 0

# Gets a form.
def getStudentForm(id, formNum):
    content = mongo.db.students.find({'student_id': id})
    forms = dict(content['form'])
    return forms[formNum]

def getStudents():
    contents = list(mongo.db.students.find())
    students = []
    for content in contents:
        info = {
            'student_id': content['student_id'],
            'basic_info': {
                'first_name': content['basic_info']['first_name'],
                'middle_name': content['basic_info']['middle_name'],
                'last_name': content['basic_info']['last_name'],
                'DOB': content['basic_info']['DOB'],
                'parent_ids': content['basic_info']['parent_ids'],
                'email': content['basic_info']['email']
            },
            'form_ids': content['form_ids']
        }
        students.append(info)

    return students
