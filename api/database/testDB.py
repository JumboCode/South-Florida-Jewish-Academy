from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/SFJA"
mongo = PyMongo(app)


def getTest():
    contents = list(mongo.db.users.find())
    for content in contents:
        print(content['name'], content['email'])
    return

def makeUsers():
    users = mongo.db.users
    for i in range (0, 10):
        post = {}
        post['name'] = 'User ' + str(i)
        post['email'] = 'User' + str(i) + '@tufts.edu'
        users.insert_one(post)

    return