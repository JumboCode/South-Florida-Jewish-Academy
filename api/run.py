from flask import Flask, request
from flask_restful import Resource, Api
from flask_sendgrid import SendGrid
from flask_cors import CORS
from database.emailKeysDOM import makeUser, verifyKey, verifyUser
from database.FormsDOM import getForm
from generateKey import generateKey 
import os
import json
from database import testDB, studentsDOM, usersDOM, assets, FormsDOM, blankFormsDOM, parentsDOM
from flask import jsonify, request, jsonify, _request_ctx_stack
import subprocess
from datetime import datetime
from database.assets.audit_mapper import audit_mapper as audit
from bson.objectid import ObjectId
from jose import jwt
from functools import wraps
from six.moves.urllib.request import urlopen


app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY') #to be put in heroku
app.config['SENDGRID_DEFAULT_FROM'] = 'anthonytranduc@gmail.com'

AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
API_IDENTIFIER = os.environ.get('API_IDENTIFIER')
ALGORITHMS = ["RS256"]


# big thanks to https://auth0.com/docs/quickstart/backend/python/01-authorization?download=true
# Format error response and append status code.
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def get_token_auth_header():
    """Obtains the access token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_scope(required_scope):
    """Determines if the required scope is present in the access token
    Args:
        required_scope (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("scope"):
        token_scopes = unverified_claims["scope"].split()
        for token_scope in token_scopes:
            if token_scope == required_scope:
                return True
    return False


def requires_auth(f):
    print ("requires auth")
    """Determines if the access token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError:
            raise AuthError({"code": "invalid_header1",
                            "description":
                                "Invalid header. "
                                "Use an RS256 signed JWT Access Token"}, 401)
        if unverified_header["alg"] == "HS256":
            raise AuthError({"code": "invalid_header2",
                            "description":
                                "Invalid header. "
                                "Use an RS256 signed JWT Access Token"}, 401)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_IDENTIFIER,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    " please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 401)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 401)
    return decorated


'''~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~API~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'''





'''~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PUBLIC~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'''

'''==================== PARENT/STUDENT DASHBOARDS ===================='''
@app.route('/getStudentsOfParent', methods = ['GET', 'POST'])
def getStudentsOfParent():
    curr_link = request.json['curr_link']
    student_ids = parentsDOM.listStudents(curr_link)
    student_names = []
    for id in student_ids:
        student_names.append(studentsDOM.getName(ObjectId(id)))
    return {'student_ids': student_ids, 'student_names': student_names}

@app.route('/getStudentForms', methods = ['GET', 'POST'])
def getStudentForms():
    student_id = request.json['student_id']
    form_ids = studentsDOM.getAllFormIds(ObjectId(student_id))
    form_names = []
    for id in form_ids:
        form_names.append(FormsDOM.getFormName(ObjectId(id)))
    return {'form_ids': form_ids,
            'form_names': form_names}

@app.route('/getForm', methods=['GET', 'POST'])
def getForm():
    print("HELLO HERERE")
    form_id = request.json['form_id']
    blank_form_data = FormsDOM.getBlankForm(form_id)
    form_data = FormsDOM.getFormData(form_id)

    print(blank_form_data)
    return {'blank_form_data' : blank_form_data,
            'form_data' : form_data}

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


'''~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PRIVATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'''


@app.route('/students', methods = ['GET', 'POST'])
@requires_auth
def getStudents():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_students"])
    students = studentsDOM.getStudents()
    forms_completed = 0
    for student in students:
        for form in student['form_ids']:
            if FormsDOM.isComplete(form):
                forms_completed += 1
        student['forms_completed'] = str(forms_completed) + "/" + str(len(student['form_ids']))
        del student['form_ids']
    return {'students':students}

# accepts ObjectId parentId
def emailParent(parentId):
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["email"])
    # mail = SendGrid(app)
    #generates a unique key
    generatedKey = generateKey()
    # succeeded to insert into database
    parentsDOM.updateKey(parentId, generateKey())

    # #currently only sends the email if a new user could be made
    # if succeeded:
    #     email1 = 'anthonytranduc@gmail.com' #to be a given parent email
    #     mail.send_email(
    #         from_email='anthonytranduc@gmail.com',
    #         to_email=[{'email': email1}],
    #         subject='Subject',
    #         html='<a href="http://localhost:5000/form/' + str(generatedKey) + '">Forms</a>'
    #     )
    #     return 'success', 200
    # else:
    #     return 'failure', 400


'''====================  AUDITING ===================='''

@app.route('/users', methods = ['GET', 'POST'])
@requires_auth
def getUsers():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_users"])
    return {'users': usersDOM.getUsers()}

'''====================  STUDENT INFO ===================='''

@app.route('/studentProfile', methods = ['POST'])
@requires_auth
def getStudentProfile():
    usersDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_student_forms"])
    studentID = ObjectId(request.json['id'])
    students_forms = studentsDOM.getForms(studentID)
    forms = []
    for formId in students_forms:
        curr_form_data = FormsDOM.getForm(formId)
        formName = blankFormsDOM.getBlankFormName(curr_form_data['blank_forms_id'])
        curr_form_data['form_name'] = str(formName)
        del curr_form_data['blank_forms_id']
        parent_data = parentsDOM.getParentProfile(ObjectId(curr_form_data['parent_id']))
        del curr_form_data['parent_id']
        curr_form_data['p_first_name'] = parent_data['first_name']
        curr_form_data['p_last_name'] = parent_data['last_name']
        curr_form_data['p_email'] = parent_data['email']
        forms.append(curr_form_data)
            
    return {
        'forms': forms,
        'basic_info': studentsDOM.getBasicInfo(studentID)
    }

# returns blank form IDs and names of forms to be filled out for the student
@app.route('/studentProfileBlankForms', methods = ['POST'])
# @requires_auth
def getStudentBlankForms():
    studentId = ObjectId(request.json['id'])
    student_forms = studentsDOM.getForms(studentId)
    forms = []
    for formID in student_forms:
        blankFormId = FormsDOM.getInfo(formID, 'blank_forms_id')
        print(formID, blankFormId)
        d = dict()
        d['blankFormName'] = blankFormsDOM.getBlankFormName(blankFormId)
        d['blankFormId'] = str(blankFormId)
        forms.append(d)

    return {'forms': forms}

'''====================  FORM MANAGEMENT ===================='''

@app.route('/getBlankFormDetails', methods=['GET'])
@requires_auth
def getBlankFormDetails():
    return { 'forms': blankFormsDOM.getBlankFormDetails()}

@app.route('/deleteBlankForm', methods=['POST'])
@requires_auth
def deleteBlankForm():
    id = request.json['form_id']
    blankFormsDOM.deleteForm(ObjectId(id))
    return '0'

@app.route('/updateFormName', methods=['POST'])
@requires_auth
def updateFormName():
    id = request.json['form_id']
    form_name = request.json['form_name']
    blankFormsDOM.updateFormName(ObjectId(id), form_name)
    return '0'

@app.route('/newform', methods = ['POST'])
@requires_auth
def addForm():

    byte_data = request.data.decode('utf8').replace("'", '"')
    data = json.loads(byte_data)
    data_json = json.dumps(data, indent=4, sort_keys=True)
    blankFormsDOM.createForm(data_json)
    return '0'

'''======================  ADD STUDENT ======================'''

@app.route('/getAllForms', methods=['GET'])
@requires_auth
def getAllForms():
    return { 'forms': blankFormsDOM.getAll()}

@app.route('/addStudent', methods = ['POST'])
@requires_auth
def addStudent():
    student = request.json['studentData']

    parentIds = []
    parents = request.json['parentData']
    for parent in parents:
        currID = None
        if parentsDOM.exists(parent['email']):
            currID = parentsDOM.get(email=parent['email'])
        else:
            currID = parentsDOM.createParent(parent['firstName'], parent['lastName'], parent['email'])
        parentIds.append(currID)

    formIds = []
    for form in request.json['forms']:
        for parentId in parentIds:
            id = form['id']
            # createForm(id, date, required, comp, data, parentID):
            currID = FormsDOM.createForm(ObjectId(id), None, None, True, False, None, parentId)
            formIds.append(currID)


    dateOfBirth = datetime.strptime(student['dob'], '%m/%d/%Y')
    studentId = studentsDOM.createStudent(student['firstName'], student['middleName'], student['lastName'], dateOfBirth, student['grade'], formIds, parentIds)

    for parentId in parentIds:
        parentsDOM.addStudentId(parentId, studentId)

    # send emails
    for parentId in parentIds:
        emailParent(parentId)

    return '0'

if __name__ == '__main__':
    app.run(debug=True)
