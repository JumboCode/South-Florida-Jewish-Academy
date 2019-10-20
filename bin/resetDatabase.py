from pymongo import MongoClient


def makeUsers(db):
    users = db.users
    print('Made users')

    for i in range(0, 10):
        initData = {
            'name': 'user' + str(i),
            'email': 'user' + str(i) + '@FloridaJewishAcademy.org'
        }
        result = users.insert_one(initData)
        print('Inserted ', result.inserted_id)

def makeParents(db):
    parents = db.parents
    print('Made parents')

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
        result = parents.insert_one(initData)
        print('Inserted ', result.inserted_id)

def main():

    ## drop and remake database
    try:
        client = MongoClient('localhost', 27017, serverSelectionTimeoutMS=10)
        client.server_info()
    except:
        print('Please start database with sh startDatabase.sh before resetting it')
        exit(1)

    try:
        client.drop_database('sfja')
        print('sfja database dropped')
    except:
        exit(1)

    db = client['sfja']
    print('Made sfja databse')

    ## make collections
    makeUsers(db)
    makeParents(db)

if __name__ == '__main__':
    main()

