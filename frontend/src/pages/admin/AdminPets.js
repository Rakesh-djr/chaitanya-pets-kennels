import React, { useState, useEffect } from 'react';
import { petsAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&q=60';
const EMPTY_FORM = { name: '', breed: '', price: '', description: '', status: 'Available', age: '', gender: 'Unknown', vaccinated: false, features: '' };

function PetForm({ pet, onSave, onCancel }) {
  const [form, setForm] = useState(pet ? {
    ...pet,
    price: pet.price?.toString(),
    features: pet.features?.join(', ') || '',
    vaccinated: pet.vaccinated || false,
  } : EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(pet?.images?.map(i => i.url?.startsWith('/') ? `http://localhost:5000${i.url}` : i.url) || []);
  const [saving, setSaving] = useState(false);

  const handleImages = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.breed || !form.price || !form.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach(k => {
        if (k !== 'images') fd.append(k, form[k]);
      });
      images.forEach(img => fd.append('images', img));
      if (pet?._id) {
        await petsAPI.update(pet._id, fd);
        toast.success('Pet updated successfully! 🐾');
      } else {
        await petsAPI.create(fd);
        toast.success('Pet added successfully! 🐾');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save pet');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-brown-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-amber-100 dark:border-brown-800 my-4">
        <div className="flex items-center justify-between p-6 border-b border-amber-100 dark:border-brown-800">
          <h2 className="font-display text-xl font-bold text-brown-800 dark:text-amber-100">
            {pet ? '✏️ Edit Pet' : '➕ Add New Pet'}
          </h2>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-amber-100 dark:bg-brown-800 flex items-center justify-center text-brown-600 dark:text-amber-300 hover:bg-amber-200 transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Name *</label>
              <input className={inputClass} placeholder="Pet name" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Breed *</label>
              <input className={inputClass} placeholder="e.g. Golden Retriever" value={form.breed} onChange={e => setForm(p => ({...p, breed: e.target.value}))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Price (₹) *</label>
              <input className={inputClass} type="number" placeholder="e.g. 25000" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} />
            </div>
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Age</label>
              <input className={inputClass} placeholder="e.g. 2 months" value={form.age} onChange={e => setForm(p => ({...p, age: e.target.value}))} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Gender</label>
              <select className={inputClass} value={form.gender} onChange={e => setForm(p => ({...p, gender: e.target.value}))}>
                <option>Unknown</option><option>Male</option><option>Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Status</label>
              <select className={inputClass} value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))}>
                <option>Available</option><option>Sold</option>
              </select>
            </div>
            <div className="flex flex-col justify-center">
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-2 block">Vaccinated</label>
              <button type="button" onClick={() => setForm(p => ({...p, vaccinated: !p.vaccinated}))}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${form.vaccinated ? 'bg-green-500' : 'bg-gray-300 dark:bg-brown-700'}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${form.vaccinated ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Description *</label>
            <textarea className={inputClass} rows={3} placeholder="Describe the pet..." value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Features (comma separated)</label>
            <input className={inputClass} placeholder="e.g. KCI Registered, Vaccinated, Dewormed" value={form.features} onChange={e => setForm(p => ({...p, features: e.target.value}))} />
          </div>
          <div>
            <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImages}
              className="w-full text-sm text-brown-600 dark:text-amber-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-100 file:text-brown-700 hover:file:bg-amber-200 dark:file:bg-brown-800 dark:file:text-amber-200 transition-all" />
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((p, i) => (
                  <img key={i} src={p} alt={`preview ${i}`} className="w-16 h-16 object-cover rounded-lg border-2 border-gold-300" onError={e => e.target.src = PLACEHOLDER} />
                ))}
              </div>
            )}
          </div>
        </form>
        <div className="flex gap-3 p-6 border-t border-amber-100 dark:border-brown-800">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 text-brown-600 dark:text-amber-300 font-medium hover:bg-amber-50 dark:hover:bg-brown-800 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 py-2.5 rounded-xl font-bold text-white disabled:opacity-60 transition-all hover:opacity-90"
            style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
            {saving ? '⏳ Saving...' : (pet ? '✅ Update Pet' : '➕ Add Pet')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchPets = () => {
    setLoading(true);
    petsAPI.getAll({ limit: 100 })
      .then(res => setPets(res.data.pets))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPets(); }, []);

  const handleDelete = async id => {
    try {
      await petsAPI.delete(id);
      toast.success('Pet deleted');
      setPets(prev => prev.filter(p => p._id !== id));
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete pet');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingPet(null);
    fetchPets();
  };

  const filtered = pets.filter(pet => {
    const matchSearch = !search || pet.name.toLowerCase().includes(search.toLowerCase()) || pet.breed.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || pet.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const getImgUrl = url => url?.startsWith('/') ? `http://localhost:5000${url}` : url;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">Manage Pets</h1>
          <p className="text-brown-500 dark:text-amber-400/60 mt-1">{pets.length} total pets</p>
        </div>
        <button onClick={() => { setEditingPet(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white shadow hover:shadow-lg transition-all hover:scale-105"
          style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}>
          ➕ Add New Pet
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Search by name or breed..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-white dark:bg-brown-900 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-white dark:bg-brown-900 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all"
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-brown-900 rounded-2xl border border-amber-100 dark:border-brown-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <p className="text-brown-500 dark:text-amber-400/60">No pets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-50 dark:bg-brown-800 border-b border-amber-100 dark:border-brown-700">
                  {['Pet', 'Breed', 'Price', 'Status', 'Added', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50 dark:divide-brown-800">
                {filtered.map(pet => (
                  <tr key={pet._id} className="hover:bg-amber-50/50 dark:hover:bg-brown-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={getImgUrl(pet.images?.[0]?.url) || PLACEHOLDER} alt={pet.name} className="w-10 h-10 rounded-lg object-cover" onError={e => e.target.src = PLACEHOLDER} />
                        <span className="font-medium text-brown-800 dark:text-amber-100">{pet.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brown-600 dark:text-amber-300">{pet.breed}</td>
                    <td className="px-4 py-3 font-bold text-brown-800 dark:text-amber-100">₹{pet.price?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${pet.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {pet.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-brown-500 dark:text-amber-400/60">
                      {new Date(pet.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingPet(pet); setShowForm(true); }}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-brown-800 text-brown-700 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-brown-700 transition-colors text-xs font-medium">
                          ✏️ Edit
                        </button>
                        <button onClick={() => setDeleteId(pet._id)}
                          className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs font-medium">
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pet form modal */}
      {showForm && (
        <PetForm
          pet={editingPet}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingPet(null); }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-brown-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display text-xl font-bold text-brown-800 dark:text-amber-100 mb-2">Delete this pet?</h3>
            <p className="text-brown-500 dark:text-amber-400/60 mb-6 text-sm">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 text-brown-600 dark:text-amber-300 font-medium">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
