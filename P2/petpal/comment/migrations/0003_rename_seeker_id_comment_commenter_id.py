# Generated by Django 4.2.7 on 2023-11-11 23:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('comment', '0002_alter_comment_seeker_id_alter_comment_shelter_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='comment',
            old_name='seeker_id',
            new_name='commenter_id',
        ),
    ]
