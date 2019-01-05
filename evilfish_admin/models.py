# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Admins(models.Model):
    login = models.TextField()
    passw = models.TextField()
    email = models.EmailField()

    def __str__(self):
        return self.login


class Logo(models.Model):
    phones = models.TextField()
    urlvideo = models.TextField()
    mainhtml = models.TextField()

    def __str__(self):
        return self.phones


class Category(models.Model):
    name = models.TextField()
    vegan = models.BooleanField()

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey("Category")
    title = models.TextField()
    description = models.TextField()
    price = models.TextField()
    imageurl = models.TextField()
    visible = models.BooleanField()

    def __str__(self):
        return self.title


class Comments(models.Model):
    name = models.TextField()
    comment = models.TextField()
    email = models.EmailField()
    visible = models.BooleanField()

    def __str__(self):
        return self.name
