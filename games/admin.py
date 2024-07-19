from django.contrib import admin
from games.models import Game
from games.models import Game_Result

import games

# Register your models here.

admin.site.register(Game)
admin.site.register(Game_Result)
