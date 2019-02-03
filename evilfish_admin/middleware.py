# coding: utf-8
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.utils.deprecation import MiddlewareMixin


class SpamRequestBlock(MiddlewareMixin):
    def process_request(self, request):
        if request.path_info == request.session.get('prev_path', False):
            request.session['counter'] += 1
        else:
            request.session['counter'] = 0
        request.session['prev_path'] = request.path_info
        # print request.session['counter']
        if request.session['counter'] == 5 and request.session.get('admin', False) is False:
            return HttpResponseRedirect('/blockspam')
        # return None  # HttpResponse(str(request.path_info))


class AdminRequestBlock(MiddlewareMixin):
    def process_request(self, request):
        print (request.session.get('admin', 'kek'))
        if request.session.get('admin', False) is False and request.path_info.startswith('/admin'):
            return HttpResponseRedirect('/login')
