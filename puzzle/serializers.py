from rest_framework import serializers

from .models import PuzzleCompletionDetail


class PuzzleCompletionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PuzzleCompletionDetail
        fields = '__all__'
