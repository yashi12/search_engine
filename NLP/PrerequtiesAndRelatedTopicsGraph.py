import pickle

import matplotlib.pyplot as plt
import networkx as nx
import pandas as pd
from NLP import keywordExtractor

languages = []

with open("All_Languages.txt", "r+") as f:
    languages = f.read().split("\n")


def createBothGraphAndSave():
    df = pd.read_csv("DESTO.csv")

    d = {}

    keys = df['Topic'].values
    values = df['Prerequisite'].values

    for i in range(0, len(keys)):
        if str(values[i]) != "nan":
            d[keys[i]] = Keyword_EXTRACT(values[i].split(" "))

    graph = nx.DiGraph()

    for key, values in d.items():
        key = str(key)
        for i in set(values):
            if str(i) != "nan" and key.lower() != i.lower():
                graph.add_edge(key.lower(), i.lower())

    plt.figure(figsize=(20, 15))
    nx.draw(graph, with_labels=True)
    with open("../NLP/Prerequties Graph.pkl", "wb+") as f:
        pickle.dump(graph, f)

    wt = {}

    keys = df['Topic'].values
    out = df['Outcomes'].values
    desc = df['Description'].values
    opp = df['Opportunity'].values

    values = []
    for i in range(0, len(keys)):
        values.append(str(out[i]) + " " + str(desc[i]) + " " + str(opp[i]) + " ")

    for i in range(0, len(keys)):
        if str(values[i]) != "nan":
            wt[keys[i]] = Keyword_EXTRACT(values[i].split(" "))

    wtGraph = nx.Graph()

    def count(l, x):
        c = 0
        for i in l:
            if x == i:
                c += 1
        return c

    for key, values in wt.items():
        key = str(key)
        for i in set(values):
            if str(i) != "nan" and key.lower() != i.lower():
                wtGraph.add_edge(key.lower(), i.lower(), weight=count(values, i))

    plt.figure(figsize=(20, 15))
    nx.draw(wtGraph, with_labels=True)

    with open("../NLP/Related Topic Graph.pkl", "wb+") as f:
        pickle.dump(wtGraph, f)

    name = "angular"
    for i in wtGraph.neighbors(name):
        print(i, wtGraph.edges[(name, i)]['weight'])
    print()


def Keyword_EXTRACT(usefull_words):
    one_keyword_extract = []
    for i in range(len(usefull_words)):
        if usefull_words[i].lower() in languages:
            one_keyword_extract.append(usefull_words[i])

    two_extract_keyword = []

    for i in range(len(usefull_words) - 1):
        if usefull_words[i] + " " + usefull_words[i + 1] in languages:
            two_extract_keyword.append(usefull_words[i] + " " + usefull_words[i + 1])
            if usefull_words[i] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i])
            if usefull_words[i + 1] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i + 1])

    three_extract_keyword = []

    for i in range(len(usefull_words) - 2):
        if usefull_words[i] + " " + usefull_words[i + 1] + " " + usefull_words[i + 2] in languages:
            three_extract_keyword.append(usefull_words[i] + " " + usefull_words[i + 1] + " " + usefull_words[i + 2])
            if usefull_words[i] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i])
            if usefull_words[i + 1] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i + 1])
            if usefull_words[i + 2] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i + 2])

    return keywordExtractor.getCloseMatches(one_keyword_extract, two_extract_keyword, three_extract_keyword)


def loadPrereqGraph(topic):
    with open("../NLP/Prerequties Graph.pkl", "rb+") as f:
        graph = pickle.load(f)

    l = []
    if graph.neighbors[topic] is not None:
        for i in graph.neighbors(topic):
            l.append(i)
    return l


def loadRelGraph(topic):
    with open("../NLP/Related Topic Graph.pkl", "rb+") as f:
        graph = pickle.load(f)

    l = {}
    if graph.neighbors(topic) is not None:
        for i in graph.neighbors(topic):
            l[i] = graph.edges[(topic, i)]['weight']

    l = sorted(l.items(), key=lambda x: x[1])

    l.reverse()
    l = {k: v for k, v in l}

    return l.keys()


if __name__ == '__main__':
    print(loadRelGraph("angular"))
