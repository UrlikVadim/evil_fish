from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.index),
    url('^login', views.login),
    url('^blockspam', views.blockspam),
    url('^getcaptcha', views.getcaptcha),
    url('^sendcomment', views.sendcomment),
    url('^getproduct/(?P<pk>[0-9]+)$', views.getproduct),
]