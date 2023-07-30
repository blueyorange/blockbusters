from bs4 import BeautifulSoup
import requests
import json

homeURL = "https://quizmasters.biz/DB/Que/Static/Blockbusters_Menu.html"
homePage = requests.get(homeURL)
homeSoup = BeautifulSoup(homePage.text)
links = homeSoup.find_all('a')
urls = []
for link in links:
    url = 'https://quizmasters.biz/DB/Que/Static/'+link.get('href')
    urls.append(url)

questions = {}
counter = 0
for url in urls:
    print(url)
    page = requests.get(url)
    soup = BeautifulSoup(page.text,features="html.parser")
    rows = soup.find_all('tr')
    rows.pop(0)
    rows.pop(0)
    for row in rows:
        cells = row.contents
        question = {}
        letter = cells[3].string
        if letter not in questions:
            questions[letter] = []
        questionStr = cells[5].string
        if not questionStr:
            continue
        answerStr = cells[7].string
        if (questionStr.isspace() or answerStr.isspace()):
            print("question or answer not found")
            continue
        else:
            counter += 1
            print(str(counter) + ' questions added.')
        question['question'] = questionStr
        question['answer'] = answerStr
        questions[letter].append(question)

with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=4)
