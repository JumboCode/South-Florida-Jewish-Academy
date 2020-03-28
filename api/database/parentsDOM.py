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

def listStudents(curr_link):
    contents = list(mongo.db.parents.find({'curr_link': curr_link}))
    return list(map(str, contents[0]['student_ids']))


def getParentForm(id, formNum1):

    contents = list(mongo.db.parents.find({'_id': id}))
    
    if len(contents) != 1:
        return False

    for content in contents:
        if str(formNum1) in content['form_ids']:
            return content['form_ids'][str(formNum1)]
        else:
            return None


def updateInfo(id, key, update):
    writeR = dict(mongo.db.parents.update({'_id': id}, {'$set': {'basic_info' + str(key): update}}))
    if writeR['nModified'] > 0:
        return True
    return False

def addForm(id, formNum, formId):
    writeR = dict(mongo.db.parents.update({'_id': id}, {'$set': {'form_ids.' + str(formNum): [str(formId)]}}))
    return writeR['nModified'] > 0

def removeForm(id, formNum):
    writeR = dict(mongo.db.parents.update({'_id': id}, {'$unset': {'form_ids.' + str(formNum): ''}}))
    return writeR['nModified'] > 0


# makes parent and returns parentID
def createParent(firstName, lastName, email):
    initData = {
                'first_name': firstName,
                'last_name': lastName,
                'email': email,
                'student_ids': []
                }
    result = mongo.db.parents.insert_one(initData)
    return result.inserted_id


def addStudentId(id, studentId):
    contents = list(mongo.db.parents.find({'_id': id}))
    if len(contents) != 1:
        return False

    oldStudents = []
    for content in contents:
        oldStudents = content['student_ids']

    oldStudents.append(studentId)
    writeR = dict(mongo.db.parents.update({'_id': id}, {'$set': {'student_ids': oldStudents}}))
    return writeR['nModified'] > 0