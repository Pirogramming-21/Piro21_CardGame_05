from django.urls import path
from .views import *
from django.conf import settings

app_name = 'users'
urlpatterns = [
    path('signup', signup, name='signup'),
    path('login', login, name='login'),
    path('logout', logout, name='logout')

]
