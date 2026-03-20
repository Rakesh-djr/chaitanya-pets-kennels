import React, { useState, useEffect } from 'react';
import { galleryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['General', 'Puppies', 'Dogs', 'Cats', 'Events', 'Facilities'];
const PLACEHOLDER = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=60';

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ category: 'General', caption: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filterCat, setFilterCat] = useState('All');

  const fetchImages = () => {
    setLoading(true);
    galleryAPI.getAll()
      .then(res => setImages(res.data.images))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchImages(); }, []);

  const handleFile = e => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) { toast.error('Please select an image'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('category', form.category);
      fd.append('caption', form.caption);
      await galleryAPI.upload(fd);
      toast.success('Image uploaded! 📸');
      setFile(null);
      setPreview(null);
      setForm({ category: 'General', caption: '' });
      fetchImages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await galleryAPI.delete(id);
      toast.success('Image deleted');
      setImages(prev => prev.filter(i => i._id !== id));
      setDeleteId(null);
    } catch { toast.error('Failed to delete'); }
  };

  const getImgUrl = url => url?.startsWith('/') ? `http://localhost:5000${url}` : url;
  const filtered = filterCat === 'All' ? images : images.filter(i => i.category === filterCat);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brown-800 dark:text-amber-100">Gallery Management</h1>
        <p className="text-brown-500 dark:text-amber-400/60 mt-1">{images.length} images in gallery</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload form */}
        <div className="bg-white dark:bg-brown-900 rounded-2xl p-6 border border-amber-100 dark:border-brown-800 shadow-sm">
          <h3 className="font-display font-bold text-lg text-brown-800 dark:text-amber-100 mb-5">📷 Upload Image</h3>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Drop zone */}
            <div
              className="border-2 border-dashed border-amber-300 dark:border-brown-700 rounded-xl p-6 text-center cursor-pointer hover:border-gold-500 transition-colors"
              onClick={() => document.getElementById('gallery-upload').click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div>
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-brown-500 dark:text-amber-400/70 text-sm">Click to upload image</p>
                  <p className="text-xs text-brown-400 dark:text-amber-500/50 mt-1">JPG, PNG, WEBP up to 10MB</p>
                </div>
              )}
              <input id="gallery-upload" type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </div>

            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({...p, category: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all text-sm"
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-brown-600 dark:text-amber-400 uppercase tracking-wider mb-1 block">Caption (optional)</label>
              <input
                type="text"
                placeholder="Image caption"
                value={form.caption}
                onChange={e => setForm(p => ({...p, caption: e.target.value}))}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 bg-amber-50 dark:bg-brown-800 text-brown-800 dark:text-amber-100 focus:outline-none focus:border-gold-500 transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-50 hover:opacity-90 transition-all"
              style={{background: 'linear-gradient(135deg, #d4a017, #b8860b)'}}
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
            </button>
          </form>
        </div>

        {/* Gallery grid */}
        <div className="lg:col-span-2">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['All', ...CATEGORIES].map(cat => (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterCat === cat ? 'text-white shadow' : 'bg-white dark:bg-brown-900 text-brown-600 dark:text-amber-300 border border-amber-200 dark:border-brown-700 hover:border-gold-400'}`}
                style={filterCat === cat ? {background: 'linear-gradient(135deg, #d4a017, #b8860b)'} : {}}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[...Array(9)].map((_, i) => <div key={i} className="skeleton h-40 rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-brown-900 rounded-2xl border border-amber-100 dark:border-brown-800">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-brown-500 dark:text-amber-400/60">No images in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filtered.map(img => (
                <div key={img._id} className="group relative rounded-xl overflow-hidden bg-amber-50 dark:bg-brown-800 border border-amber-100 dark:border-brown-700">
                  <img
                    src={getImgUrl(img.url) || PLACEHOLDER}
                    alt={img.caption}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => e.target.src = PLACEHOLDER}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                    <button
                      onClick={() => setDeleteId(img._id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-lg"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <span className="text-white text-xs font-medium block truncate">{img.caption || img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-brown-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <h3 className="font-display text-xl font-bold text-brown-800 dark:text-amber-100 mb-2">Delete this image?</h3>
            <p className="text-brown-500 dark:text-amber-400/60 mb-6 text-sm">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border-2 border-amber-200 dark:border-brown-700 text-brown-600 dark:text-amber-300 font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
