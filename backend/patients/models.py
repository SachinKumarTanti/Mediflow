# patients/models.py
from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100)
    problem = models.TextField()
    heart_rate = models.FloatField()
    bp_sys = models.FloatField()
    bp_dia = models.FloatField()
    temp = models.FloatField()
    spo2 = models.FloatField()
    opd = models.CharField(max_length=100)
    urgency = models.IntegerField()

    def __str__(self):
        return self.name

class DeletedPatient(models.Model):
    name = models.CharField(max_length=100)
    problem = models.CharField(max_length=200)
    heart_rate = models.FloatField()
    bp_sys = models.FloatField()
    bp_dia = models.FloatField()
    temp = models.FloatField()
    spo2 = models.FloatField()
    urgency = models.IntegerField()
    opd = models.CharField(max_length=100)
    deleted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    expiry_date = models.DateField()

    def __str__(self):
        return self.name