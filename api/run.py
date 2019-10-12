from flask import Flask
from flask_restful import Resource, Api
from database import testDB

app = Flask(__name__)
api = Api(app)

# look I'm a comment


class HelloWorld(Resource):
    def get(self):
        listOfNums = []
        for i in range(0, 10):
            listOfNums.append(i)

        testDB.getTest()
        return {'users': testDB.getTest()}

class MakeUsers(Resource):
    def get(self):
        testDB.makeUsers()
        return {'success': True}

# pip install flask-sendgrid

class SendEmail(Resource):
    def email(self):
        mail = SendGrid(app)

# send multiple recipients; backwards compatible with Flask-Mandrill
        mail.send_email(
            from_email='maxjramer@gmail.com',
            to_email=[{'email': 'trishacox@gmail.com'}, {'email': 'maxjramer@gmail.com'}],
            subject='Subject'
            text='Testing emails with sendgrid',
        )

api.add_resource(HelloWorld, '/')
api.add_resource(MakeUsers, '/insert')
api.add_resource(SendEmail, '/email')


if __name__ == '__main__':
    app.run(debug=True)

