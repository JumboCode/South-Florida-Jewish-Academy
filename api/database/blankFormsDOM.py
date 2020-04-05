from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
mongo = PyMongo(app)

# Creates new form.
def createForm(data):
    initData = {
                'form_name': 'New Form',
                'form_data': data
                }
    result = mongo.db.blankForms.insert_one(initData)
    return result.inserted_id

def getAll():
    res = list()
    cursor = mongo.db.blankForms.find({})
    for document in cursor:
        res.append({
            'id': str(document['_id']),
            'name': document['form_name']
        })

    return res

        # print(document)

def getFormName(id):
    contents = list(mongo.db.blankForms.find({'_id': id}))

    if len(contents) != 1:
        return False

    return contents[0]['form_name']

def getFormData(id):
    contents = list(mongo.db.blankForms.find({'_id': id}))

    if len(contents) != 1:
        return False

    return contents[0]['form_data']