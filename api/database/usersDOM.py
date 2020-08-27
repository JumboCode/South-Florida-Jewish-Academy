from flask import Flask
from flask_pymongo import PyMongo
import os
from datetime import datetime

app = Flask(__name__)
MONGO_URL = os.environ.get('DB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

def createUser(id, email, actions):
    if (mongo.db.users.find({'user_id': id}).count() == 0):
        initData = {
                    'user_id': id,
                    'email': email,
                    'actions': actions
                    }
        result = mongo.db.users.insert_one(initData)
        return result.inserted_id
    return -1

def deleteUser(id):
    results = mongo.db.users.delete_one({'user_id': id})
    return results

def updateEmail(id, update):
    writeR = dict(mongo.db.users.update({'user_id': id}, {'$set': {'email': update}}))
    return writeR['nModified'] > 0

def getEmail(id):
    contents = list(mongo.db.users.find({'user_id': id}))
    for content in contents:
        return content['email']

def getActions(id):
    contents = list(mongo.db.users.find({'user_id': id}))
    for content in contents:
        return content['actions']

def addAction(id, time, action):
    writeR = dict(mongo.db.users.update({'user_id': id}, {'$push': {'actions': tuple((time, action))}}))
    return writeR['nModified'] > 0

def getUsers():
    contents = list(mongo.db.users.find())
    users = []
    for content in contents:
        info = {
            'user_id': content['user_id'],
            'email': content['email'],
            'actions': content['actions']
        }
        users.append(info)
    return users
