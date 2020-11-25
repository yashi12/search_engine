from flask import Flask, render_template, url_for, request, session,redirect
import firebase_admin
import pyrebase
import json
from firebase_admin import credentials, auth,db
from firebase import Firebase
import os
import threading

import scraper

firebase_app = Firebase(json.load(open('./fbconfig.json')))

app = Flask(__name__)
app.secret_key = os.urandom(24)
# Connect to firebase
cred = credentials.Certificate('./fbAdminConfig.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('./fbconfig.json')))

auth = pb.auth()

cources = [
    {
        'name': 'Node Js',
        'author': 'Jmaes Bond',
        'reviews': '78',
        'date': '12/01/2000',
        'img':'https://i.ytimg.com/vi/TlB_eWDSMt4/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDknTftRw_zmEvsI8lqYBxE0vlKnQ" class="card-img" alt="Best Ever Content!'
    },
    {
        'name': 'Begineer Node Js',
        'author': 'haerry Bond',
        'reviews': '78',
        'date': '12/01/2000',
        'img':'https://i.ytimg.com/vi/TlB_eWDSMt4/hq720.jpg?sqp=-oaymwEZCNAFEJQDSFXyq4qpAwsIARUAAIhCGAFwAQ==&rs=AOn4CLDknTftRw_zmEvsI8lqYBxE0vlKnQ" class="card-img" alt="Best Ever Content!'
    }
]
users = [{'uid': 1, 'name': 'Noah Schairer'}]


# Api route to get users
@app.route('/api/userinfo')
def userinfo():
    return {'data': users}, 200


# Main page
@app.route('/',methods=['GET','POST'])
def mainPage():
    # top3 = pb.database().child('topic').order_by_child('count').limit_to_first(3).get()
    # print("top3",top3.val())
    if 'idToken' in session:
        idToken = session['idToken']
        print(idToken)
        # user = pb.auth().
        # before the 1 hour expiry:
        # user = auth.refresh(user['refreshToken'])
    return render_template('searchBar.html')
    # return render_template('skillOfWeek.html')


@app.route('/home', methods=['POST', 'GET'])
def home():
    return render_template('home.html')


# Api route to sign up a new user
@app.route('/api/signup', methods=['POST'])
def signup():
    email = request.form['email']
    password = request.form['password']
    confirmPassword = request.form['confirmPassword']

    # link = auth.generate_email_verification_link(email)
    # send_custom_email(email, link)
    # try:
    #     if email is None or password is None:
    #         return {'message': 'Error missing email or password'}, 400
    #     try:
    #         user = auth.create_user(
    #             email=email,
    #             password=password
    #         )
    #         return {'message': f'Successfully created user {user.uid}'}, 200
    #     except:
    #         return {'message': 'Error creating user'}, 400
    # except:
    #      print("error")
    if email is None or password is None:
        return {'message': 'Error missing email or password'}, 400
    if password != confirmPassword:
        return {'message': 'Password do not match'}, 400
    try:
        auth.create_user_with_email_and_password(email,password)
        return render_template('login.html')
    except:
        return {'message': 'Error creating user'}, 400


# Api route to get a new token for a valid user
@app.route('/api/token', methods=['POST'])
def token():
    email = request.form['email']
    password = request.form['password']
    try:
        user = pb.auth().sign_in_with_email_and_password(email, password)
        # before the 1 hour expiry:
        user = auth.refresh(user['refreshToken'])
        print("user",user)
        print("acc info",auth.get_account_info(user['idToken']))
        session['idToken'] = user['idToken']
        print("session",session['idToken'])
        return redirect(url_for('mainPage'))
        # return render_template('result.html', cources=cources)
        # jwt = user['idToken']
        # return {'token': jwt}, 200
    except:
        return {'message': 'There was an error logging in'}, 400


# Api route to get a new token for a valid user
@app.route('/google', methods=['POST', 'GET'])
def token2():
    # ref=firebase_app.database().order_by_child('count')
    # snapshot = ref.get()
    # print("snapshot",ref.get())
    # print(snapshot.val())
    # for key in snapshot.each():
    #     print('{0} was {1} meters tall',key)
    # ref = db.reference('topic')
    # rootRef = ref.order_by_child('count')
    # print("data",ref)
    try:
        # -----------------------------------------------------
        topic='node js'

        # -----------------------------------Udemy------------------------------------
        udemy_cources = []

        ref = firebase_app.database().child('topic')
        snapshot = ref.child(topic).child('udemy').get()
        details = snapshot.val()

        for source in details:
            udemy_cource = {}
            for key, value in source.items():
                print(key, value)
                udemy_cource[key] = value
            udemy_cources.append(udemy_cource)

# ----------------------------------------------Coursera-----------------------------------------
        coursera_cources = []

        ref = firebase_app.database().child('topic')
        snapshot = ref.child(topic).child('coursera').get()
        details = snapshot.val()

        for source in details:
            coursera_cource = {}
            for key, value in source.items():
                print(key, value)
                coursera_cource[key] = value
            coursera_cources.append(coursera_cource)
        print(coursera_cources)

        # --------------------------------------You tube---------------------------------------------
        youtube_cources = []

        ref = firebase_app.database().child('topic')
        snapshot = ref.child(topic).child('youtube').get()
        details = snapshot.val()

        for source in details:
            youtube_cource = {}
            for key, value in source.items():
                print(key, value)
                youtube_cource[key] = value
            youtube_cources.append(youtube_cource)
        print(youtube_cources)

        # --------------------------------- Render Template ---------------------------------------
        return render_template('result.html', udemy_cources=udemy_cources, coursera_cources=coursera_cources,youtube_cources=youtube_cources)
    except:
        print("error")
        return {'message': 'There was an error logging in'}, 400


@app.route('/about')
def about():
    # return '<h1>Amount Page</h1>'
    return render_template('about.html', title='Home')


@app.route('/login')
def login():
    return render_template('login.html', title='Login')


@app.route('/register')
def register():
    return render_template('register.html', title='Register')

@app.route('/forgotPassword',methods=['GET','POST'])
def forgotPassword():
    email = request.form['email']
    if email is None :
        return {'message': 'Error missing email'}, 400
    auth.send_password_reset_email(email)
    return redirect(url_for('login'))

@app.route('/logout',methods=['POST'])
def logout():
    session.pop('idToken',None)
    return redirect(url_for('mainPage'))

# @app.route('/google-login', methods =['POST','GET'])
# def googleLogin():
#     provider =

@app.route('/result', methods=['GET','POST'])
def result():
    print("found queery")
    if 'idToken' in session:
        idToken = session['idToken']
        try:
            topic = request.args.get('query')
            print("query",topic)
            ref1 = firebase_app.database().child('topic')
            if(ref1.child(topic).get().val() is None):
                print("snap not exist",ref1.child(topic))
                scraper.callScapraping(topic)
                # threading.Thread(target=scraper.callScapraping(topic)).start()
            #     return {'message': 'Topic not found'}, 400
            else:
                count = firebase_app.database().child('topic').child(topic).child('count').get().val()
                firebase_app.database().child('topic').child(topic).child('count').set(count+1)
            print("snap exist",ref1.child(topic))
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
                        youtube_cource[key] = value
                    youtube_cources.append(youtube_cource)
            # print(youtube_cources)

            # --------------------------------- Render Template ---------------------------------------
            return render_template('result.html', udemy_cources=udemy_cources, coursera_cources=coursera_cources,
                                   youtube_cources=youtube_cources)
        except:
            print("error")
            return {'message': 'There was an error logging in'}, 400
    else:
        return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
