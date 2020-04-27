from flask import Flask, request, flash, request
from flask_restful import Resource, Api
from flask_sendgrid import SendGrid
from flask_cors import CORS
from flask_pymongo import PyMongo
from database.emailKeysDOM import makeUser, verifyKey, verifyUser
from database.FormsDOM import getForm
from generateKey import generateKey 
import os
import json
import gridfs
from database import testDB, studentsDOM, usersDOM, assets, FormsDOM, blankFormsDOM, parentsDOM
from flask import jsonify, request, jsonify, _request_ctx_stack
import subprocess
from datetime import datetime
from database.assets.audit_mapper import audit_mapper as audit
from bson.objectid import ObjectId
from jose import jwt
from functools import wraps
from six.moves.urllib.request import urlopen
import gridfs
import werkzeug
import requests
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = './upload'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
app = Flask(__name__)
CORS(app)
api = Api(app)
# fs = gridfs.GridFS(db)
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY') #to be put in heroku
app.config['SENDGRID_DEFAULT_FROM'] = 'anthonytranduc@gmail.com'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

MONGO_URL = os.environ.get('MONGODB_URI')
app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)
db = mongo.db
fs = gridfs.GridFS(db)
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
    form_data = []
    for id in form_ids:
        curr_form = {'form_id' : id,
                     'form_name' : FormsDOM.getFormName(ObjectId(id)),
                     'last_updated' : FormsDOM.getLastUpdated(ObjectId(id)),
                     'last_viewed' : FormsDOM.getLastViewed(ObjectId(id))}
        form_data.append(curr_form)
    return {'form_data': form_data}

@app.route('/getForm', methods=['GET', 'POST'])
def getForm():
    form_id = request.json['form_id']
    blank_form_data = FormsDOM.getBlankForm(ObjectId(form_id))
    form_data = FormsDOM.getFormData(ObjectId(form_id))

    return {'blank_form_data' : blank_form_data,
            'form_data' : form_data}
  
@app.route('/forms', methods = ['GET', 'POST'])
def getForms():
    # FormsDOM.addAction(1, datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), audit["get_forms"])
    return {'forms': FormsDOM.getForms()}

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

@app.route('/submitForm', methods = ['POST'])
def submitForm():
    form_id = request.json['form_id']
    answer_data = request.json['answer_data']
    FormsDOM.updateFormData(form_id, answer_data)
    return '0'





'''~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PRIVATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'''


@app.route('/students', methods = ['GET', 'POST'])
@requires_auth
def getStudents():
    endpoint = "https://" + AUTH0_DOMAIN + "/userinfo"
    headers = {"Authorization": "Bearer " + get_token_auth_header()}
    print(requests.post(endpoint, headers=headers).json())
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
        curr_form_data_raw = FormsDOM.getForm(formId)
        formName = blankFormsDOM.getBlankFormName(curr_form_data_raw['blank_forms_id'])
        curr_form_data = dict()
        curr_form_data['form_name'] = str(formName)
        curr_form_data['form_id'] = str(curr_form_data_raw['_id'])
        curr_form_data['blank_forms_id'] = str(curr_form_data_raw['blank_forms_id'])
        curr_form_data['last_updated'] = curr_form_data_raw['last_updated']
        parent_data = parentsDOM.getParentProfile(ObjectId(curr_form_data_raw['parent_id']))
        curr_form_data['p_first_name'] = parent_data['first_name']
        curr_form_data['p_last_name'] = parent_data['last_name']
        curr_form_data['p_email'] = parent_data['email']
        forms.append(curr_form_data)


        parentIds = studentsDOM.getParents(studentID)
        parents = []
        for parentId in parentIds:
            parents.append(parentsDOM.getParentProfile(parentId))

        return {
            'forms': forms,
            'basic_info': studentsDOM.getBasicInfo(studentID),
            'blank_forms': blankFormsDOM.getAll(),
            'parents': parents
        }

@app.route('/studentProfileForm', methods = ['POST'])
def getStudentProfileForm():
    studentID = ObjectId(request.json['student_id'])
    form_id = ObjectId(request.json['form_id'])

    form_data = FormsDOM.getFormData(ObjectId(form_id))

    blank_form_id = FormsDOM.getBlankFormId(form_id)
    blank_form_data = blankFormsDOM.getFormData(blank_form_id)

    parent_id = FormsDOM.getInfo(form_id, 'parent_id')
    parent_profile = parentsDOM.getParentProfile(parent_id)

    form_info = {}
    form_info['name'] = blankFormsDOM.getFormName(blank_form_id)
    form_info['last_updated'] = FormsDOM.getLastUpdated(form_id)
    form_info['completed'] = FormsDOM.isComplete(form_id)

    return {
        'form_data': form_data,
        'blank_form_data': blank_form_data,
        'basic_info': studentsDOM.getBasicInfo(studentID),
        'parent_profile': parent_profile,
        'form_info': form_info
    }

@app.route('/submitFormAuth', methods = ['POST'])
@requires_auth
def submitFormAuth():
    form_id = request.json['form_id']
    answer_data = request.json['answer_data']
    FormsDOM.updateFormData(form_id, answer_data)
    return '0'

@app.route('/resendForms', methods = ['POST'])
@requires_auth
def resendForms():
    studentId = ObjectId(request.json['id'])
    comments = request.json['comments']
    message = request.json['message']
    newBlankForms = request.json['forms']

    currFormIds = studentsDOM.getForms(studentId)
    blankFormIds = []
    for currFormId in currFormIds:
        blankFormIds.append(FormsDOM.getBlankFormId(currFormId))

    uniqueBlankFormIds = set(blankFormIds)

    parentIds = studentsDOM.getParents(studentId)

    formIds = []

    additionalBlankForms = []

    for newBlankForm in newBlankForms:
        newBlankFormId = ObjectId(newBlankForm['id'])
        if newBlankForm['checked'] and newBlankFormId not in uniqueBlankFormIds:
            for parentId in parentIds:
                # createForm(id, date, required, comp, data, parentID):
                currID = FormsDOM.createForm(newBlankFormId, None, None, True, False, None, parentId)
                formIds.append(currID)
            additionalBlankForms.append(newBlankFormId)

    for formId in formIds:
        studentsDOM.addNewFormId(studentId, formId)

    ## send email here!
    result = {'success': True}
    return jsonify(result), 200


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
    data = request.json['data']
    form_name = request.json['formName']
    blankFormsDOM.createForm(form_name, data)
    return '0'
'''====================== UPLOAD FORM ======================'''
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/saveImage', methods=['POST'])
def saveImg():
    print(request.files)
    print("In saveImg!")
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return '0'
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return '0'
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(filename)
            with open(filename , "rb") as byteFile:
                f = byteFile.read()
                fsId = fs.put(f)
                print(fsId)
                return '0'
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
            currID = FormsDOM.createForm(ObjectId(id), None, None, True, False, [], parentId)
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
