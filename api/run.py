from flask import Flask, request
from flask_restful import Resource, Api
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
from bson.objectid import ObjectId
from jose import jwt
from functools import wraps
from six.moves.urllib.request import urlopen
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import cgi

app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SENDGRID_API_KEY'] = os.environ.get('SENDGRID_API_KEY') #to be put in heroku
app.config['SENDGRID_DEFAULT_FROM'] = 'anthonytranduc@gmail.com'

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

@app.route('/checkKey', methods = ['GET', 'POST'])
def checkKey():
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

def log_action(action):
    def log_action_inner(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = get_token_auth_header()

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

            usersDOM.createUser(user_info['nickname'], user_info['email'], [])
            usersDOM.addAction(user_info['nickname'], datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"), action)

            if len(tokensAndUsers.keys()) > 100:
                tokensAndUsers.clear()
                
            return f(*args, **kwargs)
        return decorated
    return log_action_inner

@app.route('/students', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get students')
def getStudents():
    students = studentsDOM.getStudents()
    forms_completed = 0
    for student in students:
        for form in student['form_ids']:
            if FormsDOM.isComplete(form):
                forms_completed += 1
        student['forms_completed'] = str(forms_completed) + "/" + str(len(student['form_ids']))
        del student['form_ids']
    return {'students':students}


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
            html_content='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">    <head>      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">      <!--[if !mso]><!-->      <meta http-equiv="X-UA-Compatible" content="IE=Edge">      <!--<![endif]-->      <!--[if (gte mso 9)|(IE)]>      <xml>        <o:OfficeDocumentSettings>          <o:AllowPNG/>          <o:PixelsPerInch>96</o:PixelsPerInch>        </o:OfficeDocumentSettings>      </xml>      <![endif]-->      <!--[if (gte mso 9)|(IE)]>  <style type="text/css">    body {width: 600px;margin: 0 auto;}    table {border-collapse: collapse;}    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}    img {-ms-interpolation-mode: bicubic;}  </style><![endif]-->      <style type="text/css">    body, p, div {      font-family: arial;      font-size: 16px;    }    body {      color: #FFFFFF;    }    body a {      color: #0068af;      text-decoration: none;    }    p { margin: 0; padding: 0; }    table.wrapper {      width:100% !important;      table-layout: fixed;      -webkit-font-smoothing: antialiased;      -webkit-text-size-adjust: 100%;      -moz-text-size-adjust: 100%;      -ms-text-size-adjust: 100%;    }    img.max-width {      max-width: 100% !important;    }    .column.of-2 {      width: 50%;    }    .column.of-3 {      width: 33.333%;    }    .column.of-4 {      width: 25%;    }    @media screen and (max-width:480px) {      .preheader .rightColumnContent,      .footer .rightColumnContent {        text-align: left !important;      }      .preheader .rightColumnContent div,      .preheader .rightColumnContent span,      .footer .rightColumnContent div,      .footer .rightColumnContent span {        text-align: left !important;      }      .preheader .rightColumnContent,      .preheader .leftColumnContent {        font-size: 80% !important;        padding: 5px 0;      }      table.wrapper-mobile {        width: 100% !important;        table-layout: fixed;      }      img.max-width {        height: auto !important;        max-width: 100% !important;      }      a.bulletproof-button {        display: block !important;        width: auto !important;        font-size: 80%;        padding-left: 0 !important;        padding-right: 0 !important;      }      .columns {        width: 100% !important;      }      .column {        display: block !important;        width: 100% !important;        padding-left: 0 !important;        padding-right: 0 !important;        margin-left: 0 !important;        margin-right: 0 !important;      }      .social-icon-column {        display: inline-block !important;      }    }  </style>      <!--user entered Head Start-->     <!--End Head user entered-->    </head>    <body>      <center class="wrapper" data-link-color="#0068af" data-body-style="background-color:#f2f4fb; color:#FFFFFF; font-size:16px; font-family:arial;">        <div class="webkit">          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f2f4fb">            <tr>              <td valign="top" bgcolor="#f2f4fb" width="100%">                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">                  <tr>                    <td width="100%">                      <table width="100%" cellpadding="0" cellspacing="0" border="0">                        <tr>                          <td>                            <!--[if mso]>    <center>    <table><tr><td width="600">  <![endif]-->                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">                                      <tr>                                        <td role="modules-container" style="padding:0px 0px 0px 0px; text-align:left; color:#FFFFFF;" bgcolor="#f2f4fb" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">    <tr>      <td role="module-content">        <p></p>      </td>    </tr>  </table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">      <tbody><tr>        <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="left">          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; height:auto !important; max-width:20% !important; width:20%;" src="http://cdn.mcauto-images-production.sendgrid.net/4b5a02c40a9e98de/b2e01ba8-b54b-40a3-b380-739ae06826d3/115x122.jpg" alt="Off Grid Adventures" width="120" data-responsive="true" data-proportionally-constrained="false">        </td>      </tr>    </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7pyDCmyDaGcm5WsBBSaEgv" data-mc-module-version="2019-10-22">      <tbody><tr>        <td style="line-height:22px; text-align:inherit; background-color:#0068af; padding:30px 0px 30px 0px;" height="100%" valign="top" bgcolor="#0068af"><div><div style="font-family: inherit; text-align: center">South Florida Jewish Academy</div><div style="font-family: inherit; text-align: center"><br></div><div style="font-family: inherit; text-align: center"><span style="font-size: 24px">You&#39;ve got a form!</span></div><div style="font-family: inherit; text-align: center"><br></div><div style="font-family: inherit; text-align: center"><span style="caret-color: rgb(255, 255, 255); color: #ffffff; font-family: arial; font-size: 16px; font-style: normal; font-variant-caps: normal; font-weight: normal; letter-spacing: normal; text-align: center; text-indent: 0px; text-transform: none; white-space: pre-wrap; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: rgb(0, 104, 175); text-decoration: none; float: none; display: inline">Please click on the below link to review and complete your students&#39; forms. Please note that this link is unique. Do not share this link with anybody!</span></div>'+ body + '<div></div></div></td>      </tr>    </tbody></table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%" data-muid="4ywPd9vJ6WFyV1Si75h9vh"><tbody><tr><td align="center" bgcolor="#0068af" class="outer-td" style="padding:10px 10px 10px 10px; background-color:#0068af;"><table border="0" cellpadding="0" cellspacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#ffffff" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a style="background-color:#ffffff; border:1px solid #ffffff; border-color:#ffffff; border-radius:3px; border-width:1px; display:inline-block; font-size:16px; font-weight:700; letter-spacing:1px; line-height:40px; padding:12px 20px 12px 20px; text-align:center; text-decoration:none; border-style:solid; color:#0068af;" href="' + target + '" target="_blank">View Forms</a></td></tr></tbody></table></td></tr></tbody></table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="mVyZz43HETwfwb72TGh4iy">      <tbody><tr>        <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">          <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">            <tbody><tr>              <td style="padding:0px 0px 3px 0px;" bgcolor="#ffffff"></td>            </tr>          </tbody></table>        </td>      </tr>    </tbody></table><div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="color:#0068af; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:center;" data-muid="txBUUpmixSjuZ5Ad69p1sX"><div class="Unsubscribe--addressLine"></div><p style="font-family:arial,helvetica,sans-serif; font-size:12px; line-height:20px;"><a target="_blank" class="Unsubscribe--unsubscribeLink zzzzzzz" href="{{{unsubscribe}}}" style=""></a></p></div></td>                                      </tr>                                    </table>                                    <!--[if mso]>                                  </td>                                </tr>                              </table>                            </center>                            <![endif]-->                          </td>                        </tr>                      </table>                    </td>                  </tr>                </table>              </td>            </tr>          </table>        </div>      </center>    </body>  </html>'
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

@app.route('/studentProfileUpdate', methods = ['POST'])
@requires_auth
@log_action('Update Profile')
def studentProfileUpdate():
    studentID = ObjectId(request.json['id'])
    basicInfo = request.json['basicInfo']

    for key, value in basicInfo.items():
        if key == '_id':
            continue
        if key == 'DOB':
            value = datetime.strptime(basicInfo['DOB'], '%m/%d/%Y')
        studentsDOM.updateInfo(studentID, key, value)

    return '0'

@app.route('/submitFormAuth', methods = ['POST'])
@requires_auth
@log_action('Submit form')
def submitFormAuth():
    form_id = request.json['form_id']
    answer_data = request.json['answer_data']
    FormsDOM.updateFormData(form_id, answer_data)
    return '0'

@app.route('/resendForms', methods = ['POST'])
@requires_auth
@log_action('Resend forms')
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
    # send emails
    for parentId in parentIds:
        emailParent(parentId, comments, message)

    result = {'success': True}
    return jsonify(result), 200


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

@app.route('/newform', methods = ['POST'])
@requires_auth
@log_action('Add form')
def addForm():
    data = request.json['data']
    form_name = request.json['formName']
    blankFormsDOM.createForm(form_name, data)
    return '0'

@app.route('/forms', methods = ['GET', 'POST'])
@requires_auth
@log_action('Get forms')
def getForms():
    return {'forms': FormsDOM.getForms()}
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
    studentId = studentsDOM.createStudent(student['firstName'], student['middleName'], student['lastName'], dateOfBirth, student['grade'], formIds, parentIds)

    for parentId in parentIds:
        parentsDOM.addStudentId(parentId, studentId)

    # send emails
    for parentId in parentIds:
        emailParent(parentId)

    return '0'

if __name__ == '__main__':
    app.run(debug=True)
