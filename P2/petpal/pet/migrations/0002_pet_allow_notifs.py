# Generated by Django 4.2.7 on 2023-11-15 21:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pet', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pet',
            name='allow_notifs',
            field=models.BooleanField(default=True),
        ),
    ]
