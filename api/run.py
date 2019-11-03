from flask import Flask, request
from flask_restful import Resource, Api
from flask_sendgrid import SendGrid
from database import testDB
from database.emailKeysDOM import makeUser, verifyKey, verifyUser
from generateKey import generateKey 
import os

app = Flask(__name__)
api = Api(app)
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY')
app.config['SENDGRID_DEFAULT_FROM'] = 'maxjramer@gmail.com'

# look I'm a comment

@app.route('/', methods = ['GET', 'POST'])
def HelloWorld():
    listOfNums = []
    for i in range(0, 10):
        listOfNums.append(i)

    testDB.getTest()
    return {'users': testDB.getTest()}

@app.route('/insert', methods = ['GET', 'POST'])
def makeUsers():
    testDB.makeUsers()
    return {'success': True}

@app.route('/checkKey', methods = ['GET', 'POST'])
def checkKey():
    #stuff = verifyKey(13)
    return 'success', 200
    """ retrieve generated key from request parameters
    check generated key
    return email iff key exists in database
    else -> 403 errorr
 """

@app.route('/email', methods = ['GET', 'POST'])
def get():
    mail = SendGrid(app)

    # studentID = 12345
    # formNum = 1

    generatedKey = generateKey()
    # succeeded to insert into database
    succeeded =  makeUser('maxjramer@gmail.com', generatedKey)

    # doesKeyExists = verifyKey(generatedKey)
    # doesUserExists = verifyUser("maxjramer@gmail.com")

    if succeeded:
        email1 = 'trishacox@gmail.com'
        mail.send_email(
            from_email='maxjramer@gmail.com',
            to_email=[{'email': email1}],
            subject='Subject',
            html='<a href="http://localhost:3000/form/' + str(generatedKey) + '">Forms</a>'
        )
        return 'success', 200
    else:
        return 'failure', 400



if __name__ == '__main__':
    app.run(debug=True)
