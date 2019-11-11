from flask import Flask
from flask_restful import Resource, Api
from database import testDB, studentsDOM
# from bin import resetDatabase

app = Flask(__name__)
api = Api(app)

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

@app.route('/students', methods = ['GET', 'POST'])
def getStudents():
    return {'students': studentsDOM.getStudents()}

if __name__ == '__main__':
    app.run(debug=True)
