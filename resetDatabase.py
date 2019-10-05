from pymongo import MongoClient

client = MongoClient('localhost', 27017)
client.drop_database('sfja')
db = client['sfja']
users = db.users


for i in range(0, 10):
    initData = {
        'name': 'user' + str(i),
        'email': 'user' + str(i) + '@FloridaJewishAcademy.org'
    }
    users.insert_one(initData)

