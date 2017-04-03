from __future__ import unicode_literals

from django.db import models


class PuzzleCompletionDetail(models.Model):
    player_name = models.CharField(max_length=50)
    completion_time_in_seconds = models.IntegerField()
    moves_count = models.IntegerField()
    date_created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['completion_time_in_seconds', 'moves_count', '-date_created']
