from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tracker.urls')),

    # Serve built frontend static assets (JS, CSS, SVGs, etc.)
    re_path(
        r'^assets/(?P<path>.*)$',
        serve,
        {'document_root': settings.FRONTEND_DIR / 'assets'}
    ),

    # Serve root assets like favicon.svg or logo files
    re_path(
        r'^(?P<path>[^/]+\.(?:svg|ico|png|jpg|jpeg|json|txt))$',
        serve,
        {'document_root': settings.FRONTEND_DIR}
    ),

    # Serve React SPA index.html for all frontend routes
    re_path(
        r'^(?!api|admin).*$',
        TemplateView.as_view(template_name='index.html')
    ),
]
