import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../context/ToastContext';

const AdminSimulations = () => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();
  
  const [formData, setFormData] = useState({ title: '', module: 'Module 1', status: 'Draft' });

  const fetchSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('simulations').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
      toast.error('Failed to load simulations (table might not exist yet)');
    } else {
      setSimulations(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleOpenModal = (sim = null) => {
    if (sim) {
      setEditingId(sim.id);
      setFormData({ title: sim.title, module: sim.module, status: sim.status });
    } else {
      setEditingId(null);
      setFormData({ title: '', module: 'Module 1', status: 'Draft' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('simulations').update(formData).eq('id', editingId);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Simulation updated!');
        fetchSimulations();
        handleCloseModal();
      }
    } else {
      const { error } = await supabase.from('simulations').insert([formData]);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Simulation added!');
        fetchSimulations();
        handleCloseModal();
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this simulation?')) {
      const { error } = await supabase.from('simulations').delete().eq('id', id);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Simulation deleted!');
        fetchSimulations();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontWeight: 600 }}>Manage Simulations</h2>
        <button 
          onClick={() => handleOpenModal()}
          style={{
            padding: '10px 20px', background: 'linear-gradient(135deg, #a78bfa, #6d28d9)', color: '#fff', 
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600,
            boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)'
          }}>
          + Add New Simulation
        </button>
      </div>
      
      <div className="admin-glass-card">
        {loading ? (
          <p style={{ color: '#9aa0b4' }}>Loading simulations...</p>
        ) : simulations.length === 0 ? (
          <p style={{ color: '#9aa0b4' }}>No simulations found. Create one to get started.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '12px', color: '#9aa0b4' }}>Title</th>
                <th style={{ padding: '12px', color: '#9aa0b4' }}>Module</th>
                <th style={{ padding: '12px', color: '#9aa0b4' }}>Status</th>
                <th style={{ padding: '12px', color: '#9aa0b4' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {simulations.map((sim) => (
                <tr key={sim.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px 12px' }}>{sim.title}</td>
                  <td style={{ padding: '16px 12px' }}>{sim.module}</td>
                  <td style={{ padding: '16px 12px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      background: sim.status === 'Published' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)', 
                      color: sim.status === 'Published' ? '#34d399' : '#fbbf24', 
                      borderRadius: '4px', fontSize: '0.85rem' 
                    }}>
                      {sim.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 12px', display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleOpenModal(sim)}
                      style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(sim.id)}
                      style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(25, 30, 42, 0.95)', border: '1px solid rgba(255,255,255,0.1)',
            padding: '32px', borderRadius: '16px', width: '400px',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4)'
          }}>
            <h3 style={{ margin: '0 0 24px 0' }}>{editingId ? 'Edit Simulation' : 'Add New Simulation'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Title</label>
                <input 
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Module</label>
                <select 
                  name="module"
                  value={formData.module}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Module 1" style={{ color: '#000' }}>Module 1</option>
                  <option value="Module 2" style={{ color: '#000' }}>Module 2</option>
                  <option value="Module 3" style={{ color: '#000' }}>Module 3</option>
                  <option value="Module 4" style={{ color: '#000' }}>Module 4</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#9aa0b4', fontSize: '0.9rem' }}>Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                >
                  <option value="Draft" style={{ color: '#000' }}>Draft</option>
                  <option value="Published" style={{ color: '#000' }}>Published</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#a78bfa', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  {editingId ? 'Save Changes' : 'Add Simulation'}
                </button>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '12px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSimulations;
