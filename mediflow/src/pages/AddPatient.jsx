import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddPatient() {
  const [formData, setFormData] = useState({
    name: '',
    problem: '',
    heartRate: '',
    bpSys: '',
    bpDia: '',
    temp: '',
    spo2: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/add_patient/', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 201) navigate('/patientqueue');
      else alert(`Error: ${response.data.error || 'Unknown error occurred'}`);
    } catch (error) {
      alert(`Error submitting form: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-white/30 border border-white/40 shadow-2xl rounded-2xl p-10 w-full max-w-2xl transition-all duration-500 hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold text-center text-white drop-shadow mb-8">
          🩺 Add New Patient
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['name', 'problem', 'heartRate', 'bpSys', 'bpDia', 'temp', 'spo2'].map((field) => (
            <div key={field}>
              <label className="block text-white font-medium mb-1 capitalize tracking-wide">
                {field.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/60 text-black border border-white/70 placeholder-gray-500 focus:ring-4 focus:ring-blue-400 outline-none transition duration-300"
                placeholder={`Enter ${field}`}
                required
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl shadow-lg font-semibold text-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition duration-300"
        >
          🚀 Submit
        </button>
      </form>
    </div>
  );
}
