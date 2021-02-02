#!/usr/bin/env python
# coding: utf-8

# In[50]:


import re
from nltk.stem import LancasterStemmer,WordNetLemmatizer
import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.layers import *
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping,ModelCheckpoint
from gensim.models import *


# In[51]:


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
    ls = LancasterStemmer()
    wl = WordNetLemmatizer()
    l=[]
    with open('All_Languages.txt' ,'r+',encoding='utf-8') as f:
        l = f.readlines()

    new_l  =[]
    for i in l:
        new_l.append(i[:-1])
    languages = new_l

    keyword_extract = []
    for i in range(len(usefull_words)):
        for j in range(len(usefull_words[i])):
            if usefull_words[i][j].lower() not in languages:
                x = ls.stem(usefull_words[i][j])
#                 x = wl.lemmatize(x)
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


# In[52]:


training_data = pd.read_csv("DataSet3.csv")


# In[53]:


training_data


# In[54]:


training_data = training_data.dropna()


# In[55]:


X_train,y_train  = training_data.iloc[:,0].values,training_data.iloc[:,1].values


# In[56]:


sent = "Courses on node js not react"
nlp(sent)[1]


# In[57]:


for i in range(len(X_train)):
    X_train[i],keyword = nlp(X_train[i])
    X_train[i] = " ".join(X_train[i][0])
#     print(i+2,keyword)


# In[58]:


X_train


# In[59]:


embeddings_index={}
with open("glove.6B.50d.txt",encoding='utf-8') as f:
    for line in f:
        value = line.split(" ")
        word = value[0]
        coef = np.asarray(value[1:],dtype = 'float32')
        embeddings_index[word] = list(coef)


# In[60]:


maxLen = 0
for i in X_train:
    maxLen = max(len(i),maxLen)
print(maxLen)


# In[61]:


def embedding_output(X):
    emb_dim = 50
    embedding_out = np.zeros((X.shape[0],maxLen,emb_dim))
    
    for ix in range(X.shape[0]):
        X[ix] = X[ix].split()
        for ij in range(len(X[ix])):
            try:
                embedding_out[ix][ij] = embeddings_index[X[ix][ij].lower()]
            except:
                embedding_out[ix][ij] = np.zeros((emb_dim,))
    return embedding_out

embedding_matrix_train = embedding_output(X_train)


# In[62]:


embedding_matrix_train.shape


# In[63]:


with open('All_Languages.txt' ,'r+',encoding='utf-8') as f:
    l = f.readlines()
new_l  =[]
for i in l:
    new_l.append(i[:-1])
l = new_l
l[-1] = "μλ"
d = dict()
rd= dict()
for i in range(len(l)):
    d[l[i]]=i
    rd[i]= l[i]
    


# In[64]:


y_train_num = []
for i in range(len(y_train)):
    y_train_num.append(d[y_train[i]])


# In[65]:


y_train_num = to_categorical(np.asarray(y_train_num))


# In[66]:


y_train_num.shape


# In[67]:


model = Sequential()
model.add(LSTM(units = 50,input_shape = (maxLen,50),return_sequences = True))
model.add(Dropout(0.5))
model.add(LSTM(units=50))
model.add(Dropout(0.5))
model.add(Dense(685))
model.add(Activation('softmax'))
model.compile(loss = 'categorical_crossentropy',optimizer = 'adam',metrics = ["accuracy"])
model.summary()


# In[68]:


checkpoint = ModelCheckpoint("best_model.h5",monitor = 'val_loss',verbose=False,save_best_only= True)
earlyStop = EarlyStopping(monitor='val_loss')
history = model.fit(embedding_matrix_train,y_train_num,epochs=100,batch_size=64,shuffle=True,validation_split=0.2,callbacks=[checkpoint,earlyStop])


# In[ ]:


model.load_weights("best_model.h5")


# In[ ]:





# In[ ]:


y_test = model.predict(embedding_matrix_train)


# In[ ]:


for i in range(140):
    print(X_train[i])
    print(rd[np.argmax(y_test[i])])


# In[ ]:




