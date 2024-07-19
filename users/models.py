from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    name = models.CharField(max_length=10, null=True)
    email = models.EmailField(unique=True, null=True, blank=True)  # 이메일을 선택적 필드로 설정
    points = models.IntegerField(default=0)  # 사용자 점수


