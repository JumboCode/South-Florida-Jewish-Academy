from datetime import datetime
from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

# Creates a new student in the database. Takes pre-made
# basicInfo and formIds dictionaries.
def createStudent(firstName, middleName, lastName, DOB, grade, formIds, parentIds):
    initData = {
                'first_name': firstName,
                'middle_name': middleName,
                'last_name': lastName,
                'DOB': DOB,
                'grade': grade,
                'parent_ids': parentIds,
                'form_ids': formIds,
                'archived': False,
                }
    result = mongo.db.students.insert_one(initData)
    return result.inserted_id

# Updates student basic info.
def updateInfo(id, key, update):
    writeR = dict(mongo.db.students.update({'_id': id}, {'$set': {str(key): update}}))
    return writeR['nModified'] > 0

# Gets student basic info.
def getInfo(id, key):
    contents = list(mongo.db.students.find({'student_id': id}))
    for content in contents:
        return content['basic_info'][key]

# Gets basic student info
def getBasicInfo(id):
    contents = list(mongo.db.students.find({'_id': id}))
    for content in contents:
        del content['parent_ids']
        del content['form_ids']
        content['_id'] = str(content['_id'])
        content['DOB'] = content['DOB'].strftime("%m/%d/%Y")
        return content

# Gets forms of a student.
def getForms(id):
    contents = list(mongo.db.students.find({'_id': id}))
    for content in contents:
        return content['form_ids']

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

# Gets parents
def getParents(id):
    contents = list(mongo.db.students.find({'_id': id}))

    if len(contents) != 1:
        return False

    for content in contents:
        return content['parent_ids']

def getStudents():
    contents = list(mongo.db.students.find())
    students = []
    for content in contents:
        info = {
            'student_id': str(content['_id']),
            'first_name': content['first_name'],
            'middle_name': content['middle_name'],
            'last_name': content['last_name'],
            'DOB': content['DOB'].strftime("%m/%d/%Y"),
            'form_ids': content['form_ids'],
            'grade': content['grade'],
            'archived': content['archived'],
        }
        students.append(info)

    return students
def getFullInfo(id):
    contents = list(mongo.db.students.find({'_id': id}))
    for content in contents:
        return {
            '_id': content['_id'],
            'first_name': content['first_name'],
            'middle_name': content['middle_name'],
            'last_name': content['last_name'],
            'DOB': content['DOB'].strftime("%m/%d/%Y"),
            'form_ids': content['form_ids'],
            'grade': content['grade'],
            'archived': content['archived'],
        }

def getArchivedStudents():
    contents = list(mongo.db.students.find({'archived': True}))
    students = []
    for content in contents:
        students.append({
            '_id': content['_id'],
            'form_ids': content['form_ids'],
        })
    return students

def getFirstName(id):
    contents = list(mongo.db.students.find({'_id': id}))
    return contents[0]['first_name']

def getAllFormIds(id):
    contents = list(mongo.db.students.find({'_id': id}))

    if len(contents) != 1:
        return False

    for content in contents:
        return list(map(str, content['form_ids']))

def addNewFormId(id, newFormId):
    contents = list(mongo.db.students.find({'_id': id}))
    if len(contents) != 1:
        return False

    oldForms = []
    for content in contents:
        oldForms = content['form_ids']

    oldForms.append(newFormId)
    writeR = dict(mongo.db.students.update({'_id': id}, {'$set': {'form_ids': oldForms}}))
    return writeR['nModified'] > 0

def deleteStudent(id):
    result = mongo.db.students.delete_one({'_id': id})
    assert result.deleted_count == 1

def changeGrades(difference):
    contents = list(mongo.db.students.find())
    for content in contents:
        # cast just in case for old data
        mongo.db.students.update({'_id': content['_id']}, {'$set': {'grade': int(content['grade']) + difference}})

def isArchived(id):
    contents = list(mongo.db.students.find({'_id': id}))
    return contents[0]['archived']