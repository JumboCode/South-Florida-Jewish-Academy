from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)

#look I'm a comment
class HelloWorld(Resource):
    def get(self):
        listOfNums = []
        for i in range(0, 10):
            listOfNums.append(i)

        return {'list': listOfNums }

api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run(debug=True)

