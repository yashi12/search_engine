#!/usr/bin/env python
# coding: utf-8

# In[17]:


import networkx as nx
import json
import matplotlib.pyplot as plt


# In[18]:


d = {}
with open("Similar Words.json","r+") as f:
    d = json.load(f)


# In[19]:


languages = []
with open("All_Languages.txt","r+") as f:
    languages = f.read().split("\n")


# In[20]:


graph = nx.Graph()


# In[21]:


for i in languages:
    graph.add_node(i)


# In[22]:


x = []
for key,value in d.items():
    for i in value:
        graph.add_edge(key.lower(),i.lower())
    for i in value:
        for j in value:
            if i!=j:
                graph.add_edge(i.lower(),j.lower())
        if i.lower() not in languages:
            x.append(i.lower())


# In[23]:


plt.figure(figsize=(20,15))
nx.draw(graph,with_labels=True)


# In[29]:


for i in graph.neighbors("react"):
    print(i+"-->")
    for j in graph.neighbors(i):
        print(j,end=" ")
    print()


# In[ ]:





# In[ ]:





# In[ ]:




