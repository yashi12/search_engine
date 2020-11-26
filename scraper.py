from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from time import *
import threading
import datetime
# from flaskthreads import AppContextThread

import json

from firebase import Firebase

firebase = Firebase(json.load(open('./fbconfig.json')))

ref = firebase.database()
# Get a database reference to our blog.

# users_ref = ref.child('child')
# print(users_ref)
# ref.child('users').child('parent').set({
#     'alanisawesome': {
#         'date_of_birth': 'June 23, 1912',
#         'full_name': 'Alan Turing'
#     },
#     'gracehop': {
#         'date_of_birth': 'December 9, 1906',
#         'full_name': 'Grace Hopper'
#     }
# })
# # print(users_ref)
# # users_ref = ref.child('users')
# ref.child('users').child('op').set({
#     'new': {
#         'date_of_birth': 'June 23, 1912',
#         'full_name': 'Alan Turing'
#     },
#     'gracehop': {
#         'date_of_birth': 'December 9, 1906',
#         'full_name': 'Grace Hopper'
#     }
# })

from selenium.webdriver.remote.webelement import WebElement


class LockingDb():
    def __init__(self, topic):
        self.lock = threading.Lock()
        # self.topic_ref = ref.child(topic)

    def writeToDb(self, sourceName, lst, topic):
        # self.topic_ref = ref.child(topic)
        with self.lock:
            firebase.database().child('topic').child(topic).child(sourceName).set(lst)
            topSkillRef = firebase.database().child('topSkill')
            if (topSkillRef.get().val() is None):
                firebase.database().child('topSkill').child(topic).set(1)
            else:
                print("true")


class scraper(object):

    def __init__(self):
        self.chromedriver = "./chromedriver"
        self.options = Options()
        # self.options.add_argument("--headless")
        self.options.add_argument("--window-size=1920,1080")
        self.options.add_argument("--disable-gpu")
        self.options.add_argument("--disable-extensions")
        self.options.add_argument("--proxy-server='direct://'")
        self.options.add_argument("--proxy-bypass-list=*")
        self.options.add_argument("--start-maximized")
        self.data = []
        self.browser = webdriver.Chrome(executable_path=self.chromedriver, options=self.options)

        self.lstUdemy = []
        self.lstCoursera = []
        self.lstYoutube = []
        # self.topic = input("Enter topic : ")

    def Udemy(self, topic, lockDb):
        print("udemy")
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
        # d = {
        #     'udemy': []
        # }
        lst = []
        for i in range(3):
            # self.course_title_list.append(self.course_title[i].text)
            # print(self.course_title_list[i])
            # self.course_instructor_list.append(self.course_instructor[i].text)
            # print(self.course_instructor_list[i])
            # self.course_rating_list.append(self.course_rating[i].text)
            # print(self.course_rating_list[i])
            # self.course_image_list.append(self.course_image[i].get_attribute('src'))
            # print(self.course_image_list[i])
            # self.course_link_list.append(self.course_link[i].get_attribute('href'))
            # print(self.course_link_list[i])
            dictObject = {
                "course_title": self.course_title[i].text,
                "course_instructor": self.course_instructor[i].text,
                "course_rating": self.course_rating[i].text,
                "course_image": self.course_image[i].get_attribute('src'),
                "course_link": self.course_link[i].get_attribute('href')
            }
            print("dictobj", dictObject)
            # d['udemy'].append(dictObject)
            # self.lstUdemy.append(dictObject)
            lst.append(dictObject)
            # udemy_ref.push().set({i:dictObject})

            # udemy_ref.path({
            #         i : dictObject
            # })
        # self.df = pd.DataFrame({'Course Title':self.course_title_list, 'Image Src':self.course_image_list,'Instructor':self.course_instructor_list,'Rating':self.course_rating_list,'Link':self.course_link_list})
        # self.df.to_excel('./udemy_course_info.xlsx')
        # topic_ref = ref.child(topic)
        # topic_ref.child('udemy').set(lst)
        print('udemy', lst)
        self.browser.close()
        lockDb.writeToDb('udemy', lst, topic)
        # print(lst)
        # self.data.append(d)
        # obj.saving(topic,d);
        # self.browser.close()

    def coursera(self, topic, lockDb):
        print("coursera")
        # self.browser.get("https://www.coursera.org/")
        self.browser.get(
            f"https://www.coursera.org/search?query=+{topic}+&index=prod_all_products_term_optimization&allLanguages=English")
        sleep(5)

        # self.search_input1 = self.browser.find_element_by_xpath('//input[@placeholder="What do you want to learn?"]')
        # self.search_input1.send_keys(topic)
        #
        # self.search_input1.send_keys(Keys.ENTER)
        # sleep(5)

        self.course_title = self.browser.find_elements_by_xpath(
            '//h2[@class="color-primary-text card-title headline-1-text"]')
        self.course_instructor = self.browser.find_elements_by_xpath('//span[@class="partner-name m-b-1s"]')
        self.course_rating = self.browser.find_elements_by_xpath('//span[@class="ratings-text"]')
        self.course_level = self.browser.find_elements_by_xpath('//div[@class="_jen3vs _1d8rgfy3"]')
        self.course_image = self.browser.find_elements_by_xpath('//img[@class="product-photo"]')
        self.course_link = self.browser.find_elements_by_xpath('//a[@class="rc-DesktopSearchCard anchor-wrapper"]')
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
                "course_link": self.course_link[i].get_attribute('href')
            }
            # d['coursera'].append(dictObject)
            # self.lstCoursera.append(dictObject)
            lst.append(dictObject)
            # self.course_title_list.append(self.course_title[i].text)
            # print(self.course_title_list[i])
            # self.course_instructor_list.append(self.course_instructor[i].text)
            # print(self.course_instructor_list[i])
            # self.course_rating_list.append(self.course_rating[i].text)
            # print(self.course_rating_list[i])
            # self.course_level_list.append(self.course_level[i].text)
            # print(self.course_level_list[i])
            # self.course_image_list.append(self.course_image[i].get_attribute('src'))
            # print(self.course_image_list[i])
            # self.course_link_list.append(self.course_link[i].get_attribute('href'))
            # print(self.course_link_list[i])

        # self.df = pd.DataFrame({'Course Title':self.course_title_list, 'Image Src':self.course_image_list,'Instructor':self.course_instructor_list,'Rating':self.course_rating_list, 'Level': self.course_level_list, 'Link':self.course_link_list})
        # self.df.to_excel('./coursera_course_info.xlsx')

        # self.browser.close()
        # self.data.append(d)
        # obj.saving(topic,d);
        # topic_ref = ref.child(topic)
        # topic_ref.child('coursera').set(lst)
        print('coursera', lst)
        self.browser.close()
        lockDb.writeToDb('coursera', lst, topic)

    def youtube(self, topic, lockDb):
        print("youtube")
        self.browser.get(f"https://www.youtube.com/results?search_query=playlist+{topic}")
        sleep(10)
        # breakpoint()
        self.course_title = self.browser.find_elements_by_xpath('//span[@class="style-scope ytd-playlist-renderer"]')
        self.course_instructor = self.browser.find_elements_by_xpath(
            '//a[@class="yt-simple-endpoint style-scope yt-formatted-string"]')
        self.course_image = self.browser.find_elements_by_xpath('//a[@class="yt-simple-endpoint style-scope ytd-playlist-thumbnail"]/div[@class="style-scope ytd-playlist-thumbnail"]/ytd-playlist-video-thumbnail-renderer[@class="style-scope ytd-playlist-thumbnail"]/yt-img-shadow[@class="style-scope ytd-playlist-video-thumbnail-renderer no-transition"]/img[@class="style-scope yt-img-shadow"]')
        # for i in range(len(self.course_image)):
        #     print(self.course_image[i].get_attribute('src'))
        self.course_link = self.browser.find_elements_by_xpath(
            '//a[@class="yt-simple-endpoint style-scope ytd-playlist-renderer"]')

        lst = []
        x = 0
        for i in range(3):
            if self.course_instructor[x].text in ['', 'VIEW FULL PLAYLIST']:
                instructor = self.course_instructor[x + 1].text
                x += 1
            else:
                instructor = self.course_instructor[x].text
            dictObject = {
                "course_title": self.course_title[i].text.encode('unicode-escape').decode('utf-8'),
                "course_instructor": instructor,
                "course_image": self.course_image[i].get_attribute('src'),
                "course_link": self.course_link[i].get_attribute('href')
            }
            lst.append(dictObject)
        print('youtube', lst)
        self.browser.close()
        lockDb.writeToDb('youtube', lst, topic)

    def blogs(self, topic, lockDb):
        print("blog section")
        self.browser.get("https://www.google.com/")
        sleep(5)

        self.search_input3 = self.browser.find_element_by_xpath('//input[@class="gLFyf gsfi"]')
        self.search_input3.send_keys('"blogurl:"' + f'{topic}' + '"')

        self.search_input3.send_keys(Keys.ENTER)
        sleep(5)

        self.blog_title = self.browser.find_elements_by_xpath('//h3[@class="LC20lb DKV0Md"]//span')
        self.blog_link = self.browser.find_elements_by_xpath('//div[@class="rc"]//div[@class="yuRUbf"]//a')
        # self.blog_title_list = []
        # self.blog_link_list = []

        lst = []
        for i in range(5):
            dictObject = {
                "blog_title": self.blog_title[i].text.encode('unicode-escape').decode('utf-8'),
                "blog_link": self.blog_link[i].get_attribute('href')
            }
            lst.append(dictObject)
        print('blogs', lst)
        self.browser.close()
        lockDb.writeToDb('blogs', lst, topic)

    def saving(self, topic, d):
        self.name = []
        self.name.append(topic)

        with open('name.txt', 'a') as outfile:
            json.dump(self.name, outfile)

        # self.data = {}
        # self.data[topic] = {}
        # self.data[topic]["udemy"] = {}
        # self.data[topic]["udemy"]["title"] = self.course_title_list
        # self.data[topic]["udemy"]["instructor"] = self.course_instructor_list
        # self.data[topic]["udemy"]["rating"] = self.course_rating_list
        # self.data[topic]["udemy"]["image"] = self.course_image_list
        # self.data[topic]["udemy"]["link"] = self.course_link_list

        with open('data.json', 'a') as outfile:
            json.dump(d, outfile, indent=2)
            # json.dump(self.data, outfile, indent=2)

    def printing(self):
        with open('data.json') as json_file:
            data = json.load(json_file)
        json.dumps(data, indent=4)


def taskUdemy(topic, lockDb, objUdemy):
    objUdemy.Udemy(topic, lockDb)
    print("udemy")


def taskCoursera(topic, lockDb, objCoursera):
    objCoursera.coursera(topic, lockDb)
    print("coursera")


def taskYoutube(topic, lockDb, objYoutube):
    objYoutube.youtube(topic, lockDb)


def taskBlogs(topic, lockDb, objBlogs):
    objBlogs.blogs(topic, lockDb)


def callScapraping(topic):
    objUdemy = scraper()
    objCoursera = scraper()
    objYoutube = scraper()
    objBlogs = scraper()
    lockDb = LockingDb(topic)
    threads = []
    print("2")
    thread3 = threading.Thread(target=taskUdemy, args=(topic, lockDb, objUdemy))
    threads.append(thread3)
    thread3.start()
    print("0")
    thread1 = threading.Thread(target=taskCoursera, args=(topic, lockDb, objCoursera))
    threads.append(thread1)
    thread1.start()
    print("1")
    thread2 = threading.Thread(target=taskYoutube, args=(topic, lockDb, objYoutube))
    threads.append(thread2)
    thread2.start()
    thread3 = threading.Thread(target=taskBlogs, args=(topic, lockDb, objBlogs))
    threads.append(thread3)
    thread3.start()
    firebase.database().child('topic').child(topic).child('count').set(1)
    curr_date = datetime.datetime.now()
    print("curr_date", curr_date)
    # firebase.database().child(topic).child('date').set(str(curr_date))
    firebase.database().child('topic').child(topic).child('timestamp').set(int(datetime.datetime.timestamp(curr_date)))

    for thread in threads:
        thread.join()

    print("3")
