from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
import random

from games.models import Game, Game_Result


# Create your views here.



def main(request):
    return render(request, 'index.html')


@login_required
def game_list(request):
    user = request.user
    games_attack = Game.objects.filter(attacker=user)
    games_defense = Game.objects.filter(defender=user)
    result = Game_Result.objects.all()
    context = {'games_attack': games_attack,
               'games_defense': games_defense,
               'user': user,
               'results': result}

    return render(request, 'game_list.html', context)


@login_required
def game_attack(request):
    if request.method == "POST":
        Game.objects.create(
            attacker_card=request.POST['attacker_card'],
            attacker=request.user,
            defender=request.POST['user']
        )
        redirect('games:game_list')

    random_num = []
    for i in range(5):
        num = random.randint(1, 10)
        random_num.append(num)
    users = User.objects.exclude(id=request.user.id)
    context = {'users': users, 'random_num': random_num}
    return render(request, 'game_start.html', context)


@login_required
def game_defender(request, pk):
    if request.method == "POST":
        game = Game.objects.get(id=pk)
        randint = random.randint(1, 2)
        if randint == 2:
            if game.attacker_card > request.POST.get('defender_card'):
                winuser = User.objects.get(id=game.attacker)
                loseuser = User.objects.get(id=game.defender)
                winuser.point = winuser.point + game.attacker_card
                loseuser.point = loseuser.point - request.POST.get('defender_card')

                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    winner_point=winuser.point,
                    loseuser_point=loseuser.point,
                    message='숫자가 큰사람이 이깁니다.'
                )


            elif game.attacker_card < request.POST.get('defender_card'):
                loseuser = User.objects.get(id=game.attacker)
                winuser = User.objects.get(id=game.defender)
                winuser.point = winuser.point + request.POST.get('defender_card')
                loseuser.point = loseuser.point - game.attacker_card
                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    winner_point=winuser.point,
                    loseuser_point=loseuser.point,
                    message='숫자가 큰사람이 이깁니다.'
                )

            else:
                winuser = User.objects.get(id=game.attacker)
                loseuser = User.objects.get(id=game.defender)
                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    message='숫자가 큰사람이 이깁니다.',
                    result=True

                )
        elif randint == 1:
            if game.attacker_card < request.POST.get('defender_card'):
                winuser = User.objects.get(id=game.attacker)
                loseuser = User.objects.get(id=game.defender)
                winuser.point = winuser.point + game.attacker_card
                loseuser.point = loseuser.point - request.POST.get('defender_card')

                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    winner_point=winuser.point,
                    loseuser_point=loseuser.point,
                    message='숫자가 작은사람이 이깁니다.'
                )


            elif game.attacker_card > request.POST.get('defender_card'):
                loseuser = User.objects.get(id=game.attacker)
                winuser = User.objects.get(id=game.defender)
                winuser.point = winuser.point + request.POST.get('defender_card')
                loseuser.point = loseuser.point - game.attacker_card
                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    winner_point=winuser.point,
                    loseuser_point=loseuser.point,
                    message='숫자가 작은사람이 이깁니다.'
                )

            else:
                winuser = User.objects.get(id=game.attacker)
                loseuser = User.objects.get(id=game.defender)
                Game_Result.objects.create(
                    game=pk,
                    winner=winuser,
                    loser=loseuser,
                    message='숫자가 작은사람이 이깁니다.',
                    result=True

                )

        game.defender_card = request.POST.get('defender_card')
        game.completed = True
        game.save()
        redirect('games:game_detail', pk)

    random_num = []
    for i in range(5):
        num = random.randint(1, 10)
        random_num.append(num)
    context = {'random_num': random_num, 'pk': pk}
    return render(request, 'counter_attack.html', context)


@login_required
def game_detail(request, pk):
    user = request.user
    game = Game.objects.get(pk=pk)
    game_result = Game_Result.objects.get(game=pk)
    text = ''
    score = ''
    if game_result.winner == user and not game_result.result:
        text = '승리'
        score = game_result.winner_point
    elif game_result.loser == user and not game_result.result:
        text = '패배'
        score_lo = game_result.loser_points
        score = -score_lo
    elif game_result.result:
        text = '무승부'
        score = 0

    context = {'game': game, 'result': game_result, 'text': text, 'score': score, 'user': user}
    return render(request, 'game_detail.html', context)


@login_required
def game_rank(request):
    user = User.objects.all().order_by('-points')
    context = {'user': user}
    return render(request, 'ranking.html', context)


@login_required
def game_delete(request, pk):
    if request.method == "POST":
        Game.objects.get(id=pk).delete()
