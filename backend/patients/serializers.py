# patients/serializers.py
from rest_framework import serializers
from .models import Patient,DeletedPatient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id','name', 'problem', 'heart_rate', 'bp_sys', 'bp_dia', 'temp', 'spo2', 'opd', 'urgency']

class DeletedPatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeletedPatient
        fields = '__all__'

from rest_framework import serializers
from .models import Medicine

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
