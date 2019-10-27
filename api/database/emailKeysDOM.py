from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/sfja"
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
