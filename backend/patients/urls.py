from django.urls import path
from .views import MedicineListCreateView, MedicineDetailView
from .views import PatientList, AddPatient, DeletePatientView, PatientCountView, PatientDetailView
urlpatterns = [
    path('patients/', PatientList.as_view(), name='patient-list'),
    path('add_patient/', AddPatient.as_view(), name='add-patient'),
    path('patients/delete/<int:pk>/', DeletePatientView.as_view(), name='deleted-patient-list'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/count/', PatientCountView.as_view(), name='patient-count'),
    path('medicines/', MedicineListCreateView.as_view(), name='medicine-list-create'),
    path('medicines/<int:pk>/', MedicineDetailView.as_view(), name='medicine-detail'),
]