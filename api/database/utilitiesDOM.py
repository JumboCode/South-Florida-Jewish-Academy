from flask import Flask
from flask_pymongo import PyMongo
from datetime import datetime
from pytz import timezone
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('DB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)

def updateTags(tagName):
    contents = list(mongo.db.utilities.find({'name': 'Tag'}))

    if len(contents) != 1: 
        initData = {
                    'name': 'Tag',
                    'tags': [tagName],
                    }
        result = mongo.db.utilities.insert_one(initData)
        return result.inserted_id
    else:
        for content in contents:
            if tagName not in content['tags']:
                content['tags'].append(tagName)
                writeR = dict(mongo.db.utilities.update({'name': 'Tag'}, {'$set': {'tags': content['tags']}}))
                return writeR['nModified'] > 0
    
    return content['tags']

def updateYears(year):
    contents = list(mongo.db.utilities.find({'name': 'Year'}))

    if len(contents) != 1: 
        initData = {
                    'name': 'Year',
                    'years': [year],
                    }
        result = mongo.db.utilities.insert_one(initData)
        return result.inserted_id
    else:
        for content in contents:
            if year not in content['years']:
                content['years'].append(year)
                writeR = dict(mongo.db.utilities.update({'name': 'Year'}, {'$set': {'years': content['years']}}))
                return writeR['nModified'] > 0
    
    return content['years']

def getTags():
    contents = list(mongo.db.utilities.find({'name': 'Tag'}))

    if len(contents) != 1:
        return False

    for content in contents:
        return content['tags']

def getYears():
    contents = list(mongo.db.utilities.find({'name': 'Year'}))

    if len(contents) != 1:
        return False

    for content in contents:
        return content['years']
    