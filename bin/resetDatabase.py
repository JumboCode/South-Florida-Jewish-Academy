from pymongo import MongoClient


def makeStudents(db):
    students = db.students
    print('Made users')
    def genRandomForms(n):
        forms = {}
        for i in range(3):
            forms[str((n + i) % 5)] = str(n) + str(i)
        return forms
    for i in range(0, 10):
        initData = {
            'first_name': 'first' + str(i),
            'middle_name': 'middle' + str(i),
            'last_name': 'last' + str(i),
            'student_id': i,
            'DOB': str(i)*4 + "-" + str(i)*2 + "-" + str(i)*2,
            'parent_ids': ["parent_1_" + str(1), "parent_2_" + str(i)],
            'email': 'user' + str(i) + '@FloridaJewishAcademy.org',
            'forms': genRandomForms(i)
        }
        result = students.insert_one(initData)
        print('Inserted ', result.inserted_id)

def makeForms(db):
    forms = db.forms
    print("Made forms")

    def genFormData():
        q_n_a = {}
        for i in range(4):
            q_n_a[str(i)] = i % 2
        return q_n_a

    for i in range(0, 10):
        for j in range(0, 3):
            initData = {
                ## ensures that each form for generated student exists in form collection
                'form_id': str(i) + str(j),
                'last_updated': str(i) * 4 + '-' + str(i) * 2 + '-' + str(i) * 2,
                'last_viewed': str(j) * 4 + '-' + str(j) * 2 + '-' + str(j) * 2,
                'required': True,
                'form_num': (i + j) % 5,
                'percent_completed': .45,
                'form_data': genFormData()
            }
    result = forms.insert_one(initData)
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
    makeStudents(db)
    makeForms(db)

if __name__ == '__main__':
    main()

