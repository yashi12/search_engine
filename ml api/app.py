import os

from flask import Flask, request

import scraper1
# import jwt

# SECRET_KEY=os.environ.get('SECRET_KEY')

import keywordExtractor, PrerequtiesAndRelatedTopicsGraph

app = Flask(__name__)

@app.route('/query', methods=['GET', 'POST'])
def query():
    # print(jwt.__version__)
    print("found queery")
    query = request.args.get('query')
    topic = keywordExtractor.applyNlp(query)
    return {'topic': topic}, 200
    # try:
    #     token = request.headers.get('x-auth-token')
    #     if token:
    #         decoded = jwt.decode(token,SECRET_KEY, ["HS256"])
    #         iser_id = decoded['user']['id']
    #         query = request.args.get('query')
    #         topic = keywordExtractor.applyNlp(query)
    #         return {'topic': topic}, 200
    #     else:
    #         print("not auth")
    #         return {'msg':"not authenticated"},400
    # except Exception as e:
    #     print("error",e)
    #     return {'msg':"not authenticated"},400

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


def intersection(x, y, topic):
    l = []
    for i in x:
        if i in y and i not in topic and i not in l:
            l.append(i)

    for j in y:
        if j in x and j not in topic and i not in l:
            l.append(j)
    return l


@app.route('/next-route', methods=['GET', 'POST'])
def nextRoute():
    # topics = request.args.get('query')
    topics = ['javascript', 'html', 'css']
    for i in range(len(topics)):
        topics[i] = topics[i].lower()
    relList = []
    for topic in topics:
        relList.append(PrerequtiesAndRelatedTopicsGraph.loadReverseRelGraph(topic))

    output = []
    for i in range(0, len(topics)):
        for j in range(i + 1, len(topics)):
            output.extend(intersection(relList[i], relList[j], topics))

    output = set(output)

    return {'New Skills To Achive': list(output)}, 200


port = int(os.environ.get("PORT", 5000))

if __name__ == '__main__':
    app.run(host='localhost', port=port, debug=True)
