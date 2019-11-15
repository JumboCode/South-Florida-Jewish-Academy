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


def updateInfo(id, key, update):
	writeR = mongo.db.parents.update({'id': str(id)}, {key: update})
	#TODO: inform of update


def listStudents(id, key):
	parentIdList = mongo.db.parents.find({'id': str(id)})
	parentId = parentIdList[key];

	print(parentId)
