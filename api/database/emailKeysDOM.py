from flask import Flask
from flask_pymongo import PyMongo
import os

app = Flask(__name__)
MONGO_URL = os.environ.get('DB_URI')
app.config["DB_URI"] = MONGO_URL
mongo = PyMongo(app)


def makeUser(email, generatedKey):
    emailKeysCollection = mongo.db.emailKeys
    print(email, generatedKey)
    emailSearch = list(emailKeysCollection.find({'email': email}))
    print(emailSearch)
    if len(emailSearch) != 0:
        print('length not 0')
        return False
    
    data = {
        'email': email,
        'key': generatedKey
    }
    result = emailKeysCollection.insert_one(data)
    return result.acknowledged

#This function is called upon when a user tries to go to form/:key. It verifies that key in the url exists in the database. 
def verifyKey(givenKey):
    emailKeysCollection = mongo.db.emailKeys
    print('givenKey', givenKey)
    keySearch = list(emailKeysCollection.find({'key': givenKey}))
    if len(keySearch) != 0:
        print('key exists!')
        return True
    return False

#Verifies that a user email exists in the database.
def verifyUser(givenUser):
    emailKeysCollection = mongo.db.emailKeys
    keySearch = list(emailKeysCollection.find({'email': givenUser}))
    if len(keySearch) != 0:
        print('user exists!')
        return True
    return False


