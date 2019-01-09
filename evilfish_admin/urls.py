from django.conf.urls import url
from . import views
# admin/

urlpatterns = [
    url(r'^$', views.index),
    url(r'^login$', views.login),
    url(r'^getLogo$', views.getLogo),
    url(r'^getCategory', views.getCategory),
    url(r'^getProduct', views.getProduct),
    url(r'^getComments', views.getComments),
    url(r'^setLogo', views.setLogo),
    url(r'^setCategory', views.setCategory),
    url(r'^setComments', views.setComments),
]