# coding: utf-8
from datetime import datetime, timedelta
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin


class SpamRequestBlock(MiddlewareMixin):
    def process_request(self, request):
        timeout = request.session.get('timeout', datetime.now().strftime('%Y%m%d%H%M%S'))
        timeout = datetime.strptime(timeout, '%Y%m%d%H%M%S')
        if timeout > datetime.now() and request.path_info != '/blockspam':
            timeout += timedelta(seconds=request.session['counter']*10)
            request.session['timeout'] = timeout.strftime('%Y%m%d%H%M%S')
            return HttpResponseRedirect('/blockspam')
        else:
            if request.path_info == '/':
                request.session['guest'] = True
            if not request.session.get('guest', False):
                return HttpResponseRedirect('/')
            if request.path_info == '/login' and request.method == 'POST':
                request.session['counter'] += 1
            else:
                request.session['counter'] = 0
            if request.session.get('gencaptcha', False) and request.path_info == '/getcaptcha':
                return HttpResponse('generation captcha not finish', status=429, content_type='text/plain')
            request.session['prev_path'] = request.path_info
            if request.session['counter'] >= 5 and not request.session.get('admin', False):
                timeout = datetime.now() + timedelta(seconds=request.session['counter']*10)
                request.session['timeout'] = timeout.strftime('%Y%m%d%H%M%S')
                return HttpResponse('/blockspam', status=303, content_type='text/plain')


class AdminRequestBlock(MiddlewareMixin):
    def process_request(self, request):
        print ('admin = ' + str(request.session.get('admin', 'kek')))
        if request.session.get('admin', False) is False and request.path_info.startswith('/admin'):
            return HttpResponseRedirect('/login')
