from django.conf.urls import url

from .views import IndexTemplateView
from .views import TopScoresTemplateView
from .views import PuzzleCompletionAPIView

urlpatterns = [
    url(r'^$', IndexTemplateView.as_view(), name='index'),
    url(r'^top-scores$', TopScoresTemplateView.as_view(), name='top-scores'),
    url(r'^api/puzzle-completion$', PuzzleCompletionAPIView.as_view(), name='api-puzzle-completion'),
]
