from django.views.generic.base import TemplateView
from rest_framework.generics import ListCreateAPIView

from .models import PuzzleCompletionDetail
from .serializers import PuzzleCompletionDetailSerializer


class IndexTemplateView(TemplateView):
    template_name = 'puzzle/index.html'


class TopScoresTemplateView(TemplateView):
    template_name = 'puzzle/top-scores.html'

    def get_context_data(self, **kwargs):
        context = super(TopScoresTemplateView, self).get_context_data(**kwargs)
        context['completion_times'] = PuzzleCompletionDetail.objects.all()[:10]
        return context


class PuzzleCompletionAPIView(ListCreateAPIView):
    serializer_class = PuzzleCompletionDetailSerializer

    def get_queryset(self):
        return PuzzleCompletionDetail.objects.all()[:10]
