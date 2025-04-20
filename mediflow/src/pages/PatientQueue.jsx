import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PatientQueue() {
  const [patients, setPatients] = useState([]);
  const [opds, setOpds] = useState([]);
  const [selectedOpd, setSelectedOpd] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/patients/');
        const sortedPatients = response.data.sort((a, b) => b.urgency - a.urgency);
        setPatients(sortedPatients);

        // Extract unique OPDs
        const opdList = [...new Set(response.data.map((patient) => patient.opd))];
        setOpds(opdList);

        // Set the first OPD as the default selected OPD
        if (opdList.length > 0) {
          setSelectedOpd(opdList[0]);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatients();
  }, []);

  const deletePatient = async (id, name) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete patient ${name}?`);
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/patients/delete/${id}/`);
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
        toast.success(`${name} has been deleted successfully!`, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      } catch (error) {
        console.error('Error deleting patient:', error);
        toast.error('Error deleting patient. Please try again!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
      }
    }
  };

  const groupPatientsByOPD = () => {
    return patients.reduce((groups, patient) => {
      const opd = patient.opd || 'Unknown';
      if (!groups[opd]) {
        groups[opd] = [];
      }
      groups[opd].push(patient);
      return groups;
    }, {});
  };

  const groupedPatients = groupPatientsByOPD();

  // Function to handle selecting an OPD
  const handleOpdClick = (opd) => {
    setSelectedOpd(opd);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gradient-to-b from-blue-500 to-indigo-600 h-screen text-white shadow-lg rounded-r-xl">
        <h2 className="text-3xl font-bold text-center mb-6">OPD List</h2>
        <ul className="space-y-4">
          {opds.map((opd) => (
            <li key={opd}>
              <button
                onClick={() => handleOpdClick(opd)}
                className={`w-full text-lg py-3 px-4 rounded-lg text-left transition-all duration-300 transform ${
                  selectedOpd === opd
                    ? 'bg-indigo-800 text-white font-semibold'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {opd}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Patient Queue for selected OPD */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Patient Queue</h2>

        {selectedOpd ? (
          <div className="opd-queue mb-8 shadow-lg rounded-lg p-4 bg-white">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">{selectedOpd} Queue</h3>
            <table className="w-full table-auto border-collapse shadow-md">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-2 text-center">#</th>
                  <th className="py-3 px-2 text-left">Name</th>
                  <th className="py-3 px-2 text-left">Problem</th>
                  <th className="py-3 px-2 text-center">Urgency</th>
                  <th className="py-3 px-2 text-center">Wait Time</th>
                  <th className="py-3 px-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {groupedPatients[selectedOpd]?.map((patient, index) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="py-3 px-2 text-center">{index + 1}</td>
                    <td className="py-3 px-2">{patient.name}</td>
                    <td className="py-3 px-2">{patient.problem}</td>
                    <td className="py-3 px-2 text-center">{patient.urgency}</td>
                    <td className="py-3 px-2 text-center">{index * 15} min</td>
                    <td className="py-3 px-2 text-center">
                      <button
                        onClick={() => deletePatient(patient.id, patient.name)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">Select an OPD from the sidebar to view the queue.</p>
        )}
      </div>
    </div>
  );
}
