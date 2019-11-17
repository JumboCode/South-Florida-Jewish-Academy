from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

def getTest():
    contents = list(mongo.db.users.find())
    returnList = []
    for content in contents:
        ele = {'user_id': content['user_id'], 'email': content['email']}
        returnList.append(ele)
    return returnList

def makeUsers():
    users = mongo.db.users
    for i in range (0, 10):
        post = {}
        post['name'] = 'User ' + str(i)
        post['email'] = 'User' + str(i) + '@tufts.edu'
        users.insert_one(post)
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
