# coding: utf-8

import sys
import requests
import random
import string
import time
from datetime import datetime
from multiprocessing import Process, current_process


def spam_process(finish_date=None, url=None, params={}, kill=False):

    def random_str(size=8, chars=string.ascii_lowercase + string.digits):
        return ''.join(random.choice(chars) for x in range(size))

    def get_value(type_value):
        if type_value == 'phone':
            return str(random.randrange(79051245678, 89059999999))
        elif type_value == 'email':
            return random_str(size=6) + '@' + random_str(size=5) + '.' + random_str(size=3)
        elif type_value == 'int':
            return str(random.randrange(999999999))
        else:
            return random_str(size=6)

    try:
        headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'}
        while datetime.now() < finish_date and not kill:
            data = {}
            for key in params:
                data[key] = get_value(params[key])
            r = requests.post(url, data=data, headers=headers)
            print (current_process().name + "  status code = " + str(r.status_code))
            time.sleep(0.2)
    except KeyboardInterrupt:
        print (current_process().name+' press Ctrl+C')




if __name__ == "__main__":
    process = []
    kill = False
    try:
        print u'---------------------------'
        print u'Доброе утро славяне'
        count_process = int(raw_input('Count Process = '))
        start_date = datetime.strptime(raw_input('Start DATE = '), "%d.%m.%y %H:%M")
        finish_date = datetime.strptime(raw_input('Finish DATE = '), "%d.%m.%y %H:%M")
        url = raw_input('URL = ')
        print '---------------------------'
        params = {}
        print 'params'
        while True:
            input_str = raw_input()
            if input_str == 'end params':
                break
            else:
                key, value = input_str.split('=')
                params[key.strip()] = value.strip()
        print u'---------------------------'

        while datetime.now() < start_date:
            sys.stdout.write(u'\rОсталось времени ' + str(start_date - datetime.now()))
            sys.stdout.flush()
            time.sleep(0.1)
        print u'\n\rПонеслась'
        print u'---------------------------'

        for i in xrange(count_process):
            proc = Process(target=spam_process, args=(finish_date, url, params, kill))
            process.append(proc)
            proc.start()
        for p in process:
            p.join()
        print u'---------------------------'
        print u'Все закончилось'
    except KeyboardInterrupt:
        print ('Pressing Ctr+C')
