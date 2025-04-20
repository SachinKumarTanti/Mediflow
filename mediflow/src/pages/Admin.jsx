import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUserMd, FaUserNurse, FaUserTie, FaUserInjured,
  FaPills, FaFlask, FaBed, FaDollarSign, FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';

export default function Admin() {
  const [admittedPatients, setAdmittedPatients] = useState(0);
  const [medicineCount, setMedicineCount] = useState(0);
  const navigate = useNavigate();
  const TOTAL_BEDS = 100;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/patients/count/')
      .then(res => setAdmittedPatients(res.data.count))
      .catch(err => console.error("Error fetching admitted patients count", err));

    axios.get('http://127.0.0.1:8000/api/medicines/')
      .then(res => setMedicineCount(res.data.count))
      .catch(err => console.error("Error fetching medicine count", err));
  }, []);

  const cardData = [
    { title: 'DOCTORS', count: 5, icon: <FaUserMd />, color: 'bg-cyan-500', link: '/underconstruction' },
    { title: 'NURSE', count: 5, icon: <FaUserNurse />, color: 'bg-red-500', link: '/underconstruction' },
    { title: 'PHARMACIST', count: 5, icon: <FaPills />, color: 'bg-green-600', link: '/underconstruction' },
    { title: 'LABORATORIST', count: 5, icon: <FaFlask />, color: 'bg-yellow-500', link: '/underconstruction' },
    { title: 'ACCOUNTANT', count: 5, icon: <FaDollarSign />, color: 'bg-blue-500', link: '/underconstruction' },
    { title: 'PATIENTS', count: admittedPatients, icon: <FaUserInjured />, color: 'bg-amber-500', link: '/patientqueue' },
    { title: 'MEDICINES', count: medicineCount, icon: <FaPills />, color: 'bg-green-600', link: '/medicinestore' },
    { title: 'BEDS', count: TOTAL_BEDS - admittedPatients, icon: <FaBed />, color: 'bg-blue-600', link: '/underconstruction' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate('/');
  };

  return (
    <div className="flex bg-gradient-to-r from-gray-100 to-gray-200 min-h-screen font-sans">
      <main className="flex-1 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardData.map(({ title, count, icon, color, link }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link to={link} className="block bg-white rounded-2xl shadow-lg p-5 transition-transform duration-300">
                <div className="flex items-center">
                  <div className={`w-14 h-14 flex items-center justify-center text-white text-2xl rounded-xl ${color}`}>
                    {icon}
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-semibold text-gray-600 uppercase">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Add Patient Button */}
        <div className="mt-12 text-center">
          <Link to="/addpatient">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-full shadow-md transition-all"
            >
              + Add New Patient
            </motion.button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          © 2025 HMS PRO • Version 1.0.0
        </footer>
      </main>
    </div>
  );
}
