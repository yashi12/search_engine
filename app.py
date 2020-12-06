from datetime import timedelta

from flask import Flask, render_template, url_for, request, session, redirect
import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth, db
from firebase import Firebase
import os
import threading
from datetime import datetime
from validate_email import validate_email
import dns.resolver
import os

import scraper
import keywordExtractor
fbconfig={}
fbAdminConfig = {}

if os.path.isfile("fbconfig.json"): # local development
	fbconfig = json.load(open('./fbconfig.json'))
else:
    fbconfig = {
        "apiKey": os.environ.get('API_KEY'),
        "authDomain": os.environ.get('AUTH_DOMAIN'),
        "databaseURL": os.environ.get('DATABASE_URL'),
        "projectId": os.environ.get('PROJECT_ID'),
        "storageBucket": os.environ.get('STORAGE_BUCKET'),
        "messagingSenderId": os.environ.get('MESSAGING_SENDER_ID'),
        "appId": os.environ.get('APP_ID'),
        "measurementId": os.environ.get('MEASUREMENT_ID')
    }
# if os.path.isfile(".env"):
#     print("found the file")
#     with open(".env") as f:
#
#         env_vars = f.readlines()
#         for env_var in env_vars:
#             print("env_var",env_var)
#             k, v  = env_var.split("=")
#             k, v  = k.strip(),v.strip()
#
#             if k in os.environ:
#                 continue
#             os.environ[k] = v
if os.path.isfile("fbAdminConfig.json"): # local development
    fbAdminConfig = json.load(open('./fbAdminConfig.json'))
else:
    fbAdminConfig = {
        "type": os.environ.get('TYPE'),
        "project_id": os.environ.get('PROJECT_ID'),
        "private_key_id": os.environ.get('PRIVATE_KEY_ID'),
        "private_key": os.environ.get('PRIVATE_KEY'),
        "client_email": os.environ.get('CLIENT_EMAIL'),
        "client_id": os.environ.get('CLIENT_ID'),
        "auth_uri": os.environ.get('AUTH_URI'),
        "token_uri": os.environ.get('TOKEN_URI'),
        "auth_provider_x509_cert_url": os.environ.get('AUTH_PROVIDER_X509_CERT_URL'),
        "client_x509_cert_url": os.environ.get('CLIENT_X509_CERT_URL')
    }

# print("apikey", os.environ["apikey"])
# print(os.environ["MAILGUN_SECRET_KEY"])
# print(os.environ["SECRET"])
# cr = os.environ.get('', None)
# print("cred",os.getenv('MAILGUN_SECRET_KEY'))
firebase_app = Firebase(json.load(open('./fbconfig.json')))
# firebase_app = Firebase(config=fbconfig)
app = Flask(__name__)
app.secret_key = os.urandom(24)
# Connect to firebase
cred = credentials.Certificate(fbAdminConfig)
cred = credentials.Certificate(json.load(open('./fbAdminConfig.json')))
# firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('./fbconfig.json')))
# pb = pyrebase.initialize_app(config=fbconfig)

auth = pb.auth()

cources = [
    {
        'name': 'Node Js',
        'author': 'Jmaes Bond',
        'reviews': '78',
        'date': '12/01/2000',
        'img': 'https://i.ytimg.com/vi/TlB_eWDSMt4/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDknTftRw_zmEvsI8lqYBxE0vlKnQ" class="card-img" alt="Best Ever Content!'
    },
    {
        'name': 'Begineer Node Js',
        'author': 'haerry Bond',
        'reviews': '78',
        'date': '12/01/2000',
        'img': 'https://i.ytimg.com/vi/TlB_eWDSMt4/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDknTftRw_zmEvsI8lqYBxE0vlKnQ" class="card-img" alt="Best Ever Content!'
    }
]
users = [{'uid': 1, 'name': 'Noah Schairer'}]
print(pyrebase)


# Api route to get users
@app.route('/api/userinfo')
def userinfo():
    return {'data': users}, 200


def findTop3():
    # try:
    lst = []
    top3 = pb.database().child('topic').order_by_child('count').limit_to_last(3)

    topSillsTitle = top3.get().val().keys()

    for skill in topSillsTitle:
        print(skill)
        topSkills = {
            "skill_count": firebase_app.database().child('topic').child(skill).child('count').get().val(),
            "skill_name": skill,
            "skill_image": firebase_app.database().child('topic').child(skill).child('udemy').child('0').child(
                'course_image').get().val(),
            # "skill_link":
        }
        lst.append(topSkills)
    print("lst", lst)
    x = 0
    for skill in lst:
        firebase_app.database().child('topSkills').child(x).set(skill)
        x += 1
    # except:
    #     print("error")

def checkTop3(lst):
    if pb.database().child('topSkills').get().val() is not None:
        for skill in pb.database().child('topSkills').get().val():
            print("sk", skill)
            lst.append(skill)
    if pb.database().child('topic').get().val() is not None:
        print("finding")
        threading.Thread(target=findTop3).start()

# Main page
@app.route('/', methods=['GET', 'POST'])
def mainPage():
    lst = []
    checkTop3(lst)
    # print("lst from db",lst)
    for skill in lst:
        for title, val in skill.items():
            print("title", title)
            print("val", val)
    print("auth", auth)
    if 'idToken' in session:
        idToken = session['idToken']
        # print(idToken)
        user = pb.auth().get_account_info(id_token=idToken)
        # print("user",user)
        return render_template('searchBar.html', userLogin=True, topSkills=lst,skillOfWeek=True)
        # before the 1 hour expiry:
        user = auth.refresh(user['refreshToken'])
    return render_template('searchBar.html', topSkills=lst,skillOfWeek=True)
    # return render_template('skillOfWeek.html')


# Api route to sign up a new user
@app.route('/api/signup', methods=['POST'])
def signup():
    email = request.form['email']
    password = request.form['password']
    confirmPassword = request.form['confirmPassword']
    if email is None or password is None:
        return render_template('register.html',missingEmail = "Please enter valid mail")
        # return {'message': 'Error missing email or password'}, 400
    if password != confirmPassword:
        return render_template('register.html',incorrectPassword = "Incorrect Password")
        # return {'message': 'Password do not match'}, 400
    try:
        user = auth.create_user_with_email_and_password(email, password)
        print(user)
        auth.send_email_verification(user['idToken'])
        return render_template('login.html')
    except:
        return render_template('register.html',userNotCreated = "Please try again!!")
        # return {'message': 'Error creating user'}, 400


# Api route to get a new token for a valid user
@app.route('/api/token', methods=['POST'])
def token():
    email = request.form['email']
    password = request.form['password']
    try:
        user = pb.auth().sign_in_with_email_and_password(email, password)
        emailVerifyStatus = auth.get_account_info(user['idToken'])['users'][0]['emailVerified']
        print(emailVerifyStatus)
        if emailVerifyStatus == True:
            print("verified")
            # before the 1 hour expiry:
            user = auth.refresh(user['refreshToken'])
            # print("user", user)
            # print("acc info", auth.get_account_info(user['idToken']))
            session['idToken'] = user['idToken']
            # session.permanent = True
            # app.permanent_session_lifetime = timedelta(minutes=30)
            # print("session", session['idToken'])
            return redirect(url_for('mainPage'))
            # return render_template('result.html', cources=cources)
            # jwt = user['idToken']
            # return {'token': jwt}, 200
        else:
            return render_template('login.html', errorLogging="PLease verify email")
            # return {'message': 'Email not verified'}, 400

    except:
        return render_template('login.html', errorLogging="Email or password is incorrect")
        # return {'message': 'There was an error logging in'}, 400


# # Api route to get a new token for a valid user
# @app.route('/google', methods=['POST'])
# def google():
#     # breakpoint()
#     # print(request.args.get('value'))
#     # print("token",token)
#     breakpoint()
#     return {'message': 'There was an error'}, 200


@app.route('/login')
def login():
    return render_template('login.html', title='Login')


@app.route('/register')
def register():
    return render_template('register.html', title='Register')


@app.route('/forgotPassword', methods=['GET', 'POST'])
def forgotPassword():
    email = request.form['email']
    if email is None:
        return {'message': 'Error missing email'}, 400
    auth.send_password_reset_email(email)
    return redirect(url_for('login'))


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('idToken', None)
    return redirect(url_for('mainPage'))


# @app.route('/google-login', methods =['POST','GET'])
# def googleLogin():
#     provider =

def fetchResultFromDb(topic):
    # -----------------------------------Udemy------------------------------------
    udemy_cources = []

    ref = firebase_app.database().child('topic')
    snapshot = ref.child(topic).child('udemy').get()
    details = snapshot.val()
    if (details != None):

        for source in details:
            udemy_cource = {}
            for key, value in source.items():
                # print(key, value)
                udemy_cource[key] = value
            udemy_cources.append(udemy_cource)

    # ----------------------------------------------Coursera-----------------------------------------
    coursera_cources = []

    ref = firebase_app.database().child('topic')
    snapshot = ref.child(topic).child('coursera').get()
    details = snapshot.val()

    if (details != None):
        for source in details:
            coursera_cource = {}
            for key, value in source.items():
                # print(key, value)
                coursera_cource[key] = value
            coursera_cources.append(coursera_cource)
    # print(coursera_cources)

    # --------------------------------------You tube---------------------------------------------
    youtube_cources = []

    ref = firebase_app.database().child('topic')
    snapshot = ref.child(topic).child('youtube').get()
    details = snapshot.val()

    if (details != None):
        for source in details:
            youtube_cource = {}
            for key, value in source.items():
                # print(key, value)
                if key == "course_title":
                    value = value[:75]
                youtube_cource[key] = value
            youtube_cources.append(youtube_cource)
    # print(youtube_cources)

    # ----------------------------------------------Blogs-----------------------------------------
    blogs = []

    ref = firebase_app.database().child('topic')
    snapshot = ref.child(topic).child('blogs').get()
    details = snapshot.val()

    if (details != None):
        for source in details:
            blog = {}
            for key, value in source.items():
                # print(key, value)
                blog[key] = value
            blogs.append(blog)
    # print(coursera_cources)

    # --------------------------------- Render Template ---------------------------------------
    return render_template('result.html', udemy_cources=udemy_cources, coursera_cources=coursera_cources,
                           youtube_cources=youtube_cources, blogs=blogs)

@app.route('/result', methods=['GET', 'POST'])
def result():
    print("found queery")
    if 'idToken' in session:
        idToken = session['idToken']
        try:
            topic = request.args.get('query')
            result = ""
            result = keywordExtractor.applyNlp(topic)
            if result != "":
                topic = result
            count=0
            topic.lower()
            print("query", topic)
            ref1 = firebase_app.database().child('topic')
            if (ref1.child(topic).get().val() is None):
                print("snap not exist", ref1.child(topic))
                scraper.callScapraping(topic,count)
                # threading.Thread(target=scraper.callScapraping,args=(topic,count)).start()
                # threading.Thread(target=scraper.callScapraping(topic)).start()
                # return render_template('loadingPage.html')
            else:
                count = firebase_app.database().child('topic').child(topic).child('count').get().val()
                firebase_app.database().child('topic').child(topic).child('count').set(count + 1)
                curr_date = datetime.now()
                days_diff =  datetime.fromtimestamp(int(datetime.timestamp(curr_date))).day - datetime.fromtimestamp(
                    firebase_app.database().child('topic').child(topic).child('timestamp').get().val()).day
                if days_diff >= 10:
                    threading.Thread(target=scraper.callScapraping, args=(topic,count)).start()
                    print("found",days_diff)
                else:
                    print("not found")

            print("snap exist", ref1.child(topic))
            if (firebase_app.database().child('topic').child(topic).get().val() is None):
                msg = "OOPS! your results could not be found, PLease try again :)"
                return render_template('notFound.html',msg=msg)
            return fetchResultFromDb(topic)

        except:
            print("error")
            msg = "OOPS! your results could not be found"
            return render_template('notFound.html',msg=msg)
    else:
        return redirect(url_for('login'))

port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
