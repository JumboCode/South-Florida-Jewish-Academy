from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

def getTest():
    contents = list(mongo.db.users.find())
    returnList = []
    for content in contents:
        ele = {'name': content['name'], 'email': content['email']}
        returnList.append(ele)
    return returnList

def getStudents():
    contents = list(mongo.db.students.find())
    students = {}
    for content in contents:
        print(content)
        students[content['student_id']] = {
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
    return students

def makeUsers():
    users = mongo.db.users
    for i in range (0, 10):
        post = {}
        post['name'] = 'User ' + str(i)
        post['email'] = 'User' + str(i) + '@tufts.edu'
        users.insert_one(post)
    return

def makeTestStudents():
    students = mongo.db.students

    def genRandomForms(n):
        forms = {}
        for i in range(3):
            forms[str((n + i) % 5)] = [str(n) + str(i) + str(0), str(n) + str(i) + str(1)]
        return forms
    for i in range(0, 10):
        initData = {
            'student_id': i,
            'basic_info': {
                'first_name': 'first' + str(i),
                'middle_name': 'middle' + str(i),
                'last_name': 'last' + str(i),
                'DOB': str(i)*4 + "-" + str(i)*2 + "-" + str(i)*2,
                'parent_ids': [str(i), str(i + 10)],
                'email': 'student' + str(i) + '@FloridaJewishAcademy.org'
            },
            'form_ids': genRandomForms(i)
        }
        result = students.insert_one(initData)
    return

def makeTestParents():
    parents = mongo.db.parents

    for i in range(0, 10):
        initData = {

            'parent_id': i,
            'basic_info': 
                {
                    'name': 'parent' + str(i),
                    'DOB': (str(i) * 4) + '-' + ('0' + str(i)) + '-' + ('1' + str(i)),
                    'email': 'parent' + str(i) + '@FloridaJewishAcademy.org',
                    'student_ids': [str(i), str(i + 1)]
                },
            'forms_completed': [str(i)]
        }