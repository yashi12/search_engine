
import re
import pandas as pd
import numpy as np
import difflib


# Word And Sentence Tokenmization & Stop Removal 
def SentenceTokenization(text):
    sentences = re.compile('[.!?] ').split(text)
    return sentences

def WordTokenization(sentence):
    tokens = re.findall("[\w']+", sentence)
    return tokens

def StopWordRemoval(allwords):
    stopwords = []
    with open("stopwords.txt", 'r') as f:
        stopwords = f.read()
    stopwords = stopwords.split("\n")
    
    usefull_words = [word for word in allwords if word not in stopwords]
    return usefull_words

# Extracting One Words and Two Words
def KeywordExtract(usefull_words):
    l=[]
    with open('All_Languages.txt' ,'r+',encoding='utf-8') as f:
        l = f.readlines()

    new_l  =[]
    for i in l:
        new_l.append(i[:-1])
    languages = new_l

    one_keyword_extract = []
    for i in range(len(usefull_words)):
        for j in range(len(usefull_words[i])):
            if usefull_words[i][j].lower() in languages:
                one_keyword_extract.append(usefull_words[i][j])
                
    
    two_extract_keyword = []
    
    for i in range(len(usefull_words[0])-1):
        if usefull_words[0][i]+" "+usefull_words[0][i+1] in languages:
            two_extract_keyword.append(usefull_words[0][i]+" "+usefull_words[0][i+1])

    three_extract_keyword = []

    for i in range(len(usefull_words[0])-2):
        if usefull_words[0][i]+" "+usefull_words[0][i+1]+" "+ usefull_words[0][i+2] in languages:
            three_extract_keyword.append(usefull_words[0][i]+" "+usefull_words[0][i+1]+" "+ usefull_words[0][i+2])
        
    return one_keyword_extract,two_extract_keyword,three_extract_keyword

def nlp(text):
    sentences = SentenceTokenization(text.lower())

    words = [] 
    for sentence in sentences:
        words_in_a_sent = WordTokenization(sentence)
        words.append(words_in_a_sent)

    usefull_words = []
    for words_in_a_sentence in words:
        usefull_words_in_sent = StopWordRemoval(words_in_a_sentence)
        usefull_words.append(usefull_words_in_sent)

    one_word_keyword,two_word_keyword,three_word_keyword = KeywordExtract(usefull_words)
    return one_word_keyword,two_word_keyword,three_word_keyword


def applyNlp(query):
    result =""
    sent = query
    keywords = nlp(sent)
    print(keywords)
    twoWords = keywords[1]
    oneWord = keywords[0]
    if twoWords!= []:
        for x in twoWords:
            result += x
            result += " "
    else:
        for x in oneWord:
            result += x
            result += " "
    result = result[:-1]
    print("result nlp",result)
    return result

def getCloseMatches(one,two,three,x):
    
    with open('Close Matches.txt' ,'r+',encoding='utf-8') as f:
        l = f.readlines()

    new_l  =[]
    for i in l:
        new_l.append(i[:-1])
    languages = new_l
    
    words = []
    for i in one:
        words.append(i)
        for j in difflib.get_close_matches(i,languages,1,x):
            words.append(j)
        
    for i in two:
        words.append(i)
        for j in difflib.get_close_matches(i,languages,1,x):
            words.append(j)
    
    for i in three:
        words.append(i)
        for j in difflib.get_close_matches(i,languages,1,x):
            words.append(j)
        
    return words

x,y,z = nlp("I want to learn json")

getCloseMatches(x,y,z,0.4)
