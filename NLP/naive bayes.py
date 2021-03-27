#!/usr/bin/env python
# coding: utf-8

# In[41]:


import re
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import RegexpTokenizer
import pandas as pd
import numpy as np
from sklearn.naive_bayes import *
from sklearn.feature_extraction.text import CountVectorizer,TfidfTransformer


# In[42]:


tokenizer = RegexpTokenizer('\w+')
ps = PorterStemmer()
stopwords = []

with open('All_Languages.txt', 'r+', encoding='utf-8') as f:
    l = f.readlines()
new_l  =[]
for i in l:
    new_l.append(i[:-1])
l = new_l
l[-1] = "μλ"
with open("stopwords.txt", 'r') as f:
    stopwords = f.read()
stopwords = stopwords.split("\n")

sw = set(stopwords)

def getStemReview(reviews):
    review = reviews.lower()
    
    tokens = tokenizer.tokenize(review)
    new_tokens = [w for w in tokens if w not in sw]
    stemmed_token = [ps.stem(token) for token in new_tokens if token not in l]
    
    cleaned_review = ' '.join(stemmed_token)
    return cleaned_review


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

# Stemming And Lemmatizing
def StemmingAndLemmatizing(usefull_words):
    ps = PorterStemmer()
    
    with open("All_Languages.txt", "r+", encoding='utf-8') as f:
        languages = f.read()
        
    keyword_extract = []
    for i in range(len(usefull_words)):
        for j in range(len(usefull_words[i])):
            if usefull_words[i][j].lower() not in languages:
                x = ps.stem(usefull_words[i][j])
                usefull_words[i][j] = x
            else:
                keyword_extract.append(usefull_words[i][j])
    return usefull_words,keyword_extract

def nlp(text):
    sentences = SentenceTokenization(text)

    words = [] 
    for sentence in sentences:
        words_in_a_sent = WordTokenization(sentence)
        words.append(words_in_a_sent)

    usefull_words = []
    for words_in_a_sentence in words:
        usefull_words_in_sent = StopWordRemoval(words_in_a_sentence)
        usefull_words.append(usefull_words_in_sent)

    usefull_words,keywords = StemmingAndLemmatizing(usefull_words)
    return usefull_words,keywords


# In[43]:


training_data = pd.read_csv("DataSet3.csv")


# In[44]:


training_data


# In[45]:


training_data = training_data.dropna()


# In[46]:


X_train,y_train  = training_data.iloc[:,0].values,training_data.iloc[:,1].values
# X_train = ["Introduction to Android","Introduction to angularjs","Basics of Python"]
# y_train = ["android","angularjs","python"]


# In[47]:


for i in range(len(X_train)):
    X_train[i],keyword = nlp(X_train[i].lower())
    X_train[i] = " ".join(X_train[i][0])


# In[81]:


cv = CountVectorizer(ngram_range=(1,1))
x_vec = cv.fit_transform(X_train).toarray()
x_vec


# In[82]:


d = dict()
rd= dict()
for i in range(len(l)):
    d[l[i]]=i
    rd[i]= l[i]
    
y_train_num = []
for i in range(len(y_train)):
    y_train_num.append(d[y_train[i]])


# In[83]:


model = MultinomialNB()
model.fit(x_vec,y_train_num)


# In[108]:


x_test = ["roadmap to js ","i like c not dc","Basic of mean","roadmap to mean stack","Getting Started with python","I like android but hate cpp "]
for i in range(len(x_test)):
    x_test[i],keword = nlp(x_test[i].lower())
    x_test[i] = " ".join(x_test[i][0])
x_text_vec = cv.transform(x_test).toarray()


# In[109]:


y_pred=model.predict(x_text_vec)
print(y_pred)


# In[110]:


for i in y_pred:
    print(rd[i])


# In[ ]:





# In[ ]:




