# -*- coding: utf-8 -*-
from __future__ import unicode_literals
# import smtplib
from django.core.mail import send_mail
from django.shortcuts import render
from django.apps import apps
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from datetime import datetime ,timedelta
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import hashlib
import string
import random
import io
import re

Logo = apps.get_model('evilfish_admin', 'Logo')
Category = apps.get_model('evilfish_admin', 'Category')
Product = apps.get_model('evilfish_admin', 'Product')
Comments = apps.get_model('evilfish_admin', 'Comments')
Admins = apps.get_model('evilfish_admin', 'Admins')

re_pattern = re.compile(r'v=([\w\s]+)&?')

def index(request):
    comments = []
    categ = []
    logo = None
    try:
        comments = Comments.objects.filter(visible=True)
        categ = Category.objects.all()
        logo = Logo.objects.get(pk=1)
    except:
        pass
    for comm in comments:
        comm.comment = comm.comment.split('\n')
    if logo.urlvideo != '':
        logo.urlvideo = re_pattern.search(logo.urlvideo).group(1)
    context = {
        'logo': logo,
        'categ': categ,
        'comments': comments,
        'commented': request.session.get('sendcomm', False)
    }
    return render(request, "index.html", context)


def random_generator(size=5, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for x in range(size))

def captcha(secret, width=300, height=80, fontName='arial.ttf', fontSize=54):
    mask = Image.new('RGBA', (width, height))
    font = ImageFont.truetype(fontName, fontSize)

    x_offset = -10
    draw = ImageDraw.Draw(mask)
    for i in range(len(secret)):
        x_offset += 30 + int(random.random() * 20)
        y_offset = -10 + int(random.random() * 30)
        draw.text((x_offset, y_offset), secret[i], font=font)

    angle = -10 + int(random.random() * 15)
    mask = mask.rotate(angle)

    bg = plazma(width, height)
    fg = plazma(width, height)
    result = Image.composite(bg, fg, mask)
    return result


def plazma(width, height):
    img = Image.new('RGB', (width, height))
    pix = img.load()
    for xy in [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]:
        rgb = []
        for i in range(3):
            rgb.append(int(random.random() * 256))
        pix[xy[0], xy[1]] = (rgb[0], rgb[1], rgb[2])

    plazmaRec(pix, 0, 0, width - 1, height - 1)
    return img


def plazmaRec(pix, x1, y1, x2, y2):
    if (abs(x1 - x2) <= 1) and (abs(y1 - y2) <= 1):
        return

    rgb = []
    for i in range(3):
        rgb.append((pix[x1, y1][i] + pix[x1, y2][i]) / 2)
        rgb.append((pix[x2, y1][i] + pix[x2, y2][i]) / 2)
        rgb.append((pix[x1, y1][i] + pix[x2, y1][i]) / 2)
        rgb.append((pix[x1, y2][i] + pix[x2, y2][i]) / 2)

        tmp = (pix[x1, y1][i] + pix[x1, y2][i] +
               pix[x2, y1][i] + pix[x2, y2][i]) / 4
        diagonal = ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
        while True:
            delta = int(((random.random() - 0.5) / 100 * min(100, diagonal)) * 255)
            if (tmp + delta >= 0) and (tmp + delta <= 255):
                tmp += delta
                break
        rgb.append(tmp)

    pix[x1, (y1 + y2) / 2] = (rgb[0], rgb[5], rgb[10])
    pix[x2, (y1 + y2) / 2] = (rgb[1], rgb[6], rgb[11])
    pix[(x1 + x2) / 2, y1] = (rgb[2], rgb[7], rgb[12])
    pix[(x1 + x2) / 2, y2] = (rgb[3], rgb[8], rgb[13])
    pix[(x1 + x2) / 2, (y1 + y2) / 2] = (rgb[4], rgb[9], rgb[14])

    plazmaRec(pix, x1, y1, (x1 + x2) / 2, (y1 + y2) / 2)
    plazmaRec(pix, (x1 + x2) / 2, y1, x2, (y1 + y2) / 2)
    plazmaRec(pix, x1, (y1 + y2) / 2, (x1 + x2) / 2, y2)
    plazmaRec(pix, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2)

@csrf_protect
def getcaptcha(request):  # TODO many requests
    if not request.session.get('sendcomm', False):
        if not request.session.get('gencaptcha', False):
            request.session['gencaptcha'] = True
            request.session.save()
            # print('before '+str(request.session['gencaptcha']))
            key = random_generator()
            request.session['captcha'] = key
            print('captcha '+key)
            res = captcha(key)
            png_bytes = io.BytesIO()
            res.save(png_bytes, "PNG")
            request.session['gencaptcha'] = False
            request.session.save()
            # print('after ' + str(request.session['gencaptcha']))
            return HttpResponse(png_bytes.getvalue(), status=200, content_type='image/png')
        else:
            return HttpResponse('generation captcha not finish', status=429, content_type='text/plain')
    else:
        return HttpResponse('you sended comment', status=429, content_type='text/plain')

def blockspam(request):
    fmt = '%Y%m%d%H%M%S'
    timeout = datetime.strptime(request.session.get('timeout', datetime.now().strftime(fmt)), fmt)
    curr = datetime.now()
    time_seconds = timeout - curr
    out = {
        "path": request.session['prev_path'],
        "time": time_seconds.total_seconds(),
    }
    return render(request, "blockspam.html", {'time': out})


def login(request):
    if request.method == 'GET':
        return render(request, "login.html")
    elif request.method == 'POST':
        login = request.POST.get('login', '')
        passw = request.POST.get('pass', '')
        ekey = request.POST.get('key', '')
        try:
            user = Admins.objects.get(login=login, passw=hashlib.md5(passw).hexdigest())
            if ekey != '' and str(ekey).upper() == request.session.get('key', None):
                request.session['admin'] = True
                return HttpResponse('/admin', status=303, content_type='text/plain')
            else:
                request.session['key'] = random_generator()
                key = request.session['key']
                print key
                try:
                    send_mail('Вход в панель администратора', 'Ключ для подтверждения "{0}"'.format(key), 'test_evilfish@mail.ru',
                          [str(user.email)], fail_silently=False)
                except Exception as e:
                    return HttpResponse('Email error: {0}'.format(e.message), status=500, content_type='text/plain')
                return HttpResponse('access', status=202, content_type='text/plain')
        except:
            request.session['admin'] = False
            return HttpResponse('invalid login or pass', status=404, content_type='text/plain')
    else:
        return render(request, "Error404.html", status=404)


def sendcomment(request):
    if request.method == 'POST' and not request.session.get('sendcomm', False):
        cap = request.session.get('captcha', None)
        if cap is not None and request.POST['captcha'].upper() == cap.upper() and request.POST['captcha'] != '':
            if not re.match(r'[\w\d\s]{2,}@[\w\d\s]{2,}\.[\w\d\s]{2,}', request.POST['email']):
                return HttpResponse(u'Неправильная почта', status=400,
                                    content_type='text/plain; charset=utf-8')
            if request.POST['name'] == '':
                return HttpResponse(u'Имя не может быть пустым', status=400,
                                    content_type='text/plain; charset=utf-8')
            if request.POST['comment'] == '':
                return HttpResponse(u'Комментарий не может быть пустым', status=400,
                                    content_type='text/plain; charset=utf-8')
            comm = Comments()
            comm.name = request.POST['name']
            comm.email = request.POST['email']
            comm.comment = request.POST['comment']
            comm.confirm = False
            comm.save()
            deldate = datetime.now() - timedelta(weeks=1)
            Comments.objects.filter(confirm=False, addtime__lte=deldate).delete()
            # request.session['sendcomm'] = True
            return HttpResponse('Благодарим за ваш отзыв. Он появиться после проверки администратором сайта', status=200, content_type='text/plain; charset=utf-8')
        else:
            return HttpResponse('Неправильный текст с изображения', status=400, content_type='text/plain; charset=utf-8')
    else:
        return HttpResponse('Вы уже оставляли отзыв', status=400, content_type='text/plain; charset=utf-8')

@csrf_exempt
def getproduct(request, pk=None):
    if pk is not None:
        out = list(Product.objects.filter(category=pk, visible=True).values())
    else:
        return HttpResponse('Ошибка операции', content_type='text/plain; charset=utf-8', status=400)
    return JsonResponse({"data": out})
