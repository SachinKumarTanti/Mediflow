import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicineStock = () => {
  const [medicineStock, setMedicineStock] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', expiry_date: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchMedicines = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/medicines/');
      setMedicineStock(res.data.data);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Failed to fetch medicines.' });
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/medicines/', form);
      setMedicineStock([...medicineStock, res.data]);
      setForm({ name: '', quantity: '', expiry_date: '' });
      setMessage({ type: 'success', text: 'Medicine added successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding medicine.' });
    }
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const updateQuantity = async (id, isRestock = true) => {
    const input = prompt(`Enter quantity to ${isRestock ? "restock" : "issue"}:`);
    const quantity = parseInt(input);
    if (!input || isNaN(quantity) || quantity <= 0) return alert("Invalid quantity");

    const med = medicineStock.find(m => m.id === id);
    const updatedQuantity = isRestock ? med.quantity + quantity : Math.max(0, med.quantity - quantity);

    try {
      const res = await axios.patch(`http://127.0.0.1:8000/api/medicines/${id}/`, { quantity: updatedQuantity });
      setMedicineStock(medicineStock.map(m => (m.id === id ? res.data : m)));
    } catch (err) {
      alert("Update failed.");
    }
  };

  const removeMedicine = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/medicines/${id}/`);
      setMedicineStock(medicineStock.filter(m => m.id !== id));
    } catch (err) {
      alert("Delete failed.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('https://img.freepik.com/free-vector/medical-healthcare-blue-color_1017-26807.jpg')" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-700">🧴 Medicine Stock Manager</h2>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            ← Back
          </button>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAdd} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" name="name" placeholder="Medicine Name" value={form.name} onChange={handleChange} className="p-2 border rounded" required />
          <input type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} className="p-2 border rounded" required min="1" />
          <input type="date" name="expiry_date" value={form.expiry_date} onChange={handleChange} className="p-2 border rounded" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
        </form>

        <table className="table-auto w-full border border-gray-300 shadow-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Quantity</th>
              <th className="border px-4 py-2">Expiry</th>
              <th className="border px-4 py-2">Stock Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicineStock.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{med.name}</td>
                <td className="border px-4 py-2">{med.quantity}</td>
                <td className="border px-4 py-2">{med.expiry_date}</td>
                <td className="border px-4 py-2">
                  {med.quantity < 100 ? (
                    <span className="text-red-600 font-semibold">Low Stock</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Sufficient</span>
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => updateQuantity(med.id, true)} className="bg-green-500 text-white px-2 py-1 rounded">+ Restock</button>
                  <button onClick={() => updateQuantity(med.id, false)} className="bg-yellow-500 text-white px-2 py-1 rounded">- Issue</button>
                  <button onClick={() => removeMedicine(med.id)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                </td>
              </tr>
            ))}
            {medicineStock.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No medicines in stock.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicineStock;
