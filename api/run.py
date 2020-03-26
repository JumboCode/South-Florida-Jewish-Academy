from flask import Flask, request
from flask_restful import Resource, Api
from flask_sendgrid import SendGrid
from flask_cors import CORS
from database.emailKeysDOM import makeUser, verifyKey, verifyUser
from generateKey import generateKey 
import os
import json
from database import testDB, studentsDOM, usersDOM, assets, FormsDOM, blankFormsDOM, parentsDOM
from flask import jsonify
import subprocess
from datetime import datetime
from database.assets.audit_mapper import audit_mapper as audit

app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY') #to be put in heroku
app.config['SENDGRID_DEFAULT_FROM'] = 'anthonytranduc@gmail.com'

# look I'm a comment

@app.route('/resetDatabase', methods=['GET', 'POST'])
def resetDatabase():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["reset"])
    subprocess.call('python3 ../bin/resetDatabase.py', shell=True)
    return jsonify({'done': True})

@app.route('/', methods = ['GET', 'POST'])
def HelloWorld():
    usersDOM.addAction(2, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["home"])
    listOfNums = []
    for i in range(0, 10):
        listOfNums.append(i)

    testDB.getTest()
    return {'users': testDB.getTest()}

@app.route('/insert', methods = ['GET', 'POST'])
def makeUsers():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["insert"])
    testDB.makeUsers()
    return {'success': True}

@app.route('/checkKey', methods = ['GET', 'POST'])
def checkKey():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["check_key"])
    #checkKey only works with json requests, so you can't test it without the front end 
    print(request.json['key'])
    result = verifyKey(int(request.json['key']))
    print(result)
    if result:
        return 'success', 200
    else:
        return 'denied', 403

    """ retrieve generated key from request parameters
    check generated key
    return email iff key exists in database
    else -> 403 errorr
 """

@app.route('/email', methods = ['GET', 'POST'])
def get():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["email"])
    mail = SendGrid(app)
    #generates a unique key
    generatedKey = generateKey()
    # succeeded to insert into database
    succeeded =  makeUser('anthonytranduc@gmail.com', generatedKey)

    #currently only sends the email if a new user could be made
    if succeeded:
        email1 = 'anthonytranduc@gmail.com' #to be a given parent email
        mail.send_email(
            from_email='anthonytranduc@gmail.com',
            to_email=[{'email': email1}],
            subject='Subject',
            html='<a href="http://localhost:5000/form/' + str(generatedKey) + '">Forms</a>'
        )
        return 'success', 200
    else:
        return 'failure', 400

@app.route('/students', methods = ['GET', 'POST'])
def getStudents():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_students"])
    return {'students': studentsDOM.getStudents()}


@app.route('/newform', methods = ['POST'])
def addForm():
    
    byte_data = request.data.decode('utf8').replace("'", '"')
    data = json.loads(byte_data)
    data_json = json.dumps(data, indent=4, sort_keys=True)
    blankFormsDOM.createForm(data_json)
    return '0'

@app.route('/users', methods = ['GET', 'POST'])
def getUsers():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_users"])
    return {'users': usersDOM.getUsers()}

@app.route('/getStudentsOfParent', methods = ['GET', 'POST'])
def getStudentsOfParent():
    _id = request.json['_id']
    return {'students_ids': parentsDOM.listStudents(_id)}
        

if __name__ == '__main__':
    app.run(debug=True)
