from pymongo import MongoClient


def makeStudents(db):
    students = db.students
    print('Made users')
    # def genRandomForms(n):
    #     from random import randrange
    #     forms = {}
    #     for i in range(n):
    #         forms['form' + str(i)]
    for i in range(0, 10):
        initData = {
            'first_name': 'first' + str(i),
            'middle_name': 'middle' + str(i),
            'last_name': 'last' + str(i),
            'student_id': i,
            'DOB': str(i)*4 + "-" + str(i)*2 + "-" + str(i)*2,
            'parent_ids': ["parent_1_" + str(1), "parent_2_" + str(i)]
            'email': 'user' + str(i) + '@FloridaJewishAcademy.org'
            'forms': 
        }
        result = users.insert_one(initData)
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

if __name__ == '__main__':
    main()

