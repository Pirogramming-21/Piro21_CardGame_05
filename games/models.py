from django.db import models
from users.models import User


# Create your models here.
class Game(models.Model):
    attacker = models.ForeignKey(User, related_name='attacker_users', on_delete=models.CASCADE)
    defender = models.ForeignKey(User, related_name='defender_users', on_delete=models.CASCADE)
    attacker_card = models.IntegerField(default=0)
    defender_card = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)


class Game_Result(models.Model):
    game = models.ForeignKey(Game, related_name='game', on_delete=models.CASCADE)
    winner = models.ForeignKey(User, related_name='win_user', null=True, blank=True, on_delete=models.SET_NULL)
    loser = models.ForeignKey(User, related_name='lose_user', null=True, blank=True, on_delete=models.SET_NULL)
    winner_points = models.IntegerField(default=0)
    loser_points = models.IntegerField(default=0)
    result = models.BooleanField(default=False)
    message = models.CharField(max_length=30)
