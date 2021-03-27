import os
from concurrent.futures import ThreadPoolExecutor
from time import *

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys


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
        # self.options.add_argument("--headless")
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
        self.browser = []
        self.browser2 = []
        self.blog_link = []
        self.blog_title = []
        self.course_rating = []
        self.course_title = []
        self.course_image = []
        self.course_level = []
        self.course_instructor = []
        self.search_input3 = []
        self.result = []
        self.course_link = []

    def Udemy(self, topic, listUdemy):

        print("udemy")
        try:
            self.options.add_argument("--window-size=1920,1080")
            # self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
            self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
            self.browser.get(f"https://www.udemy.com/courses/search/?lang=en&q=+{topic}+&sort=relevance&src=ukw")
            sleep(5)
            self.browser.save_screenshot("udemy.png")
            self.result = self.browser.find_elements_by_xpath('//h1[@class="udlite-heading-xl"]')

            if self.result:
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
            for i in range(min(3, len(self.course_title))):
                dictObject = {
                    # "course_title": self.course_title[i].text,
                    # "course_instructor": self.course_instructor[i].text,
                    # "course_rating": self.course_rating[i].text,
                    # "course_image": self.course_image[i].get_attribute('src'),
                    # "course_link": self.course_link[i].get_attribute('href')
                    "title": self.course_title[i].text,
                    "instructor": self.course_instructor[i].text,
                    "rating": self.course_rating[i].text,
                    "image": self.course_image[i].get_attribute('src'),
                    "link": self.course_link[i].get_attribute('href')
                }
                listUdemy.append(dictObject)
            print('udemy', listUdemy, 'length', len(self.course_title))
            self.browser.close()
            return listUdemy

        except Exception as e:
            print("udemy error", e)
            # print("title", len(self.course_title))
            # print("instructor", len(self.course_instructor))
            # print("rating", len(self.course_rating))
            # print("img", len(self.course_image))
            # print("link", len(self.course_link))
            # print("========================================================")
            # self.browser.close()

    def coursera(self, topic, listCoursera):
        print("coursera")
        try:
            self.options.add_argument("--window-size=400,481")

            # self.browser2 = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
            self.browser2 = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
            self.browser2.get(
                f"https://www.coursera.org/search?query=+{topic}+&index=prod_all_products_term_optimization&allLanguages=English")
            sleep(5)
            self.browser2.save_screenshot("coursera.png")

            self.course_title = self.browser2.find_elements_by_xpath(
                '//h2[@class="color-primary-text card-title headline-1-text"]')
            self.course_instructor = self.browser2.find_elements_by_xpath('//span[@class="partner-name"]')
            self.course_rating = self.browser2.find_elements_by_xpath('//span[@class="ratings-text"]')
            self.course_level = self.browser2.find_elements_by_xpath('//div[@class="_jen3vs _1d8rgfy3"]')
            self.course_image = self.browser2.find_elements_by_xpath('//div[@class="image-wrapper vertical-box"]//img')
            self.course_link = self.browser2.find_elements_by_xpath('//a[@class="rc-MobileSearchCard"]')

            for i in range(3):
                dictObject = {
                    # "course_title": self.course_title[i].text,
                    # "course_instructor": self.course_instructor[i].text,
                    # "course_rating": self.course_rating[i].text,
                    # "course_image": self.course_image[i].get_attribute('src'),
                    # "course_level":self.course_level[i].text,
                    # "course_link": self.course_link[i].get_attribute('href'),
                    "title": self.course_title[i].text,
                    "instructor": self.course_instructor[i].text,
                    "rating": self.course_rating[i].text,
                    "image": self.course_image[i].get_attribute('src'),
                    "level": self.course_level[i].text,
                    "link": self.course_link[i].get_attribute('href'),

                }
                listCoursera.append(dictObject)

            # print('coursera', listCoursera,'length',len(self.course_title))
            self.browser2.close()
            return listCoursera

        except Exception as e:
            print("coursera error", e)
            # print("title",len(self.course_title))
            # print("instructor",len(self.course_instructor))
            # print("rating",len(self.course_rating))
            # print("level",len(self.course_level))
            # print("img",len(self.course_image))
            # print("link",len(self.course_link))
            # print("========================================================")
            # self.browser2.close()
            # self.browser.close()

    def youtube(self, topic, listYoutube):
        self.options.add_argument("--window-size=1920,1080")
        # self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
        self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
        # self.browser.capabilities['version'] = "79.0"
        print("youtube")
        try:
            self.browser.get(f"https://www.youtube.com/results?search_query=playlist+{topic}")
            sleep(10)
            self.browser.save_screenshot("youtube.png")
            # breakpoint()
            self.course_title = self.browser.find_elements_by_xpath(
                '//span[@class="style-scope ytd-playlist-renderer"]')
            self.course_instructor = self.browser.find_elements_by_xpath(
                '//div[@class="style-scope ytd-playlist-renderer"]/a[@class="yt-simple-endpoint style-scope ytd-playlist-renderer"]/ytd-video-meta-block[@class="style-scope ytd-playlist-renderer"]/div[@class="style-scope ytd-video-meta-block"]/div[@class="style-scope ytd-video-meta-block"]/ytd-channel-name[@class="style-scope ytd-video-meta-block"]/div[@class="style-scope ytd-channel-name"]/div[@class="style-scope ytd-channel-name"]/yt-formatted-string[@class="style-scope ytd-channel-name complex-string"]/a[@class="yt-simple-endpoint style-scope yt-formatted-string"]')
            self.course_image = self.browser.find_elements_by_xpath(
                '//a[@class="yt-simple-endpoint style-scope ytd-playlist-thumbnail"]/div[@class="style-scope ytd-playlist-thumbnail"]/ytd-playlist-video-thumbnail-renderer[@class="style-scope ytd-playlist-thumbnail"]/yt-img-shadow[@class="style-scope ytd-playlist-video-thumbnail-renderer no-transition"]/img[@class="style-scope yt-img-shadow"]')
            # for i in range(len(self.course_image)):
            #     print(self.course_image[i].get_attribute('src'))
            self.course_link = self.browser.find_elements_by_xpath(
                '//a[@class="yt-simple-endpoint style-scope ytd-playlist-renderer"]')
            for i in range(min(3, len(self.course_title))):
                dictObject = {
                    #     "course_title": self.course_title[i].text.encode('unicode-escape').decode('utf-8'),
                    #     "course_instructor": self.course_instructor[i].text,
                    #     "course_image": self.course_image[i].get_attribute('src'),
                    #     "course_link": self.course_link[i].get_attribute('href')
                    "title": self.course_title[i].text.encode('unicode-escape').decode('utf-8'),
                    "instructor": self.course_instructor[i].text,
                    "image": self.course_image[i].get_attribute('src'),
                    "link": self.course_link[i].get_attribute('href')

                }
                listYoutube.append(dictObject)
            print('youtube', listYoutube, 'length', len(self.course_title))
            self.browser.close()
            return listYoutube
            # lockDb.writeToDb('youtube', lst, topic)
        except Exception as e:
            print("you tube error", e)
            # print("title", len(self.course_title))
            # print("instructor", len(self.course_instructor))
            # print("img", len(self.course_image))
            # print("link", len(self.course_link))
            # print("========================================================")
            # self.browser.close()

    def blogs(self, topic, listBlogs):
        self.options.add_argument("--window-size=1920,1080")
        self.browser = webdriver.Chrome(executable_path="./chromedriver.exe", options=self.options)
        # self.browser = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), options=self.options)
        print("blog section")
        try:
            self.browser.get("https://www.google.com")
            sleep(5)
            self.search_input3 = self.browser.find_element_by_xpath('//input[@class="gLFyf gsfi"]')
            self.search_input3.send_keys('blogurl:' + f'{topic}')

            self.search_input3.send_keys(Keys.ENTER)
            sleep(5)

            self.blog_title = self.browser.find_elements_by_xpath('//*[@id="rso"]/div/div/div/div/a/h3')
            self.blog_link = self.browser.find_elements_by_xpath('//div[@class="tF2Cxc"]/div[@class="yuRUbf"]/a')
            # self.blog_title_list = []
            # self.blog_link_list = []
            # x=0
            for i in range(min(5, len(self.blog_title))):
                dictObject = {
                    # "blog_title": self.blog_title[i].text.encode('unicode-escape').decode('utf-8'),
                    # "blog_link": self.blog_link[i].get_attribute('href')
                    "title": self.blog_title[i].text.encode('unicode-escape').decode('utf-8'),
                    "link": self.blog_link[i].get_attribute('href')

                }
                # x = x+3
                # if dictObject['blog_title'] is "":
                #     dictObject['blog_title'] = topic
                if dictObject['title'] == "":
                    dictObject['title'] = topic
                listBlogs.append(dictObject)
            print('blogs', listBlogs, 'length', len(self.blog_title))
            self.browser.close()
            return listBlogs
            # lockDb.writeToDb('blogs', lst, topic)
        except Exception as e:
            print("blogs error", e)
            # print("title", len(self.blog_title))
            # print("link", len(self.blog_link))
            # print("========================================================")
            self.browser.close()


def taskUdemy(topic, objUdemy, listUdemy):
    print("call udemy")
    objUdemy.Udemy(topic, listUdemy)


def taskCoursera(topic, objCoursera, listCoursera):
    print("call coursera")
    objCoursera.coursera(topic, listCoursera)


def taskYoutube(topic, objYoutube, listYoutube):
    print("call you tube")
    objYoutube.youtube(topic, listYoutube)


def taskBlogs(topic, objBlogs, listBlogs):
    print("call blog")
    objBlogs.blogs(topic, listBlogs)


def callScapraping(topic):
    objUdemy = scraper()
    objCoursera = scraper()
    objYoutube = scraper()
    objBlogs = scraper()

    lst = {}
    listUdemy = []
    listYoutube = []
    listCoursera = []
    listBlogs = []

    with ThreadPoolExecutor(max_workers=4) as e:
        e.submit(taskUdemy, topic, objUdemy, listUdemy)
        e.submit(taskYoutube, topic, objYoutube, listYoutube)
        e.submit(taskCoursera, topic, objCoursera, listCoursera)
        e.submit(taskBlogs, topic, objBlogs, listBlogs)

    lst['udemy'] = listUdemy
    lst['youtube'] = listYoutube
    lst['coursera'] = listCoursera
    lst['blogs'] = listBlogs

    return lst
