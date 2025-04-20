import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaStethoscope, FaUserMd, FaHospital } from "react-icons/fa";
import { motion } from "framer-motion";  // Framer Motion import
import axios from "axios";

const HomePage = () => {
  const [admittedPatients, setAdmittedPatients] = useState(0);
  const TOTAL_BEDS = 100;
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/patients/count/')
      .then(res => setAdmittedPatients(res.data.count))
      .catch(err => console.error("Error fetching admitted patients count", err));

  }, []);
  // Function to handle scroll when clicking on navbar links
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586773860418-d37222d8fce3')` }}>
      {/* Navbar */}
      <header className="bg-white bg-opacity-80 shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">MTS Hospital</h1>
          <ul className="flex space-x-6 text-blue-800 font-semibold">
            <li><button onClick={() => scrollToSection('about')}>About</button></li>
            <li><button onClick={() => scrollToSection('services')}>Services</button></li>
            <li><button onClick={() => scrollToSection('resources')}>Resources</button></li>
            <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
            <li><Link to="/login">Admin Login</Link></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center text-white py-40 px-4 min-h-130" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <h2 className="text-5xl font-bold mb-6">Your Health, Our Priority</h2>
        <p className="text-xl">Quality care with compassion and dedication</p>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="bg-white py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">About Us</h2>
          <p className="text-gray-700 text-lg">MTS Hospital is committed to providing top-notch medical services with state-of-the-art facilities and experienced staff. Our mission is to ensure every patient receives the care they deserve in a comfortable and safe environment.</p>
        </div>
      </section>

      {/* Services Section */}
      <motion.section
        id="services"
        className="bg-gray-100 py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FaStethoscope className="text-blue-800 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">General Checkups</h3>
              <p className="text-gray-600">Routine health exams to keep you in peak condition.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FaUserMd className="text-blue-800 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Specialist Care</h3>
              <p className="text-gray-600">Expert consultations across all medical disciplines.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <FaHospital className="text-blue-800 text-5xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">24/7 Emergency</h3>
              <p className="text-gray-600">Immediate and responsive care around the clock.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Resources Section */}
      <motion.section
        id="resources"
        className="bg-white py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-12">Hospital Resources</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">{admittedPatients}</h3>
              <p className="text-gray-700">Admitted Patients</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">{TOTAL_BEDS}</h3>
              <p className="text-gray-700">Total Beds</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">{TOTAL_BEDS-admittedPatients}</h3>
              <p className="text-gray-700">Available Beds</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">15</h3>
              <p className="text-gray-700">Available Doctors</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">5</h3>
              <p className="text-gray-700">Ambulance</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl shadow">
              <h3 className="text-2xl font-bold text-blue-800">10</h3>
              <p className="text-gray-700">OPDS</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="bg-white py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold text-blue-800 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-6">Reach out for inquiries, emergencies, or appointments.</p>
          <p className="text-lg">📍 IIT GUWAHATI</p>
          <p className="text-lg">📞 +91 7488312801</p>
          <p className="text-lg">📧 sayan.mandal@iitg.ac.in</p>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
