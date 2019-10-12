from flask_sendgrid import SendGrid

app = Flask(__name__)
app.config['SENDGRID_API_KEY'] = 'your api key'
app.config['SENDGRID_DEFAULT_FROM'] = 'admin@yourdomain.com'
mail = SendGrid(app)

# send multiple recipients; backwards compatible with Flask-Mandrill
mail.send_email(
    from_email='someone@yourdomain.com',
    to_email=[{'email': 'test1@example.com'}, {'email': 'test2@example.com'}],
    subject='Subject'
    text='Body',
)

# send single recipient; single email as string
mail.send_email(
    from_email='someone@yourdomain.com',
    to_email='test@example.com',
    subject='Subject'
    text='Body',
)

# send single recipient; single email as sendgrid.mail.helpers.Email object
mail.send_email(
    from_email='someone@yourdomain.com',
    to_email=Email('test@example.com'),
    subject='Subject'
    text='Body',
)

# send multiple recipients; list of emails as sendgrid.mail.helpers.Email object
mail.send_email(
    from_email='someone@yourdomain.com',
    to_email=[Email('test1@example.com'), Email('test2@example.com')],
    subject='Subject'
    text='Body',
)