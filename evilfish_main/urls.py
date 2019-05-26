from django.conf.urls import url
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico', permanent=True)),
    url('^$', views.index),
    url('^login', views.login),
    url('^blockspam', views.blockspam),
    url('^getcaptcha', views.getcaptcha),
    url('^sendcomment', views.sendcomment),
    url('^getproduct/(?P<pk>[0-9]+)$', views.getproduct),
]