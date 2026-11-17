from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    CurrentUserView,
    CategoryListView,
    TransactionListCreateView,
    TransactionDetailView,
    DashboardSummaryView,
    DashboardOverviewView,
    DashboardCategorySpendingView,
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),

    # Category endpoints
    path('categories/', CategoryListView.as_view(), name='category_list'),

    # Transaction endpoints
    path('transactions/', TransactionListCreateView.as_view(), name='transaction_list_create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction_detail'),

    # Dashboard endpoints
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard_summary'),
    path('dashboard/overview/', DashboardOverviewView.as_view(), name='dashboard_overview'),
    path('dashboard/category-spending/', DashboardCategorySpendingView.as_view(), name='dashboard_category_spending'),
]
