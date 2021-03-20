from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from time import *
import threading
from datetime import datetime
from app import *
import os
import concurrent.futures
# from webdriver_manager.chrome import ChromeDriverManager


import json

from firebase import Firebase
fbconfig={}
if os.path.exists("./fbconfig.json"): # local development
	fbconfig = json.load(open('./fbconfig.json'))
else:
    fbconfig = {
        "apiKey": os.environ.get('API_KEY'),
        "authDomain": os.environ.get('AUTH_DOMAIN'),
        "databaseURL": os.environ.get('DATABASE_URL'),
        "projectId": os.environ.get('PROJECT_ID'),
        "storageBucket": os.environ.get('STORAGE_BUCKET'),
        "messagingSenderId": os.environ.get('MESSAGING_SENDER_ID'),
        "appId": os.environ.get('APP_ID'),
        "measurementId": os.environ.get('MEASUREMENT_ID')
    }
# firebase = Firebase(json.load(open('./fbconfig.json')))
firebase = Firebase(config=fbconfig)

ref = firebase.database()

class LockingDb():
    def __init__(self, topic):
        self.lock = threading.Lock()

    def writeToDb(self, sourceName, lst, topic):
        # self.topic_ref = ref.child(topic)
        topic.lower()
        with self.lock:
            firebase.database().child('topic').child(topic).child(sourceName).set(lst)
            # topSkillRef = firebase.database().child('topSkill')
            # if (topSkillRef.get().val() is None):
            #     firebase.database().child('topSkill').child(topic).set(1)
            # else:
            #     print("true")


class scraper(object):

    def __init__(self):
        # if os.path.exists("./chromedriver.exe"):
        # self.chromedriver = "./chromedriver.exe"
        # else:
        # self.chromedriver =os.environ.get("CHROMEDRIVER_PATH")
        # print("path", self.chromedriver)
        # self.chromedriver = "./chromedriver.exe"
        self.options = Options()
        self.options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
        self.options.add_argument("--headless")
        # self.options.add_argument("--window-size=1920,1080")
        self.options.add_argument("--disable-gpu")
        self.options.add_argument("--disable-extensions")
        self.options.add_argument("--proxy-server='direct://'")
        self.options.add_argument("--proxy-bypass-list=*")
        self.options.add_argument("--start-maximized")

        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-dev-shm-usage")

        self.data = []
        # self.browser = webdriver.Chrome(executable_path=self.chromedriver, options=self.options)
        # self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
        self.lstUdemy = []
        self.lstCoursera = []
        self.lstYoutube = []

    def Udemy(self, topic, lockDb):

        print("udemy")
        try:
            self.options.add_argument("--window-size=1920,1080")
            self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
            # self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
            # self.browser.capabilities['version'] = "79.0"
            self.browser.get(f"https://www.udemy.com/courses/search/?lang=en&q=+{topic}+&sort=relevance&src=ukw")
            # self.browser.get("https://www.udemy.com/")
            # sleep(5)
            #
            # self.search_input = self.browser.find_element_by_xpath('//input[@placeholder="Search for anything"]')
            # self.search_input.send_keys(topic)
            #
            # self.search_btn = self.browser.find_element_by_xpath('//button[@type="submit"]')
            # self.search_btn.send_keys(Keys.ENTER)
            sleep(5)
            self.browser.save_screenshot("udemy.png")
            self.result = self.browser.find_elements_by_xpath('//h1[@class="udlite-heading-xl"]')

            if self.result != []:
                # print(self.result[0].text)
                self.browser.close()
                return

            self.course_title = self.browser.find_elements_by_xpath(
                '//div[@class="udlite-focus-visible-target udlite-heading-md course-card--course-title--2f7tE"]')
            self.course_instructor = self.browser.find_elements_by_xpath(
                '//div[@class="udlite-text-xs course-card--instructor-list--lIA4f"]')
            self.course_rating = self.browser.find_elements_by_xpath(
                '//span[@class="udlite-heading-sm star-rating--rating-number--3lVe8"]')
            self.course_image = self.browser.find_elements_by_xpath(
                '//img[@class="course-card--course-image--2sjYP browse-course-card--image--35hYN"]')
            self.course_link = self.browser.find_elements_by_xpath(
                '//a[@class="udlite-custom-focus-visible browse-course-card--link--3KIkQ"]')
            lst = []
            for i in range(min(3,len(self.course_title))):
                dictObject = {
                    "course_title": self.course_title[i].text,
                    "course_instructor": self.course_instructor[i].text,
                    "course_rating": self.course_rating[i].text,
                    "course_image": self.course_image[i].get_attribute('src'),
                    "course_link": self.course_link[i].get_attribute('href')
                }
                # print("dictobj", dictObject)
                lst.append(dictObject)
            print('udemy', lst,'length',len(self.course_title))
            self.browser.close()
            lockDb.writeToDb('udemy', lst, topic)
        except Exception as e:
            print("udemy error", e)
            print("title", len(self.course_title))
            print("instructor", len(self.course_instructor))
            print("rating", len(self.course_rating))
            print("img", len(self.course_image))
            print("link", len(self.course_link))
            print("========================================================")
            self.browser.close()

    def coursera(self, topic, lockDb):
        print("coursera")
        # self.browser.get("https://www.coursera.org/")	        # self.browser.get("https://www.coursera.org/")

        try:
            self.options.add_argument("--window-size=400,481")



            self.browser2 = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
            # self.browser2 = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
            # self.browser2.capabilities['version'] = "79.0"
            self.browser2.get(f"https://www.coursera.org/search?query=+{topic}+&index=prod_all_products_term_optimization&allLanguages=English")
            sleep(5)
            self.browser2.save_screenshot("coursera.png")

            ################################################################################################
            # self.result = self.browser.find_element_by_xpath(
            # '//h2[@class="rc-NumberOfResultsSection body-2-text"]//span').text
            #
            # if "No results" in self.result:
            #     print(self.result)
            # if "No results" in self.result:
            #     print(self.result)
            #     self.browser.close()
            #     return


            self.course_title = self.browser2.find_elements_by_xpath(
                '//h2[@class="color-primary-text card-title headline-1-text"]')
            self.course_instructor = self.browser2.find_elements_by_xpath('//span[@class="partner-name"]')
            self.course_rating = self.browser2.find_elements_by_xpath('//span[@class="ratings-text"]')
            self.course_level = self.browser2.find_elements_by_xpath('//div[@class="_jen3vs _1d8rgfy3"]')
            self.course_image = self.browser2.find_elements_by_xpath('//div[@class="image-wrapper vertical-box"]//img')
            self.course_link = self.browser2.find_elements_by_xpath('//a[@class="rc-MobileSearchCard"]')
            # print(len(self.course_title))
            # print(len(self.course_instructor))
            # print(len(self.course_rating))
            # print(len(self.course_level))
            # print(len(self.course_image))
            # print(len(self.course_link))
            # self.course_title_list = []
            # self.course_instructor_list = []
            # self.course_rating_list = []
            # self.course_level_list = []
            # self.course_image_list = []
            # self.course_link_list = []
            # d = {
            #     'coursera': []
            # }
            lst = []
            for i in range(3):
                dictObject = {
                    "course_title": self.course_title[i].text,
                    "course_instructor": self.course_instructor[i].text,
                    "course_rating": self.course_rating[i].text,
                    "course_image": self.course_image[i].get_attribute('src'),
                    "course_level":self.course_level[i].text,
                    "course_link": self.course_link[i].get_attribute('href'),
                    # "course_link": ""
                }

                # d['coursera'].append(dictObject)
                # self.lstCoursera.append(dictObject)
                lst.append(dictObject)

            print('coursera', lst,'length',len(self.course_title))
            self.browser2.close()
            # self.browser.close()
            lockDb.writeToDb('coursera', lst, topic)

        except Exception as e:
            print("coursera error",e)
            print("title",len(self.course_title))
            print("instructor",len(self.course_instructor))
            print("rating",len(self.course_rating))
            print("level",len(self.course_level))
            print("img",len(self.course_image))
            print("link",len(self.course_link))
            print("========================================================")
            self.browser2.close()
            # self.browser.close()

    def youtube(self, topic, lockDb):
        self.options.add_argument("--window-size=1920,1080")
        self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
        # self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
        # self.browser.capabilities['version'] = "79.0"
        print("youtube")
        try:
            self.browser.get(f"https://www.youtube.com/results?search_query=playlist+{topic}")
            sleep(10)
            self.browser.save_screenshot("youtube.png")
            # breakpoint()
            self.course_title = self.browser.find_elements_by_xpath('//span[@class="style-scope ytd-playlist-renderer"]')
            self.course_instructor = self.browser.find_elements_by_xpath(
                '//div[@class="style-scope ytd-playlist-renderer"]/a[@class="yt-simple-endpoint style-scope ytd-playlist-renderer"]/ytd-video-meta-block[@class="style-scope ytd-playlist-renderer"]/div[@class="style-scope ytd-video-meta-block"]/div[@class="style-scope ytd-video-meta-block"]/ytd-channel-name[@class="style-scope ytd-video-meta-block"]/div[@class="style-scope ytd-channel-name"]/div[@class="style-scope ytd-channel-name"]/yt-formatted-string[@class="style-scope ytd-channel-name complex-string"]/a[@class="yt-simple-endpoint style-scope yt-formatted-string"]')
            self.course_image = self.browser.find_elements_by_xpath('//a[@class="yt-simple-endpoint style-scope ytd-playlist-thumbnail"]/div[@class="style-scope ytd-playlist-thumbnail"]/ytd-playlist-video-thumbnail-renderer[@class="style-scope ytd-playlist-thumbnail"]/yt-img-shadow[@class="style-scope ytd-playlist-video-thumbnail-renderer no-transition"]/img[@class="style-scope yt-img-shadow"]')
            # for i in range(len(self.course_image)):
            #     print(self.course_image[i].get_attribute('src'))
            self.course_link = self.browser.find_elements_by_xpath(
                '//a[@class="yt-simple-endpoint style-scope ytd-playlist-renderer"]')

            lst = []
            for i in range(min(3,len(self.course_title))):
                dictObject = {
                    "course_title": self.course_title[i].text.encode('unicode-escape').decode('utf-8'),
                    "course_instructor": self.course_instructor[i].text,
                    "course_image": self.course_image[i].get_attribute('src'),
                    "course_link": self.course_link[i].get_attribute('href')
                }
                lst.append(dictObject)
            print('youtube', lst,'length',len(self.course_title))
            self.browser.close()
            lockDb.writeToDb('youtube', lst, topic)
        except Exception as e:
            print("you tube error", e)
            print("title", len(self.course_title))
            print("instructor", len(self.course_instructor))
            print("img", len(self.course_image))
            print("link", len(self.course_link))
            print("========================================================")
            self.browser.close()

    def blogs(self, topic, lockDb):
        self.options.add_argument("--window-size=1920,1080")
        # self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
        self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
        # self.browser.capabilities['version'] = "79.0"
        print("blog section")
        try:
            self.browser.get("https://www.google.com")
            sleep(5)
            self.search_input3 = self.browser.find_element_by_xpath('//input[@class="gLFyf gsfi"]')
            self.search_input3.send_keys('blogurl:' + f'{topic}')

            self.search_input3.send_keys(Keys.ENTER)
            sleep(5)

            self.blog_title = self.browser.find_elements_by_xpath('//h3[@class="LC20lb DKV0Md"]//span')
            self.blog_link = self.browser.find_elements_by_xpath('//div[@class="rc"]/div[@class="yuRUbf"]/a')
            # self.blog_title_list = []
            # self.blog_link_list = []
            # x=0
            lst = []
            for i in range(min(5,len(self.blog_title))):
                dictObject = {
                    "blog_title": self.blog_title[i].text.encode('unicode-escape').decode('utf-8'),
                    "blog_link": self.blog_link[i].get_attribute('href')
                }
                # x = x+3
                if dictObject['blog_title'] is "":
                    dictObject['blog_title'] = topic
                lst.append(dictObject)
            print('blogs', lst,'length',len(self.blog_title))
            self.browser.close()
            lockDb.writeToDb('blogs', lst, topic)
        except Exception as e:
            print("blogs error", e)
            print("title", len(self.blog_title))
            print("link", len(self.blog_link))
            print("========================================================")
            self.browser.close()


def taskUdemy(topic, lockDb, objUdemy):
    print("call udemy")
    objUdemy.Udemy(topic, lockDb)


def taskCoursera(topic, lockDb, objCoursera):
    print("call coursera")
    objCoursera.coursera(topic, lockDb)


def taskYoutube(topic, lockDb, objYoutube):
    print("call you tube")
    objYoutube.youtube(topic, lockDb)


def taskBlogs(topic, lockDb, objBlogs):
    print("call blog")
    objBlogs.blogs(topic, lockDb)


def callScapraping(topic,count):
    objUdemy = scraper()
    objCoursera = scraper()
    objYoutube = scraper()
    objBlogs = scraper()
    lockDb = LockingDb(topic)
    threads = []
    print("start scraping")
    # thread3 = threading.Thread(target=taskUdemy, args=(topic, lockDb, objUdemy))
    # threads.append(thread3)
    # thread3.start()
    # thread1 = threading.Thread(target=taskCoursera, args=(topic, lockDb, objCoursera))
    # threads.append(thread1)
    # thread1.start()
    # thread2 = threading.Thread(target=taskYoutube, args=(topic, lockDb, objYoutube))
    # threads.append(thread2)
    # thread2.start()
    # thread3 = threading.Thread(target=taskBlogs, args=(topic, lockDb, objBlogs))
    # threads.append(thread3)
    # thread3.start()

    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.submit(taskUdemy, topic, lockDb, objUdemy)
        executor.submit(taskCoursera,topic, lockDb, objCoursera)
        executor.submit(taskYoutube, topic, lockDb, objYoutube)
        executor.submit(taskBlogs,topic, lockDb, objBlogs)
        print("done")


    firebase.database().child('topic').child(topic).child('count').set(count+1)
    firebase.database().child('topic').child(topic).child('timestamp').set(int(datetime.timestamp(datetime.now())))
    # for thread in threads:
    #     thread.join()
    if firebase.database().child('topic').child(topic).child('udemy').get().val() is None :
        if firebase.database().child('topic').child(topic).child('coursera').get().val() is None:
            firebase.database().child('topic').child(topic).remove()




