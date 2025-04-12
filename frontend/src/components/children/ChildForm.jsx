import React, { useState, useEffect } from 'react';
import { childAPI } from '../../services/api.config';
import { useNavigate, useParams } from 'react-router-dom';

const ChildForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [parents, setParents] = useState([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    parent_id: '',
    special_needs: ''
  });

  useEffect(() => {
    if (id) {
      fetchChild();
    }
    fetchParents();
  }, [id]);

  const fetchChild = async () => {
    try {
      setLoading(true);
      const response = await childAPI.getById(id);
      const child = response.data;
      setFormData({
        first_name: child.first_name,
        last_name: child.last_name,
        date_of_birth: child.date_of_birth.split('T')[0], // Format date for input
        parent_id: child.parent_id,
        special_needs: child.special_needs || ''
      });
    } catch (err) {
      setError('Failed to fetch child details');
      console.error('Error fetching child:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParents = async () => {
    try {
      const response = await parentAPI.getAll();
      setParents(response.data);
    } catch (err) {
      console.error('Error fetching parents:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await childAPI.update(id, formData);
      } else {
        await childAPI.create(formData);
      }
      navigate('/children');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save child');
      console.error('Error saving child:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Child' : 'Add New Child'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
              Parent/Guardian
            </label>
            <select
              name="parent_id"
              id="parent_id"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.parent_id}
              onChange={handleChange}
            >
              <option value="">Select a parent</option>
              {parents.map(parent => (
                <option key={parent.id} value={parent.id}>
                  {parent.first_name} {parent.last_name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="special_needs" className="block text-sm font-medium text-gray-700">
              Special Needs
            </label>
            <textarea
              name="special_needs"
              id="special_needs"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.special_needs}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/children')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChildForm; 