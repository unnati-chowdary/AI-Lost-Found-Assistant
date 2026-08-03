import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import { FileText, MapPin, Calendar, Tag, Upload, ArrowRight, CheckCircle2 } from 'lucide-react';

const ReportFoundPage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('type', 'FOUND');
      formData.append('name', name);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('location', location);
      if (image) {
        formData.append('image', image);
      }

      await itemsAPI.createItem(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Report a Found Item</h1>
            <p className="text-slate-500 text-sm">Help return a lost item to its rightful owner.</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Item Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Headphones"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                <option value="Electronics">Electronics</option>
                <option value="ID & Cards">ID & Cards</option>
                <option value="Keys & Bags">Keys & Bags</option>
                <option value="Clothing & Accessories">Clothing & Accessories</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Detailed Description *</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe color, brand, markings, condition, or location details..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Date Found *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Found Location *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Student Center Food Court"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Item Photo (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-emerald-400 transition-colors">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-cover" />
                    <p className="text-xs text-slate-500">{image.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-10 w-10 text-slate-400" />
                    <div className="flex text-sm text-slate-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-semibold text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                        <span>Upload a photo</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-400">PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center space-x-2"
          >
            {loading ? <span>Submitting Report...</span> : (
              <>
                <span>Submit Found Item Report</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportFoundPage;
