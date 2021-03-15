import os

from flask import Flask, request

import scraper1


import keywordExtractor, PrerequtiesAndRelatedTopicsGraph

app = Flask(__name__)
users = [
    {
        "name": "yashi",
        "roll": 12
    },
    {
        "name": "ag",
        "roll": 13
    }
]


# Api route to get users
@app.route('/api/userinfo')
def userinfo():
    return {'data': users}, 200


@app.route('/query', methods=['GET', 'POST'])
def query():
    print("found queery")
    query = request.args.get('query')
    topic = keywordExtractor.applyNlp(query)
    return {'topic': topic}, 200

@app.route('/result', methods=['GET', 'POST'])
def result():
    print("found queery")
    topic = request.args.get('query')
    lst = scraper1.callScapraping(topic)

    return {'data': lst}, 200


@app.route('/prerel', methods=['GET', 'POST'])
def prerel():
    print("found Topic")
    topic = request.args.get('query')
    prereqList = PrerequtiesAndRelatedTopicsGraph.loadPrereqGraph(topic)
    relList = PrerequtiesAndRelatedTopicsGraph.loadRelGraph(topic)

    return {'prerequties': prereqList, 'related': relList}, 200


port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(host='localhost', port=port, debug=True)
