from django.urls import path
from .views import *
from django.conf import settings

app_name = 'games'
urlpatterns = [
    path('', main, name='main'),
    path('list', game_list, name='game_list'),
    path('attack', game_attack, name='game_attack'),
    path('detail/int<pk>', game_detail, name='game_detail'),
    path('defender/int<pk>', game_defender, name='game_defender'),
    path('rank', game_rank, name='game_rank'),
    path('delete/int<pk>', game_delete, name='game_delete')

]
