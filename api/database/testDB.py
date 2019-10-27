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
        students[content['student_id']] = {'name': content['basic-info']['first_name'],
                                           # 'email': content['email'],
                                           'forms': content['forms']}

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

    for i in range(10):
        initData = {
            'student_id': i,
            'basic-info':
                {
                    'last_name': 'lastname' + str(i),
                    'middle_name': 'middlename' + str(i),
                    'first_name': 'firstname' + str(i),
                },
            'forms':
                {
                    '1': '11',
                    '2': '12',
                    '3': '13',    
                }
        }
        result = students.insert_one(initData)

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