from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/SFJA"
mongo = PyMongo(app)

# Given all info, make new student
# Given student id and form id, add form to student
# Give id, string, value, update student info
# Get forms from student
