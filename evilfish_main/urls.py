from django.conf.urls import url
from . import views

urlpatterns = [
    url('^$', views.index),
    url('^login', views.login),
    url('^blockspam', views.blockspam),
]