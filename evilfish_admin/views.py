# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from models import Logo, Category, Product, Comments
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import hashlib
import datetime
import os


def index(request):
    return render(request, "admin.html")


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
    if request.GET.get('category', None) is not None:
        out = list(Product.objects.filter(category=request.GET['category']).values())
    else:
        return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
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
        return HttpResponse('Обновление успешшно', content_type='text/plain; charset=utf-8')
    else:
        return HttpResponseRedirect("/admin/login/")


def setCategory(request):
    if request.method == "POST":
        if request.POST['typeOperation'] == "add":
            newCategory = Category()
            newCategory.name = request.POST['name']
            newCategory.vegan = bool(int(request.POST['vegan']))
            newCategory.save()
            return HttpResponse('Добавление успешшно', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "upd":
            idCat = int(request.POST['id'])
            updCategory = Category.objects.get(pk=idCat)
            updCategory.name = request.POST['name']
            updCategory.vegan = bool(int(request.POST['vegan']))
            updCategory.save()
            return HttpResponse('Обновление успешшно', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "del":
            idCat = int(request.POST['id'])
            delCategory = Category.objects.get(pk=idCat)
            products = Product.objects.filter(category=idCat)
            for prod in products:
                if prod.imageurl != "":
                    urlpath = "evilfish_admin/static/images/"
                    if os.path.exists(urlpath + prod.imageurl):
                        os.remove(urlpath + prod.imageurl)
                prod.delete()
            delCategory.delete()
            return HttpResponse('Удаление успешшно', content_type='text/plain; charset=utf-8')
        else:
            return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
    else:
        return HttpResponseRedirect("/admin/login/")


def setProduct(request):
    if request.method == "POST":
        if request.POST['typeOperation'] == "add":
            categ_id = Category.objects.get(pk=int(request.POST['category_id']))
            prod = Product()
            prod.category = categ_id
            prod.typecomp = request.POST['typecomp']
            prod.title = request.POST['title']
            prod.description = request.POST['description']
            prod.price = request.POST['price']
            prod.imageurl = request.POST['imageurl']
            prod.visible = False
            prod.save()
            return HttpResponse('Продукт добавлен', content_type='text/plain')
        elif request.POST['typeOperation'] == "upd":
            idProd = int(request.POST['id'])
            prod = Product.objects.get(pk=idProd)
            prod.typecomp = request.POST['typecomp']
            prod.title = request.POST['title']
            prod.description = request.POST['description']
            prod.price = request.POST['price']
            prod.imageurl = request.POST['imageurl']
            prod.save()
            return HttpResponse('Изменение продукта успешшно', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "del":
            idProd = int(request.POST['id'])
            prod = Product.objects.get(pk=idProd)
            if prod.imageurl != "":
                urlpath = "evilfish_admin/static/images/"
                if os.path.exists(urlpath+prod.imageurl):
                    os.remove(urlpath+prod.imageurl)
            prod.delete()
            return HttpResponse(''
                                'Удаление продукта успешшно', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "vis":
            idProd = int(request.POST['id'])
            prod = Product.objects.get(pk=idProd)
            prod.visible = not prod.visible
            prod.save()
            return HttpResponse('Изменение видимости продукта успешшно', content_type='text/plain; charset=utf-8')
        else:
            return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
    else:
        return HttpResponseRedirect("/admin/login/")


def setFile(request):
    if request.method == "POST":
        if request.POST['typeOperation'] == "add":
            if request.FILES.get('imageurl', False):
                if request.FILES['imageurl'].name.lower().endswith('.png'):
                    nameOut = hashlib.md5(bytes(str(datetime.datetime.today()) + "evilfish"))
                    nameOut = nameOut.hexdigest()+".png"
                    path = os.sep.join(["D:","develop","evilfish","evilfish_project","evilfish_admin", "static", "images", nameOut])
                    with open(path, 'wb+') as destination:
                        destination.write(request.FILES['imageurl'].read())
                    img = Image.open(path)
                    width, height = img.size
                    if height >= width:
                        new_width = int(round(height * 1.6, 0))
                        new_height = height
                    else:
                        new_width = width
                        new_height = int(round(width / 1.6, 0))
                    new_img = Image.new('RGBA', (new_width, new_height))
                    if height >= width:
                        new_img.paste(img, (int(round((new_width-width)/2, 0)), 0))
                    else:
                        new_img.paste(img, (0, int(round((new_height-height)/2, 0))))
                    img.close()
                    new_img = new_img.resize((800, 500), Image.ANTIALIAS)
                    new_img.save(path)
                    new_img.close()
                    if request.POST['change_product'] == "upd":
                        idProd = int(request.POST['product_id'])
                        prod = Product.objects.get(pk=idProd)
                        prod.imageurl = nameOut
                        prod.save()
                        return JsonResponse({"success": True, "msg": nameOut, "upd": True})
                    else:
                        return JsonResponse({"success": True, "msg": nameOut})
                else:
                    return JsonResponse({"success": False, "msg": "Файл не формата PNG"})
            else:
                return JsonResponse({"success": False, "msg": "Файл не выбран"})
        elif request.POST['typeOperation'] == "del":
            if request.POST.get('imageurl', False):
                path = os.sep.join(
                    ["D:", "develop", "evilfish", "evilfish_project", "evilfish_admin", "static", "images", request.POST['imageurl']])
                if request.POST.get('change_product') == "upd":
                    idProd = int(request.POST['product_id'])
                    prod = Product.objects.get(pk=idProd)
                    prod.imageurl = ''
                    prod.save()
                if os.path.exists(path):
                    os.remove(path)
                    return HttpResponse('Удаление изображения успешшно', content_type='text/plain; charset=utf-8')
                else:
                    return HttpResponse('Ошибка удаления изображения не существует', content_type='text/plain; charset=utf-8')
            else:
                return HttpResponse('Ошибка удаления(нет имени изображения)', content_type='text/plain; charset=utf-8')
        else:
            return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
    else:
        return HttpResponseRedirect("/admin/login/")


def setComments(request):
    if request.method == "POST":
        if request.POST['typeOperation'] == "change":
            idCom = int(request.POST['id'])
            com = Comments.objects.get(pk=idCom)
            com.visible = not com.visible
            com.confirm = True
            com.save()
            return HttpResponse('Видимость комментария изменена', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "del":
            idCom = int(request.POST['id'])
            com = Comments.objects.get(pk=idCom)
            com.delete()
            return HttpResponse('Удаление комментария успешшно', content_type='text/plain; charset=utf-8')
        elif request.POST['typeOperation'] == "delall":
            delall = Comments.objects.filter(confirm=False)
            delall.delete()
            return HttpResponse('Удаление всех скрытых комментариев успешшно', content_type='text/plain; charset=utf-8')
        else:
            return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
    else:
        return HttpResponseRedirect("/admin/login/")
