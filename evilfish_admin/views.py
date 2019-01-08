# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from models import Logo, Category, Product, Comments
# Create your views here.


def index(request):
    return render(request, "admin.html")


def login(request):
    return render(request, "login.html")


def getLogo(request):
    out = Logo.objects.get(pk=1)
    resp = {
        "phone": out.phones,
        "urlvideo": out.urlvideo,
        "mainhtml": out.mainhtml
    }
    return JsonResponse(dict(resp))


def getCategory(request):
    out = list(Category.objects.all().values())
    return JsonResponse({"data": out})


def getProduct(request):
    out = list(Product.objects.filter(category=request.GET['category']).values())
    return JsonResponse({"data": out})


def getComments(request):
    out = list(Comments.objects.all().values())
    return JsonResponse({"data": out})


def setLogo(request):
    if request.method == "POST":
        logo = Logo.objects.get(pk=1)
        logo.phones = request.POST['phone']
        logo.urlvideo = request.POST['urlvideo']
        logo.mainhtml = request.POST['mainhtml']
        logo.save()
        return HttpResponse('Обновление успешшно', content_type='text/plain')
    else:
        return render(request, "login.html")


def setCategory(request):
    if request.method == "POST":
        if request.POST['typeOperation'] == "add":
            newCategory = Category()
            newCategory.name = request.POST['name']
            newCategory.vegan = bool(int(request.POST['vegan']))
            newCategory.save()
            return HttpResponse('Добавление успешшно', content_type='text/plain')
        elif request.POST['typeOperation'] == "upd":
            idCat = int(request.POST['id'])
            updCategory = Category.objects.get(pk=idCat)
            updCategory.name = request.POST['name']
            updCategory.vegan = bool(int(request.POST['vegan']))
            updCategory.save()
            return HttpResponse('Обновление успешшно', content_type='text/plain')
        elif request.POST['typeOperation'] == "del":
            idCat = int(request.POST['id'])  # TODO добавить удаление фото по ссылке
            delCategory = Category.objects.get(pk=idCat)
            delCategory.delete()
            return HttpResponse('Удаление успешшно', content_type='text/plain')
        else:
            return HttpResponse('Ошибка операции', content_type='text/plain', status=400)
    else:
        return render(request, "login.html")


def setProduct(request):
    return render(request, "login.html")


def setComments(request):
    return render(request, "login.html")
