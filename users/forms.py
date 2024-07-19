# users/forms.py
from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User

class UserCreateForm(forms.ModelForm):
    password1 = forms.CharField(label='비밀번호', widget=forms.PasswordInput)
    password2 = forms.CharField(label='비밀번호 확인', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
        labels = {
            'username':'사용자 이름','email':'이메일',
        }

    def clean_password2(self):
        password1 = self.cleaned_data.get('password1')
        password2 = self.cleaned_data.get('password2')
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

class LoginForm(AuthenticationForm):
    username = forms.CharField(label='사용자 이름')
    password = forms.CharField(label='비밀번호', widget=forms.PasswordInput)