# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.apps import apps
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
import hashlib
import datetime
import string
import random

Logo = apps.get_model('evilfish_admin', 'Logo')
Category = apps.get_model('evilfish_admin', 'Category')
Product = apps.get_model('evilfish_admin', 'Product')
Comments = apps.get_model('evilfish_admin', 'Comments')
Admins = apps.get_model('evilfish_admin', 'Admins')

# Create your views here.


def index(request):  # todo select Logo
    return render(request, "index.html")


def blockspam(request):
    return render(request, "manyrequests.html")


def login(request):
    if request.method == 'GET':
        return render(request, "login.html")
    elif request.method == 'POST':
        def random_generator(size=5, chars=string.ascii_uppercase + string.digits):
            return ''.join(random.choice(chars) for x in range(size))
        login = request.POST.get('login', '')
        passw = request.POST.get('pass', '')
        ekey = request.POST.get('key', '')
        try:
            user = Admins.objects.get(login=login, passw=hashlib.md5(passw).hexdigest())
            if ekey != '' and ekey == request.session.get('key', None):
                request.session['admin'] = True
                return HttpResponse('/admin', status=303, content_type='text/plain')
            else:
                request.session['key'] = random_generator()
                print (request.session['key'])
                return HttpResponse('access', status=202, content_type='text/plain')
        except:
            request.session['admin'] = False
            return HttpResponse('invalid login or pass', status=404, content_type='text/plain')
    else:
        return render(request, "Error404.html", status=404)


