from flask import Flask, request
from flask_restful import Resource, Api
from flask_sendgrid import SendGrid
from database import testDB

app = Flask(__name__)
api = Api(app)
app.config['SENDGRID_API_KEY'] = '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'
app.config['SENDGRID_DEFAULT_FROM'] = 'maxjramer@gmail.com'

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

class SendEmail(Resource):
    def get(self):
        mail = SendGrid(app)

# send multiple recipients; backwards compatible with Flask-Mandrill
        mail.send_email(
            from_email='maxjramer@gmail.com',
            to_email=[{'email': 'trishacox@gmail.com'}, {'email': 'maxjramer@gmail.com'}],
            subject='Subject',
            text='Testing emails with sendgrid'
        )

api.add_resource(HelloWorld, '/')
api.add_resource(MakeUsers, '/insert')
api.add_resource(SendEmail, '/email')


if __name__ == '__main__':
    app.run(debug=True)

