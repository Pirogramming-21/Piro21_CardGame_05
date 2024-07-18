from django.urls import path
from .views import *
from django.conf import settings

app_name = 'users'
urlpatterns = [
    path('', main, name='main'),
    path('signup', signup, name='signup'),
    path('login', login_view, name='login'),
    path('logout', logout_view, name='logout')

]
