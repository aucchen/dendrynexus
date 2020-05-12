#!/usr/bin/env python

import os
import random
import time

from selenium import webdriver

file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'index.html')

# automated player for dendry using selenium
def test(output_path='output.txt', dump_stats=1, script_path='transcript.txt'):
    script = []
    transcript = ''
    current_paragraphs = set()
    driver = webdriver.Firefox()
    driver.get('file://' + file_path)
    link_divs = driver.find_elements_by_xpath('//ul[@class="choices"]//li')
    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
    print(data)
    while len(link_divs) > 0:
        link_divs = driver.find_elements_by_xpath('//ul[@class="choices"]//li')
        # find main text: find all text elements under <div id="content"> 
        content_text = driver.find_elements_by_xpath('//div[@id="content"]/p')
        for i, paragraph in enumerate(content_text):
            if len(paragraph.text.strip()) == 0:
                continue
            # filter paragraphs based on whether they're seen
            if paragraph.text in current_paragraphs:
                continue
            if i == 0 and paragraph.text not in current_paragraphs:
                current_paragraphs = set()
                if dump_stats:
                    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
                    transcript += '\n\nDATA:\n' + data
                transcript += '\n'
            current_paragraphs.add(paragraph.text)
            print('\n ', paragraph.text)
            transcript += '\n ' + paragraph.text
        for link in link_divs:
            print('\n -', link.text)
            transcript += '\n -' + link.text
        # click on a random link
        links = driver.find_elements_by_xpath('//ul[@class="choices"]//a')
        if len(links) == 0:
            break
        link_choice = random.choice(links)
        print('\n>>> ' + link_choice.text)
        script.append(link_choice.text)
        transcript += '\n>>> ' + link_choice.text
        link_choice.click()
        # TODO: save/dump stats somewhere?
    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
    transcript += '\nFINAL DATA:\n' + data
    print(data)
    driver.quit()
    with open(output_path, 'w') as f:
        f.write(transcript)
    with open(script_path, 'w') as f:
        for line in script:
            f.write(line + '\n')
    return transcript

def test_with_script(script_path, output_path='script_output.txt', dump_stats=1):
    """
    tests with a script: a script is a list of link text strings, each indicating the link text to click on.
    """
    script_data = []
    with open(script_path) as f:
        for line in f.readlines():
            script_data.append(line.strip())
    transcript = ''
    current_paragraphs = set()
    driver = webdriver.Firefox()
    driver.get('file://' + file_path)
    link_divs = driver.find_elements_by_xpath('//ul[@class="choices"]//li')
    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
    print(data)
    while len(link_divs) > 0:
        link_divs = driver.find_elements_by_xpath('//ul[@class="choices"]//li')
        # find main text: find all text elements under <div id="content"> 
        content_text = driver.find_elements_by_xpath('//div[@id="content"]/p')
        for i, paragraph in enumerate(content_text):
            if len(paragraph.text.strip()) == 0:
                continue
            # filter paragraphs based on whether they're seen
            if paragraph.text in current_paragraphs:
                continue
            if i == 0 and paragraph.text not in current_paragraphs:
                current_paragraphs = set()
                if dump_stats:
                    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
                    transcript += '\n\nDATA:\n' + data
                transcript += '\n'
            current_paragraphs.add(paragraph.text)
            print('\n ', paragraph.text)
            transcript += '\n ' + paragraph.text
        for link in link_divs:
            print('\n -', link.text)
            transcript += '\n -' + link.text
        # click on link indicated by script
        links = driver.find_elements_by_xpath('//ul[@class="choices"]//a')
        if len(links) == 0:
            break
        link_choice = random.choice(links)
        # if the link text is not in the script, then just continue.
        has_link_text = False
        for link in links:
            if link.text == script_data[0]:
                script_data = script_data[1:]
                link_choice = link
                has_link_text = True
                break
        if not has_link_text and len(links) > 1:
            print('WARNING: link not found in script')
        print('\n>>> ' + link_choice.text)
        transcript += '\n>>> ' + link_choice.text
        link_choice.click()
    data = driver.execute_script('return JSON.stringify(window.dendryUI.dendryEngine.getExportableState(), null, 2);');
    transcript += '\nFINAL DATA:\n' + data
    print(data)
    driver.quit()
    with open(output_path, 'w') as f:
        f.write(transcript)
    return transcript


if __name__ == '__main__':
    print(file_path)
    test()
