
from flask import Flask, render_template, url_for, request, session, redirect
import json
import os
import scraper1
app = Flask(__name__)
users = [
    {
        "name":"yashi",
        "roll":12
    },
    {
        "name":"ag",
        "roll":13
    }
]
# Api route to get users
@app.route('/api/userinfo')
def userinfo():
    return {'data': users}, 200



@app.route('/result', methods=['GET', 'POST'])
def result():
    print("found queery")
    topic = request.args.get('query');
    print("query",topic);
    lst = scraper1.callScapraping(topic);
    return {'data': lst}, 200



port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)





