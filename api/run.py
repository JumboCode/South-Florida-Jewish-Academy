from flask import Flask, send_from_directory,send_file
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_pymongo import PyMongo
from database.emailKeysDOM import makeUser, verifyKey, verifyUser
from database.FormsDOM import getForm
from generateKey import generateKey
import os
import json
import gridfs
from database import testDB, studentsDOM, usersDOM, FormsDOM, blankFormsDOM, parentsDOM, utilitiesDOM
from flask import jsonify, request, jsonify, _request_ctx_stack
import subprocess
from datetime import datetime
from bson.objectid import ObjectId
from jose import jwt
from functools import wraps
from six.moves.urllib.request import urlopen
import gridfs
import werkzeug
import requests
from werkzeug.utils import secure_filename
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import cgi
import mimetypes
import io


UPLOAD_FOLDER = './upload'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
app = Flask(__name__)
CORS(app)
api = Api(app)
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

# we store users here to prevent 429s from Auth0
tokensAndUsers = {}

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

@app.route('/getParentInfo', methods = ['POST'])
def getParentInfo():
    currLink = request.json['curr_link']
    parentId = parentsDOM.get(currLink=currLink)
    parentInfo = parentsDOM.getParentProfile(parentId)

    if parentsDOM.isExpired(parentId):
        emailParent(parentId,'', 'Your updated link is below:')
        raise AuthError({'expired': True}, 426)

    return {
        'first_name': parentInfo['first_name'],
        'last_name': parentInfo['last_name'],
        'email': parentInfo['email'],
    }

@app.route('/getStudentsOfParent', methods = ['GET', 'POST'])
def getStudentsOfParent():
    curr_link = request.json['curr_link']
    try:
        parentId = parentsDOM.get(currLink=curr_link)
    except AssertionError as e:
        raise AuthError({'wrong link': True}, 401)
    
    all_student_ids = parentsDOM.getStudentIds(parentId)
    unarchived_student_ids = []
    for id in all_student_ids:
        if not studentsDOM.isArchived(id):
            unarchived_student_ids.append(id)

    students = []
    for id in unarchived_student_ids:
        students.append({
            'id': str(id),
            'name': studentsDOM.getFirstName(id),
        })
    return {'students': students}

@app.route('/getStudentForms', methods = ['GET', 'POST'])
def getStudentForms():
    student_id = ObjectId(request.json['student_id'])
    parent_id = parentsDOM.get(currLink=request.json['parent_key'])

    if studentsDOM.isArchived(student_id):
        raise AuthError({'archived': True}, 401)

    if parentsDOM.isExpired(parent_id):
        emailParent(parent_id,'', 'Your updated link is below:')
        raise AuthError({'expired': True}, 426)

    form_ids = studentsDOM.getAllFormIds(student_id)
    form_data = []
    for id in form_ids:
        if parent_id == FormsDOM.getParentId(id):
            blank_form_data = FormsDOM.getBlankFormId(id)  # will assert if formid does not exist
            form_data.append({
                'form_id': str(id),
                'form_name': FormsDOM.getFormName(id),
                'last_updated': FormsDOM.getLastUpdated(id),
                'last_viewed': FormsDOM.getLastViewed(id),
                'completed': FormsDOM.isComplete(id)
            })
    return {
        'form_data': form_data,
        'student_info': studentsDOM.getBasicInfo(student_id),
    }

@app.route('/getForm', methods=['GET', 'POST'])
def getForm():
    form_id = ObjectId(request.json['form_id'])
    blank_form_id = FormsDOM.getBlankFormId(form_id)
    blank_form_data = blankFormsDOM.getFormData(blank_form_id)
    form_data = FormsDOM.getFormData(form_id)

    return {
        'blank_form_data': blank_form_data,
        'form_data': form_data,
        'submitted': form_data != [],
    }

@app.route('/submitForm', methods = ['POST'])
def submitForm():
    form_id = request.json['form_id']
    answer_data = request.json['answer_data']
    FormsDOM.updateFormData(form_id, answer_data)
    return '0'





'''~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~PRIVATE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'''

def getUser(token):
    # retrieve stored user
    if token in tokensAndUsers.keys():
        user_info = tokensAndUsers[token]
    else:
        endpoint = "https://" + AUTH0_DOMAIN + "/userinfo"
        headers = {"Authorization": "Bearer " + get_token_auth_header()}
        user_info = requests.post(endpoint, headers=headers)
        if user_info.status_code == 200:
            user_info = user_info.json()
            # delete old key
            if user_info in tokensAndUsers.values():
                for key, value in tokensAndUsers.items():
                    if value == user_info:
                        to_delete = key
                        break
                del tokensAndUsers[to_delete]

            # add new key
            tokensAndUsers[token] = user_info
        else:
            user_info = {}
            user_info['nickname'] = 'error'
            user_info['email'] = 'error'
            user_info['http://role'] = 'error'



    if len(tokensAndUsers.keys()) > 100:
        tokensAndUsers.clear()

    return user_info

def log_action(action):
    def log_action_inner(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user_info = getUser(get_token_auth_header())
            usersDOM.createUser(user_info['nickname'], user_info['email'], [])
            usersDOM.addAction(user_info['nickname'], datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), action)
            return f(*args, **kwargs)
        return decorated
    return log_action_inner


def specific_roles(roles):
    def specific_roles_inner(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not isAuthorized(get_token_auth_header(), roles):
                raise AuthError({"code": "unauthorized",
                                 "description": "unauthorized to this endpoint"}, 403)
            return f(*args, **kwargs)
        return decorated
    return specific_roles_inner


def isAuthorized(token, roles):
    user_info = getUser(token)
    return user_info['http://role'] in roles

@app.route('/students', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get students')
def getStudents():
    blankFormIds = list(map(lambda currForm: ObjectId(currForm['id']), request.json['blankForms']))
    noBlankFormFilter = len(blankFormIds) == 0 # hoping caching will reduce complexity

    students = studentsDOM.getStudents()
    studentsWithForms = []
    for student in students:
        if noBlankFormFilter:
            forms_completed = 0
            for form in student['form_ids']:
                if FormsDOM.isComplete(form):
                    forms_completed += 1
            student['forms_completed'] = str(forms_completed) + "/" + str(len(student['form_ids']))
            student['completion_rate'] = forms_completed / len(student['form_ids'])
            del student['form_ids']
            studentsWithForms.append(student)

        else:
            forms_completed = 0
            forms_available = 0
            for form in student['form_ids']:
                currFormBlankFormId = FormsDOM.getBlankFormId(form)
                if currFormBlankFormId in blankFormIds:
                    if (FormsDOM.isComplete(form)):
                        forms_completed += 1
                    forms_available += 1

            if forms_available > 0:
                student['forms_completed'] = str(forms_completed) + "/" + str(forms_available)
                student['completion_rate'] = forms_completed / forms_available
                del student['form_ids']
                studentsWithForms.append(student)
    return {
        'students': studentsWithForms,
        'authorized': isAuthorized(get_token_auth_header(), ['developer', 'admin']),
        'forms': blankFormsDOM.getAll(),
    }


def escape_html(text):
    """escape strings for display in HTML"""
    return cgi.escape(text, quote=True).\
           replace(u'\n', u'<br />').\
           replace(u'\t', u'&emsp;').\
           replace(u'  ', u' &nbsp;')

def makeNote(element):
    element = escape_html(element)
    return '            <div style="font-family: inherit; text-align: center"><span style="caret-color: rgb(255, 255, 255); color: #ffffff; font-family: arial; font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; text-align: center; text-indent: 0px; text-transform: none; white-space: pre-wrap; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(0, 104, 175); text-decoration: none; float: none; display: inline">' + element + '</span></div>'

def emailParent(parentId, comments=None, message=None):
    generatedKey = generateKey()
    # succeeded to insert into database
    succeeded = parentsDOM.updateKey(parentId, generatedKey)

    send_to = parentsDOM.getEmail(parentId)

    print(comments)
    print(message)

    body = ''

    if comments is not None and message is not None:
        specialNote = True
        for comment in comments:
            if comment['comment'] != '':
                if specialNote:
                    body = body + makeNote('Special Note:')
                specialNote = False
                body = body + makeNote(blankFormsDOM.getBlankFormName(ObjectId(comment['id'])) + ' -- ' + comment['comment'])

        if message != '':
            if specialNote:
                body = body + makeNote('Special Note:')
            body = body + makeNote(message)

    #currently only sends the email if a new user could be made
    if succeeded:
        if os.environ.get('ENV') == 'dev':
            base = 'http://localhost:3000/parentdash/'
        else:
            base = 'https://sfjaforms.herokuapp.com/parentdash/'
        target = base + generatedKey
        message = Mail(
            from_email='chanlawrencet@gmail.com',
            to_emails=send_to,
            subject='South Florida Jewish Academy Forms',
            html_content='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">    <head>      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">      <!--[if !mso]><!-->      <meta http-equiv="X-UA-Compatible" content="IE=Edge">      <!--<![endif]-->      <!--[if (gte mso 9)|(IE)]>      <xml>        <o:OfficeDocumentSettings>          <o:AllowPNG/>          <o:PixelsPerInch>96</o:PixelsPerInch>        </o:OfficeDocumentSettings>      </xml>      <![endif]-->      <!--[if (gte mso 9)|(IE)]>  <style type="text/css">    body {width: 600px;margin: 0 auto;}    table {border-collapse: collapse;}    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}    img {-ms-interpolation-mode: bicubic;}  </style><![endif]-->      <style type="text/css">    body, p, div {      font-family: arial;      font-size: 16px;    }    body {      color: #FFFFFF;    }    body a {      color: #0068af;      text-decoration: none;    }    p { margin: 0; padding: 0; }    table.wrapper {      width:100% !important;      table-layout: fixed;      -webkit-font-smoothing: antialiased;      -webkit-text-size-adjust: 100%;      -moz-text-size-adjust: 100%;      -ms-text-size-adjust: 100%;    }    img.max-width {      max-width: 100% !important;    }    .column.of-2 {      width: 50%;    }    .column.of-3 {      width: 33.333%;    }    .column.of-4 {      width: 25%;    }    @media screen and (max-width:480px) {      .preheader .rightColumnContent,      .footer .rightColumnContent {        text-align: left !important;      }      .preheader .rightColumnContent div,      .preheader .rightColumnContent span,      .footer .rightColumnContent div,      .footer .rightColumnContent span {        text-align: left !important;      }      .preheader .rightColumnContent,      .preheader .leftColumnContent {        font-size: 80% !important;        padding: 5px 0;      }      table.wrapper-mobile {        width: 100% !important;        table-layout: fixed;      }      img.max-width {        height: auto !important;        max-width: 100% !important;      }      a.bulletproof-button {        display: block !important;        width: auto !important;        font-size: 80%;        padding-left: 0 !important;        padding-right: 0 !important;      }      .columns {        width: 100% !important;      }      .column {        display: block !important;        width: 100% !important;        padding-left: 0 !important;        padding-right: 0 !important;        margin-left: 0 !important;        margin-right: 0 !important;      }      .social-icon-column {        display: inline-block !important;      }    }  </style>      <!--user entered Head Start-->     <!--End Head user entered-->    </head>    <body>      <center class="wrapper" data-link-color="#0068af" data-body-style="background-color:#f2f4fb; color:#FFFFFF; font-size:16px; font-family:arial;">        <div class="webkit">          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f2f4fb">            <tr>              <td valign="top" bgcolor="#f2f4fb" width="100%">                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">                  <tr>                    <td width="100%">                      <table width="100%" cellpadding="0" cellspacing="0" border="0">                        <tr>                          <td>                            <!--[if mso]>    <center>    <table><tr><td width="600">  <![endif]-->                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">                                      <tr>                                        <td role="modules-container" style="padding:0px 0px 0px 0px; text-align:left; color:#FFFFFF;" bgcolor="#f2f4fb" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">    <tr>      <td role="module-content">        <p></p>      </td>    </tr>  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">      <tbody><tr>        <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="left">          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; height:auto !important; max-width:20% !important; width:20%;" src="http://cdn.mcauto-images-production.sendgrid.net/4b5a02c40a9e98de/b2e01ba8-b54b-40a3-b380-739ae06826d3/115x122.jpg" alt="Off Grid Adventures" width="120" data-responsive="true" data-proportionally-constrained="false">        </td>      </tr>    </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7pyDCmyDaGcm5WsBBSaEgv" data-mc-module-version="2019-10-22">      <tbody><tr>        <td style="line-height:22px; text-align:inherit; background-color:#0068af; padding:30px 0px 30px 0px;" height="100%" valign="top" bgcolor="#0068af"><div><div style="font-family: inherit; text-align: center">South Florida Jewish Academy</div><div style="font-family: inherit; text-align: center"><br></div><div style="font-family: inherit; text-align: center"><span style="font-size: 24px">You&#39;ve got a form!</span></div><div style="font-family: inherit; text-align: center"><br></div><div style="font-family: inherit; text-align: center"><span style="caret-color: rgb(255, 255, 255); color: #ffffff; font-family: arial; font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; text-align: center; text-indent: 0px; text-transform: none; white-space: pre-wrap; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(0, 104, 175); text-decoration: none; float: none; display: inline">Please click on the below link to review and complete your students&#39; forms.<br/>Please note that this link is unique and will expire in one week, when a new will be emailed to you.<br/>Do not share this link with anybody!</span></div>'+ body + '<div></div></div></td>      </tr>    </tbody></table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%" data-muid="4ywPd9vJ6WFyV1Si75h9vh"><tbody><tr><td align="center" bgcolor="#0068af" class="outer-td" style="padding:10px 10px 10px 10px; background-color:#0068af;"><table border="0" cellpadding="0" cellspacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#ffffff" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a style="background-color:#ffffff; border:1px solid #ffffff; border-color:#ffffff; border-radius:3px; border-width:1px; display:inline-block; font-size:16px; font-weight:700; letter-spacing:1px; line-height:40px; padding:12px 20px 12px 20px; text-align:center; text-decoration:none; border-style:solid; color:#0068af;" href="' + target + '" target="_blank">View Forms</a></td></tr></tbody></table></td></tr></tbody></table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="mVyZz43HETwfwb72TGh4iy">      <tbody><tr>        <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">          <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">            <tbody><tr>              <td style="padding:0px 0px 3px 0px;" bgcolor="#ffffff"></td>            </tr>          </tbody></table>        </td>      </tr>    </tbody></table><div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="color:#0068af; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:center;" data-muid="txBUUpmixSjuZ5Ad69p1sX"><div class="Unsubscribe--addressLine"></div><p style="font-family:arial,helvetica,sans-serif; font-size:12px; line-height:20px;"><a target="_blank" class="Unsubscribe--unsubscribeLink zzzzzzz" href="{{{unsubscribe}}}" style=""></a></p></div></td>                                      </tr>                                    </table>                                    <!--[if mso]>                                  </td>                                </tr>                              </table>                            </center>                            <![endif]-->                          </td>                        </tr>                      </table>                    </td>                  </tr>                </table>              </td>            </tr>          </table>        </div>      </center>    </body>  </html>'
        )
        try:
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(response.status_code)
            print(response.body)
            print(response.headers)
        except Exception as e:
            print(e)


'''====================  AUDITING ===================='''

@app.route('/users', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get users')
def getUsers():
    return {'users': usersDOM.getUsers()}

'''====================  STUDENT INFO ===================='''

@app.route('/studentProfile', methods = ['POST'])
@requires_auth
@log_action('Get student profile')
def getStudentProfile():
    studentID = ObjectId(request.json['id'])
    students_forms = studentsDOM.getForms(studentID)
    forms = []
    for formId in students_forms:
        curr_form_data_raw = FormsDOM.getForm(formId)
        formName = blankFormsDOM.getBlankFormName(curr_form_data_raw['blank_forms_id'])
        formYear = blankFormsDOM.getFormYear(curr_form_data_raw['blank_forms_id'])
        curr_form_data = dict()
        curr_form_data['form_name'] = str(formName)
        curr_form_data['form_year'] = str(formYear)
        curr_form_data['form_id'] = str(curr_form_data_raw['_id'])
        curr_form_data['blank_forms_id'] = str(curr_form_data_raw['blank_forms_id'])
        curr_form_data['last_updated'] = curr_form_data_raw['last_updated']
        curr_form_data['completed'] = FormsDOM.isComplete(formId)
        parent_data = parentsDOM.getParentProfile(ObjectId(curr_form_data_raw['parent_id']))
        curr_form_data['p_first_name'] = parent_data['first_name']
        curr_form_data['p_last_name'] = parent_data['last_name']
        curr_form_data['p_email'] = parent_data['email']
        forms.append(curr_form_data)


    parentIds = studentsDOM.getParents(studentID)
    parents = []
    for parentId in parentIds:
        parent = parentsDOM.getParentProfile(parentId)
        studentsOfParent = []
        for currStudentID in parent['student_ids']:
            student = studentsDOM.getFullInfo(currStudentID)
            forms_completed = 0
            for form in student['form_ids']:
                if FormsDOM.isComplete(form):
                    forms_completed += 1
            student['forms_completed'] = str(forms_completed) + "/" + str(len(student['form_ids']))
            student['completion_rate'] = forms_completed / len(student['form_ids'])
            cleanedStudent = {}
            cleanedStudent['id'] = str(student['_id'])
            cleanedStudent['first_name'] = student['first_name']
            cleanedStudent['middle_name'] = student['middle_name']
            cleanedStudent['last_name'] = student['last_name']
            cleanedStudent['DOB'] = student['DOB']
            cleanedStudent['grade'] = student['grade']
            cleanedStudent['archived'] = student['archived']
            cleanedStudent['forms_completed'] = student['forms_completed']
            cleanedStudent['completion_rate'] = student['completion_rate']
            studentsOfParent.append(cleanedStudent)
        cleanedParent = {}
        cleanedParent['id'] = str(parentId)
        cleanedParent['children'] = studentsOfParent
        cleanedParent['first_name'] = parent['first_name']
        cleanedParent['last_name'] = parent['last_name']
        cleanedParent['email'] = parent['email']
        parents.append(cleanedParent)
    return {
        'forms': forms,
        'basic_info': studentsDOM.getBasicInfo(studentID),
        'blank_forms': blankFormsDOM.getAll(),
        'parents': parents,
        'authorized': isAuthorized(get_token_auth_header(), ['developer', 'admin']),
        'tags': utilitiesDOM.getTags(),
    }

@app.route('/studentProfileForm', methods = ['POST'])
@requires_auth
@log_action('Get student form')
def getStudentProfileForm():
    studentID = ObjectId(request.json['student_id'])
    form_id = ObjectId(request.json['form_id'])

    form_data = FormsDOM.getFormData(ObjectId(form_id))

    blank_form_id = FormsDOM.getBlankFormId(form_id)
    blank_form_data = blankFormsDOM.getFormData(blank_form_id)

    parent_id = FormsDOM.getInfo(form_id, 'parent_id')
    parent_profile = parentsDOM.getParentProfile(parent_id)
    cleaned_parent_profile = {}
    cleaned_parent_profile['first_name'] = parent_profile['first_name']
    cleaned_parent_profile['last_name'] = parent_profile['last_name']
    cleaned_parent_profile['email'] = parent_profile['email']

    form_info = {}
    form_info['name'] = blankFormsDOM.getFormName(blank_form_id)
    form_info['last_updated'] = FormsDOM.getLastUpdated(form_id)
    form_info['completed'] = FormsDOM.isComplete(form_id)

    isAuthorizedBool = isAuthorized(get_token_auth_header(), ['developer', 'admin'])
    return {
        'form_data': form_data,
        'blank_form_data': blank_form_data,
        'basic_info': studentsDOM.getBasicInfo(studentID),
        'parent_profile': cleaned_parent_profile,
        'form_info': form_info,
        'isAuthorized': isAuthorizedBool,
    }

@app.route('/resendForms', methods = ['POST'])
@requires_auth
@log_action('Resend forms')
def resendForms():
    studentId = ObjectId(request.json['id'])
    comments = request.json['comments']
    message = request.json['message']
    newBlankForms = map(lambda form: ObjectId(form['id']), filter(lambda form: form['checked'], request.json['forms']))

    parentIds = resendForm(studentId, newBlankForms)
    for parentId in parentIds:
        emailParent(parentId, comments, message)

    result = {'success': True}
    return jsonify(result), 200


@app.route('/bulkResendEmails', methods=['POST'])
@requires_auth
@log_action('Bulk Resend Emails')
def bulkResendEmails():
    blankFormIds = list(map(lambda form: ObjectId(form['id']), request.json['blankForms']))
    students = list(map(lambda student: ObjectId(student), request.json['students']))
    message = request.json['message']
    uniqueParentIds = set()

    for student in students:
        for parentId in resendForm(student, blankFormIds):
            uniqueParentIds.add(parentId)

    # only email parents once
    for parentId in uniqueParentIds:
        emailParent(parentId, [], message)

    return '0'

def resendForm(studentId, newBlankFormIds):
    blankFormIds = map(lambda form: FormsDOM.getBlankFormId(form), studentsDOM.getForms(studentId))

    uniqueBlankFormIds = set(blankFormIds)

    parentIds = studentsDOM.getParents(studentId)

    formIds = []

    additionalBlankForms = []

    for newBlankFormId in newBlankFormIds:
        if newBlankFormId not in uniqueBlankFormIds:
            for parentId in parentIds:
                currID = FormsDOM.createForm(newBlankFormId, None, None, True, False, [], parentId)
                formIds.append(currID)
            additionalBlankForms.append(newBlankFormId)

    for formId in formIds:
        studentsDOM.addNewFormId(studentId, formId)

    # return parentIds
    return parentIds

'''====================  FORM MANAGEMENT ===================='''

@app.route('/getBlankFormDetails', methods=['GET'])
@requires_auth
@log_action('Get blank forms')
def getBlankFormDetails():
    return { 'forms': blankFormsDOM.getBlankFormDetails()}

@app.route('/deleteBlankForm', methods=['POST'])
@requires_auth
@log_action('Delete blank form')
def deleteBlankForm():
    id = request.json['form_id']
    blankFormsDOM.deleteForm(ObjectId(id))
    return '0'

@app.route('/updateFormName', methods=['POST'])
@requires_auth
@log_action('Update form name')
def updateFormName():
    id = request.json['form_id']
    form_name = request.json['form_name']
    blankFormsDOM.updateFormName(ObjectId(id), form_name)
    return '0'

@app.route('/updateFormYear', methods=['POST'])
@requires_auth
@log_action('Update form year')
def updateFormYear():
    id = request.json['form_id']
    form_year = request.json['form_year']
    blankFormsDOM.updateFormYear(ObjectId(id), form_year)
    utilitiesDOM.updateTags(form_year)
    return '0'

@app.route('/newform', methods = ['POST'])
@requires_auth
@log_action('Add form')
def addForm():
    data = request.json['data']
    form_name = request.json['formName']
    form_year = request.json['formYear']
    blankFormsDOM.createForm(form_name, form_year, data)
    utilitiesDOM.updateTags(form_year)
    return '0'

@app.route('/forms', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get forms')
def getForms():
    return {'forms': FormsDOM.getForms()}

@app.route('/getBlankForm', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get blank form')
def getBlankForm():
    blankForm_id = ObjectId(request.json['form_id'])
    return {
        'data': blankFormsDOM.getFormData(blankForm_id),
        'name': blankFormsDOM.getFormName(blankForm_id),
        'year': blankFormsDOM.getFormYear(blankForm_id)
    }

@app.route('/changeStatus', methods = ['POST'])
@requires_auth
@log_action('Status of form changed')
def changeStatus():
    form_id = ObjectId(request.json['form_id'])
    status = request.json['form_status']
    FormsDOM.changeCompletion(form_id,status)
    newStatus = not status
    return {'status': newStatus}

@app.route('/resetForm', methods = ['POST'])
@requires_auth
@log_action('Form Data Reset')
def resetForm():
    form_id = ObjectId(request.json['form_id'])
    newData = FormsDOM.clearForm(form_id)

    newData['_id'] = str(newData['_id'])
    newData['blank_forms_id'] = str(newData['blank_forms_id'])
    newData['parent_id'] = str(newData['parent_id'])
    
    return {'new_form_info':newData,}

'''====================== UPLOAD FILE ======================'''
@app.route('/saveImage', methods=['POST'])
@requires_auth
@log_action('Uploaded File')
def saveImg():
    studentId = ObjectId(request.args.get('studentId'))

    # check if the post request has the file part
    if 'file' not in request.files:
        return '0'
    file = request.files['file']
    # # if user does not select file, browser also
    # # submit an empty part without filename
    if file.filename == '':
        return '0'
    if file:
        filename = secure_filename(file.filename)
        file.save(filename)
        with open(filename, "rb") as byteFile:
            f = byteFile.read()
            fileId = fs.put(f)
            studentsDOM.addNewFile(studentId, fileId, filename)
            files = studentsDOM.getFiles(studentId)

            cleanFiles=[]

        try:
            os.remove(filename) # delete the file on the server after saved to mongo
        except:
            print(filename + ' not removable') # should not occur, but safety check
            
        for file in files:
            tempDict ={}
            tempDict['file_id'] = str(file['fileId'])
            tempDict['file_name'] = file['filename']
            cleanFiles.append(tempDict)

        return{'files': cleanFiles}

@app.route('/getFiles', methods=['POST'])
@requires_auth
@log_action('Get File')
def getFiles():
    studentId = ObjectId(request.args.get('studentId'))
    files = studentsDOM.getFiles(studentId)

    cleanFiles=[]
    for file in files:
        tempDict = {}
        tempDict['file_id'] = str(file['fileId'])
        tempDict['file_name'] = file['filename']
        cleanFiles.append(tempDict)
    
    return{'files': cleanFiles}

@app.route('/downloadFile', methods=['POST'])
@requires_auth
@log_action('Downloaded File')
def downloadFile():
    file_id = ObjectId(request.json['file_id'])
    data = fs.get(file_id)
    file_name = request.json['file_name']
    print("this is file name",file_name)
    file_type = mimetypes.MimeTypes().guess_type(str(file_name))[0]

    fileBytes = data.read()

    return send_file(io.BytesIO(fileBytes),
                         attachment_filename= file_name,
                         mimetype=file_type)

@app.route('/deleteFile', methods=['POST'])
@requires_auth
@log_action('Deleted File')
def deleteFile():
    file_id = ObjectId(request.json['file_id'])
    student_id = ObjectId(request.json['studentId'])
    fs.delete(file_id)
    files = studentsDOM.deleteFile(student_id,file_id)

    cleanFiles=[]
    for file in files:
        tempDict = {}
        tempDict['file_id'] = str(file['fileId'])
        tempDict['file_name'] = file['filename']
        cleanFiles.append(tempDict)

    return{'files': cleanFiles}

@app.route('/renameFile', methods=['POST'])
@requires_auth
@log_action('Renamed File')
def renameFile():
    file_id = ObjectId(request.json['file_id'])
    student_id = ObjectId(request.json['studentId'])
    new_file_name = request.json['newFileName']
    studentsDOM.gridFile(file_id,new_file_name)
    files = studentsDOM.renameFile(student_id,file_id,new_file_name)

    cleanFiles=[]
    for file in files:
        tempDict = {}
        tempDict['file_id'] = str(file['fileId'])
        tempDict['file_name'] = file['filename']
        cleanFiles.append(tempDict)

    return{'files': cleanFiles}
 
'''======================  ADD STUDENT ======================'''

@app.route('/getAllForms', methods=['GET'])
@requires_auth
@log_action('Get all forms')
def getAllForms():
    return { 'forms': blankFormsDOM.getAll()}

@app.route('/addStudent', methods = ['POST'])
@requires_auth
@log_action('Add student')
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
    studentId = studentsDOM.createStudent(student['firstName'], student['middleName'], student['lastName'], dateOfBirth, int(student['grade']), formIds, parentIds, student['class'])

    for parentId in parentIds:
        parentsDOM.addStudentId(parentId, studentId)

    # send emails
    for parentId in parentIds:
        emailParent(parentId)

    return '0'

'''======================  HIGHER ROLE ENDPOINTS ======================'''
@app.route('/checkRoleAdmin', methods = ['GET'])
@requires_auth
@log_action('check role admin')
def checkRoleAdmin():
    isAuthorizedBool = isAuthorized(get_token_auth_header(), ['developer', 'admin'])
    return {
        'isAuthorized': isAuthorizedBool,
        'numArchived': len(studentsDOM.getArchivedStudents()) if isAuthorizedBool else 0,
        'cacheSize': len(tokensAndUsers) if isAuthorizedBool else 0,
    }

@app.route('/archiveStudent', methods = ['POST'])
@requires_auth
@log_action('archive student')
@specific_roles(['admin', 'developer'])
def archiveStudent():
    studentID = ObjectId(request.json['id'])
    studentsDOM.updateInfo(studentID, 'archived', True)
    return '0'

@app.route('/unarchiveStudent', methods = ['POST'])
@requires_auth
@log_action('unarchive student')
@specific_roles(['admin', 'developer'])
def unarchiveStudent():
    studentID = ObjectId(request.json['id'])
    studentsDOM.updateInfo(studentID, 'archived', False)
    return '0'

@app.route('/changeGrades', methods = ['POST'])
@requires_auth
@log_action('change grades')
@specific_roles(['admin', 'developer'])
def changeGrades():
    studentsDOM.changeGrades(int(request.json['difference']))
    return '0'

@app.route('/dataDownload', methods = ['POST'])
@requires_auth
@log_action('data download')
@specific_roles(['admin', 'developer'])
def dataDownload():
    toDownload = request.json['toDownload']
    if toDownload == 'students':
        subprocess.call('rm -f students.csv', shell=True)
        subprocess.call('mongoexport --db sfja --collection students --type=csv --fields _id,first_name,middle_name,last_name,grade,DOB,archived,parent_ids,form_ids --out students.csv', shell=True)
        return send_from_directory('.', 'students.csv', as_attachment=True)
    elif toDownload == 'parents':
        subprocess.call('rm -f parents.csv', shell=True)
        subprocess.call('mongoexport --db sfja --collection parents --type=csv --fields _id,first_name,last_name,email,student_ids --out parents.csv', shell=True)
        return send_from_directory('.', 'parents.csv', as_attachment=True)
    elif toDownload == 'forms':
        subprocess.call('rm -f forms.csv', shell=True)
        subprocess.call('mongoexport --db sfja --collection forms --type=csv --fields _id,blank_forms_id,parent_id,last_updated,last_viewed,completed,form_data --out forms.csv', shell=True)
        return send_from_directory('.', 'forms.csv', as_attachment=True)
    elif toDownload == 'users':
        subprocess.call('rm -f users.csv', shell=True)
        subprocess.call('mongoexport --db sfja --collection users --type=csv --fields _id,user_id,email,actions --out users.csv', shell=True)
        return send_from_directory('.', 'users.csv', as_attachment=True)


def deleteStudents(toDeleteStudents):
    parentsToUpdate = set()
    for student in toDeleteStudents:
        studentsDOM.deleteStudent(student['_id'])
        for formId in student['form_ids']:
            parentsToUpdate.add((FormsDOM.getParentID(formId), student['_id']))
            FormsDOM.deleteForm(formId)

    for (parentId, studentId) in parentsToUpdate:
        parentsDOM.removeStudentId(parentId, studentId)

@app.route('/deleteArchivedStudents', methods = ['POST'])
@requires_auth
@log_action('delete archived students')
@specific_roles(['admin', 'developer'])
def deleteArchivedStudents():
    toDeleteStudents = studentsDOM.getArchivedStudents()
    deleteStudents(toDeleteStudents)

    return {
        'numDeleted': len(toDeleteStudents)
    }

@app.route('/deleteStudent', methods = ['POST'])
@requires_auth
@log_action('delete archived students')
@specific_roles(['admin', 'developer'])
def deleteStudent():
    student = studentsDOM.getFullInfo(ObjectId(request.json['id']))
    deleteStudents([student])
    return {
        'success': True,
    }

@app.route('/clearLogins', methods = ['POST'])
@requires_auth
@log_action('clear logins')
@specific_roles(['admin', 'developer'])
def clearLogins():
    tokensAndUsers.clear()
    return {
        'success': True,
    }

@app.route('/submitFormAuth', methods = ['POST'])
@requires_auth
@log_action('Submit form')
@specific_roles(['admin', 'developer'])
def submitFormAuth():
    form_id = request.json['form_id']
    answer_data = request.json['answer_data']
    FormsDOM.updateFormData(form_id, answer_data)
    return '0'

@app.route('/studentProfileUpdate', methods = ['POST'])
@requires_auth
@log_action('Update Profile')
@specific_roles(['admin', 'developer'])
def studentProfileUpdate():
    studentID = ObjectId(request.json['id'])
    basicInfo = request.json['basicInfo']

    for key, value in basicInfo.items():
        if key == '_id':
            continue
        if key == 'archived':
            continue
        if key == 'DOB':
            value = datetime.strptime(basicInfo['DOB'], '%m/%d/%Y')
        studentsDOM.updateInfo(studentID, key, value)

    return '0'
if __name__ == '__main__':
    app.run(debug=True)