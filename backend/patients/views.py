# patients/views.py
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Patient, DeletedPatient
from django.utils import timezone
from .serializers import PatientSerializer
from .serializers import DeletedPatientSerializer
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import nltk
from rest_framework.decorators import api_view
from rest_framework import generics
from .models import Medicine
from .serializers import MedicineSerializer

nltk.download('stopwords')
nltk.download('wordnet')

# Initialize models as before...

# Text model is already defined above.

# Vitals model for urgency prediction
# New input data in the format: heart_rate, bp_sys, bp_dia, temp, spo2, urgency
input_data = [
    [111, 94, 119, 98.1, 97, 9],
    [74, 179, 118, 98.0, 91, 7],
    [120, 103, 95, 103.8, 99, 4],
    [80, 116, 78, 99.1, 89, 10],
    [83, 98, 85, 103.1, 90, 5],
    [111, 94, 119, 98.1, 97, 9],
    [74, 179, 118, 98.0, 91, 7],
    [120, 103, 95, 103.8, 99, 4],
    [80, 116, 78, 99.1, 89, 10],
    [83, 98, 85, 103.1, 90, 5],
    [62, 168, 62, 101.0, 97, 2],
    [81, 104, 78, 102.4, 91, 8],
    [112, 179, 79, 100.0, 87, 4],
    [61, 131, 91, 100.6, 96, 9],
    [89, 166, 66, 99.9, 94, 5],
    [97, 140, 111, 97.6, 87, 9],
    [61, 152, 100, 101.8, 89, 4],
    [123, 141, 92, 98.2, 90, 10],
    [119, 93, 99, 96.2, 93, 5],
    [80, 112, 98, 101.2, 97, 9],
    [92, 104, 77, 97.4, 98, 8],
    [117, 132, 99, 103.5, 96, 3],
    [81, 118, 60, 103.6, 89, 1],
    [108, 125, 70, 103.3, 99, 3],
    [118, 102, 87, 99.0, 85, 4],
    [101, 121, 116, 96.1, 98, 2],
    [119, 160, 84, 103.4, 98, 1],
    [74, 148, 109, 99.4, 98, 7],
    [121, 175, 82, 103.7, 88, 8],
    [121, 117, 90, 103.7, 89, 7],
    [106, 155, 89, 102.8, 96, 5],
    [121, 131, 101, 98.4, 94, 1],
    [110, 134, 94, 99.1, 94, 7],
    [114, 151, 66, 102.8, 89, 7],
    [123, 146, 119, 98.5, 91, 9],
    [62, 95, 75, 97.4, 88, 3],
    [110, 117, 85, 100.5, 85, 9],
    [66, 117, 107, 103.5, 98, 1],
    [80, 133, 116, 101.6, 98, 1],
    [98, 173, 111, 100.6, 89, 4],
    [77, 119, 119, 96.8, 91, 9],
    [63, 151, 108, 100.9, 94, 6],
    [119, 164, 61, 103.9, 94, 3],
    [73, 178, 60, 97.1, 90, 1],
    [68, 151, 107, 100.1, 89, 4],
    [112, 90, 71, 103.0, 88, 9],
    [61, 116, 64, 101.9, 86, 3],
    [119, 151, 96, 101.6, 88, 9],
    [103, 166, 91, 101.6, 99, 7],
    [67, 92, 118, 98.9, 94, 4],
    [106, 159, 114, 98.3, 94, 3],
    [94, 161, 68, 102.5, 87, 10],
    [95, 116, 100, 102.5, 94, 5],
    [109, 98, 94, 102.9, 85, 5],
    [63, 151, 78, 103.3, 92, 3],
    [61, 126, 107, 100.1, 89, 9],
    [65, 140, 75, 100.0, 97, 4],
    [113, 133, 62, 102.4, 88, 5],
    [63, 113, 79, 101.2, 92, 4],
    [113, 168, 83, 101.6, 91, 5],
    [122, 148, 113, 102.4, 86, 7],
    [77, 121, 115, 103.1, 85, 9],
    [103, 177, 92, 98.7, 96, 7],
    [93, 141, 83, 99.0, 95, 5],
    [121, 151, 111, 96.8, 88, 10],
    [73, 147, 70, 100.6, 92, 10],
    [107, 141, 108, 96.3, 96, 7],
    [74, 101, 67, 99.7, 86, 10],
    [121, 128, 95, 100.3, 87, 5],
    [99, 91, 97, 98.3, 96, 3],
    [112, 92, 99, 100.7, 85, 7],
    [83, 145, 79, 96.2, 85, 2],
    [85, 170, 94, 96.3, 97, 9],
    [119, 148, 107, 102.6, 87, 10],
    [100, 91, 84, 98.9, 95, 10],
    [88, 91, 94, 97.0, 89, 1],
    [74, 143, 84, 100.2, 96, 6],
    [104, 176, 88, 102.2, 87, 7],
    [124, 90, 77, 97.7, 85, 8],
    [68, 108, 105, 101.0, 85, 10],
    [60, 91, 77, 96.7, 92, 9],
    [67, 142, 61, 96.4, 94, 2],
    [122, 133, 113, 100.3, 95, 10],
    [70, 179, 94, 100.3, 96, 2],
    [67, 121, 75, 101.1, 97, 5],
    [94, 159, 100, 101.8, 97, 5],
    [94, 121, 95, 103.8, 96, 6],
    [92, 157, 92, 100.1, 99, 3],
    [64, 144, 63, 98.6, 98, 8],
    [100, 164, 92, 102.4, 86, 1],
    [87, 145, 73, 98.2, 97, 6],
    [66, 106, 80, 99.5, 87, 4],
    [71, 127, 107, 96.6, 86, 1],
    [93, 113, 79, 96.2, 87, 7],
    [92, 158, 115, 103.7, 91, 9],
    [107, 159, 67, 102.7, 85, 4],
    [82, 175, 66, 101.6, 94, 4],
    [121, 100, 62, 99.3, 92, 6],
    [96, 105, 76, 97.4, 97, 3],
    [103, 162, 92, 97.3, 94, 6],
    [94, 148, 107, 98.0, 94, 7],
    [124, 159, 71, 100.4, 94, 10],
    [106, 169, 118, 101.7, 98, 10],
    [62, 92, 110, 101.3, 86, 3],
    [60, 109, 81, 98.2, 87, 7]
]

# Convert the input data to a DataFrame
columns = ['heart_rate', 'bp_sys', 'bp_dia', 'temp', 'spo2', 'urgency']
input_df = pd.DataFrame(input_data, columns=columns)

# Extract features and target variable
X_vitals = input_df[['heart_rate', 'bp_sys', 'bp_dia', 'temp', 'spo2']]
y_vitals = input_df['urgency']

# Initialize and train the RandomForest model
vitals_model = RandomForestClassifier(n_estimators=100, random_state=42)
vitals_model.fit(X_vitals, y_vitals)

# Lemmatizer class to handle text preprocessing
class Lemmatizer:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def preprocess(self, text):
        words = text.lower().split()
        words = [self.lemmatizer.lemmatize(word) for word in words if word not in self.stop_words]
        return " ".join(words)

lemmatizer = Lemmatizer()

# Text model for OPD prediction
text_model = Pipeline([
    ('preprocessor', TfidfVectorizer(preprocessor=lemmatizer.preprocess, stop_words='english')),
    ('clf', LogisticRegression(max_iter=1000))
])

# Sample data for the text model
text_data = {
    'Problem': [
        # Cardiology (10)
        'chest pain and shortness of breath',
        'rapid heartbeat and chest discomfort',
        'dizziness and chest tightness',
        'swelling in legs and fatigue',
        'high blood pressure and chest pain',
        'shortness of breath with exertion',
        'palpitations and chest discomfort',
        'chest pain with cold sweats',
        'fainting with irregular heartbeat',
        'tightness in chest and breathlessness',

        # Neurology (10)
        'frequent headaches and nausea',
        'sudden numbness in limbs',
        'seizures and memory loss',
        'chronic migraines and dizziness',
        'tingling in hands and feet',
        'difficulty concentrating and confusion',
        'muscle weakness and tremors',
        'blurry vision and loss of coordination',
        'sudden vision loss and speech difficulty',
        'confusion and blackouts',

        # Dermatology (10)
        'itchy red rash on skin',
        'dry scaly patches on arms',
        'blistering rash on face',
        'sudden hair loss and dandruff',
        'hives and skin swelling',
        'eczema with severe itching',
        'skin discoloration and spots',
        'cracked skin and bleeding',
        'persistent acne and oily skin',
        'fungal infection between toes',

        # Gastroenterology (10)
        'abdominal pain and diarrhea',
        'vomiting and stomach cramps',
        'constipation and bloating',
        'acid reflux and heartburn',
        'blood in stool and fatigue',
        'gas and abdominal discomfort',
        'nausea and loss of appetite',
        'jaundice and abdominal pain',
        'pain after eating fatty food',
        'persistent indigestion and burping',

        # ENT (10)
        'sore throat and cough',
        'ear pain and difficulty hearing',
        'nasal congestion and sneezing',
        'hoarseness and voice loss',
        'runny nose and sinus pain',
        'hearing loss and ringing ears',
        'swelling in throat and pain swallowing',
        'chronic sinus infection and headache',
        'blocked ear and dizziness',
        'frequent throat infections',

        # Ophthalmology (10)
        'blurry vision and headaches',
        'dry eyes and irritation',
        'sensitivity to light and eye strain',
        'itchy eyes and redness',
        'pain behind eyes and blurred sight',
        'double vision and nausea',
        'difficulty focusing on near objects',
        'watery eyes and blurred vision',
        'eye pain and discharge',
        'sudden loss of vision in one eye',

        # Orthopedics (10)
        'joint pain and stiffness',
        'back pain and difficulty walking',
        'knee pain and swelling',
        'neck pain and restricted movement',
        'shoulder pain while lifting arm',
        'swelling and pain in ankle',
        'pain in hips and difficulty standing',
        'fracture and limb pain',
        'elbow pain and stiffness',
        'joint locking and instability',

        # Urology (10)
        'painful urination and frequent urge',
        'blood in urine and lower back pain',
        'difficulty urinating and burning sensation',
        'urinary incontinence and urgency',
        'swollen testicles and groin pain',
        'kidney stone and sharp pain',
        'cloudy urine and ',
        'bladder pain and pressure',
        'lower abdominal pain and urination issues',
        'frequent urination at night',

        # Endocrinology (10)
        'fatigue and unexplained weight gain',
        'increased thirst and frequent urination',
        'irregular menstrual cycle',
        'excessive sweating and hunger',
        'hair thinning and cold intolerance',
        'high blood sugar and tiredness',
        'goiter and difficulty swallowing',
        'sudden weight loss and anxiety',
        'irritability and sleep issues',
        'slow metabolism and constipation',

        # Dentistry (10)
        'toothache and swollen gums',
        'bleeding gums while brushing',
        'bad breath and mouth ulcers',
        'sensitivity to hot and cold drinks',
        'cavity and pain while eating',
        'jaw pain and clicking sound',
        'loose tooth and bleeding',
        'pain while chewing food',
        'broken tooth and sharp pain',
        'gum infection and swelling'

    #general
        'Persistent fever and intermittent chills.',
        'Diffuse body aches and muscle soreness.',
        'Dull headache lasting for several days.',
        'Constant fatigue and lack of energy.',
        'Frequent episodes of dizziness.',
        'Nausea accompanied by occasional vomiting.',
        'Noticeable loss of appetite.',
        'Mild abdominal discomfort without localized pain.',
        'Generalized body swelling (edema).',
        'Mild sore throat and dry cough without breathing difficulty.'
    ],
    'OPD': [
        'Cardiology', 'Cardiology', 'Cardiology', 'Cardiology', 'Cardiology',
        'Cardiology', 'Cardiology', 'Cardiology', 'Cardiology', 'Cardiology',

        'Neurology', 'Neurology', 'Neurology', 'Neurology', 'Neurology',
        'Neurology', 'Neurology', 'Neurology', 'Neurology', 'Neurology',

        'Dermatology', 'Dermatology', 'Dermatology', 'Dermatology', 'Dermatology',
        'Dermatology', 'Dermatology', 'Dermatology', 'Dermatology', 'Dermatology',

        'Gastroenterology', 'Gastroenterology', 'Gastroenterology', 'Gastroenterology', 'Gastroenterology',
        'Gastroenterology', 'Gastroenterology', 'Gastroenterology', 'Gastroenterology', 'Gastroenterology',

        'ENT', 'ENT', 'ENT', 'ENT', 'ENT',
        'ENT', 'ENT', 'ENT', 'ENT', 'ENT',

        'Ophthalmology', 'Ophthalmology', 'Ophthalmology', 'Ophthalmology', 'Ophthalmology',
        'Ophthalmology', 'Ophthalmology', 'Ophthalmology', 'Ophthalmology', 'Ophthalmology',

        'Orthopedics', 'Orthopedics', 'Orthopedics', 'Orthopedics', 'Orthopedics',
        'Orthopedics', 'Orthopedics', 'Orthopedics', 'Orthopedics', 'Orthopedics',

        'Urology', 'Urology', 'Urology', 'Urology', 'Urology',
        'Urology', 'Urology', 'Urology', 'Urology', 'Urology',

        'Endocrinology', 'Endocrinology', 'Endocrinology', 'Endocrinology', 'Endocrinology',
        'Endocrinology', 'Endocrinology', 'Endocrinology', 'Endocrinology', 'Endocrinology',

        'Dentistry', 'Dentistry', 'Dentistry', 'Dentistry', 'Dentistry',
        'Dentistry', 'Dentistry', 'Dentistry', 'Dentistry', 'Dentistry'
        
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD',
        'General OPD'
    ]
}


text_df = pd.DataFrame(text_data)
text_model.fit(text_df['Problem'], text_df['OPD'])

class PatientList(APIView):
    def get(self, request):
        patients = Patient.objects.all().order_by('-urgency')
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

class AddPatient(APIView):
    def post(self, request):
        data = request.data
        name = data.get('name')
        problem = data.get('problem')
        heart_rate = float(data.get('heartRate'))
        bp_sys = float(data.get('bpSys'))
        bp_dia = float(data.get('bpDia'))
        temp = float(data.get('temp'))
        spo2 = float(data.get('spo2'))

        if not all([name, problem, heart_rate, bp_sys, bp_dia, temp, spo2]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Preprocess the problem description text
        processed_problem = lemmatizer.preprocess(problem)

        # Predict OPD using the text model
        opd_prediction = text_model.predict([processed_problem])[0]

        # Predict Urgency using the vitals model
        urgency_prediction = int(vitals_model.predict([[heart_rate, bp_sys, bp_dia, temp, spo2]])[0])

        new_patient = Patient(name=name, problem=problem, heart_rate=heart_rate, bp_sys=bp_sys,
                             bp_dia=bp_dia, temp=temp, spo2=spo2, opd=opd_prediction, urgency=urgency_prediction)

        new_patient.save()

        # Serialize the new patient and return the response
        serializer = PatientSerializer(new_patient)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class DeletePatientView(APIView):
    def delete(self,request, pk):
        try:
            patient = Patient.objects.get(id=pk)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Archive to DeletedPatient
        DeletedPatient.objects.create(
            name=patient.name,
            urgency=patient.urgency,
            deleted_at=timezone.now(),
            heart_rate=patient.heart_rate,
            bp_sys=patient.bp_sys,
            bp_dia=patient.bp_dia,
            temp=patient.temp,
            spo2=patient.spo2,
            problem=patient.problem,
            opd=patient.opd
        )

        # Delete the patient record from the original table
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PatientCountView(APIView):
    def get(self, request):
        count = Patient.objects.count()
        return Response({"count": count}, status=status.HTTP_200_OK)

class PatientDetailView(APIView):
    def get(self, request, pk):
        try:
            patient = Patient.objects.get(id=pk)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# List all medicines and create a new one
class MedicineListCreateView(generics.ListCreateAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "count": queryset.count(),
            "data": serializer.data
        })
# Retrieve, update, or delete a specific medicine
class MedicineDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer