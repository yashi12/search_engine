#!/usr/bin/env python
# coding: utf-8

# In[25]:


import pandas as pd
import networkx as nx
import json
import matplotlib.pyplot as plt


# In[2]:


df = pd.read_csv("DESTO.csv")


# In[15]:


languages = []
with open("All_Languages.txt","r+") as f:
    languages = f.read().split("\n")


# In[22]:


def Keyword_EXTRACT(usefull_words):
    one_keyword_extract = []
    for i in range(len(usefull_words)):
        if usefull_words[i].lower() in languages:
            one_keyword_extract.append(usefull_words[i])
                
    
    two_extract_keyword = []
    
    for i in range(len(usefull_words)-1):
        if usefull_words[i]+" "+usefull_words[i+1] in languages:
            two_extract_keyword.append(usefull_words[i]+" "+usefull_words[i+1])
            if usefull_words[i] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i])
            if usefull_words[i+1] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i+1])

    three_extract_keyword = []

    for i in range(len(usefull_words)-2):
        if usefull_words[i]+" "+usefull_words[i+1]+" "+ usefull_words[i+2] in languages:
            three_extract_keyword.append(usefull_words[i]+" "+usefull_words[i+1]+" "+ usefull_words[i+2])
            if usefull_words[i] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i])
            if usefull_words[i+1] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i+1])
            if usefull_words[i+2] in one_keyword_extract:
                one_keyword_extract.remove(usefull_words[i+2])
    return one_keyword_extract,two_extract_keyword,three_extract_keyword


# In[23]:


d = {}

keys = df['Topic'].values
values = df['Prerequisite'].values

for i in range(0,len(keys)):
    if str(values[i])!="nan":
        d[keys[i]] = Keyword_EXTRACT(values[i].split(" "))


# In[46]:


graph = nx.Graph()


# In[47]:


x = []
for key,values in d.items():
    value1,value2,value3 = values
    key = str(key)
    for i in set(value1):
        
        if str(i)!="nan" and key.lower()!=i.lower():
            graph.add_edge(key.lower(),i.lower())
    
    for i in set(value2):
        if str(i)!="nan" and key.lower()!=i.lower():
            graph.add_edge(key.lower(),i.lower())
    
    for i in set(value3):
        if str(i)!="nan" and key.lower()!=i.lower():
            graph.add_edge(key.lower(),i.lower())


# In[48]:


plt.figure(figsize=(20,15))
nx.draw(graph,with_labels=True)


# In[52]:


for i in graph.neighbors("app development"):
    print(i+"-->")
print()


# In[56]:


wt = {}

keys = df['Topic'].values
out = df['Outcomes'].values
desc = df['Description'].values
opp = df['Opportunity'].values


values = []
for i in range(0,len(keys)):
    values.append(str(out[i]) +" "+str(desc[i])+" "+str(opp[i])+" ")

for i in range(0,len(keys)):
    if str(values[i])!="nan":
        wt[keys[i]] = Keyword_EXTRACT(values[i].split(" "))


# In[58]:


wtGraph = nx.Graph()


# In[59]:


def count(l,x):
    c = 0
    for i in l:
        if x==i:
            c+=1
    return c


# In[61]:


x = []
for key,values in wt.items():
    value1,value2,value3 = values
    key = str(key)
    for i in set(value1):
        
        if str(i)!="nan" and key.lower()!=i.lower():
            wtGraph.add_edge(key.lower(),i.lower(),weight=count(value1,i))
    
    for i in set(value2):
        if str(i)!="nan" and key.lower()!=i.lower():
            wtGraph.add_edge(key.lower(),i.lower(),weight=count(value2,i))
    
    for i in set(value3):
        if str(i)!="nan" and key.lower()!=i.lower():
            wtGraph.add_edge(key.lower(),i.lower(),weight=count(value3,i))


# In[62]:


plt.figure(figsize=(20,15))
nx.draw(wtGraph,with_labels=True)


# In[69]:


name = "angular"
for i in wtGraph.neighbors(name):
    print(i,wtGraph.edges[(name,i)]['weight'])
print()


# In[ ]:




