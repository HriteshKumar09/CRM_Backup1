import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../Services/api';
import { FiPlusCircle, FiEdit, FiTrash2 } from 'react-icons/fi';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import moment from 'moment';
import PageHeader from '../../extra/PageHeader';
import FormDialog from '../../extra/FormDialog';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: '',
    client_id: '',
    bill_date: '',
    end_date: '',
    note: '',
    labels: '',
    amount: '',
    status: 'draft',
    payment_status: 'success',
    tax_id: '',
    tax_id2: '',
    repeat_every: 1,
    repeat_type: 'days',
    no_of_cycles: 0,
    next_recurring_date: '',
    no_of_cycles_completed: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [clients, setClients] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
    fetchClients();
    fetchTaxes();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/subscriptions');
      console.log('Subscriptions API Response:', response.data);
      if (response.data.success) {
        setSubscriptions(response.data.data || []);
      } else {
        console.error('API returned unsuccessful response:', response.data);
        toast.error('Failed to fetch subscriptions: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      if (response.data.success) {
        const clientsData = response.data.data || [];
        setClients(clientsData);
      } else {
        toast.error(response.data.message || 'Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch clients');
    }
  };

  const fetchTaxes = async () => {
    try {
      const response = await api.get('/taxes');
      if (response.data.success) {
        const taxesData = response.data.taxes || [];
        setTaxes(taxesData);
      } else {
        toast.error(response.data.message || 'Failed to fetch taxes');
      }
    } catch (error) {
      console.error('Error fetching taxes:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch taxes');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      client_id: '',
      bill_date: '',
      end_date: '',
      note: '',
      labels: '',
      status: 'draft',
      payment_status: 'success',
      tax_id: '',
      tax_id2: '',
      repeat_every: 1,
      repeat_type: 'days',
      no_of_cycles: 0,
      next_recurring_date: '',
      no_of_cycles_completed: 0
    });
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setForm({
      title: record.title,
      client_id: record.client_id,
      bill_date: record.bill_date ? moment(record.bill_date).format('YYYY-MM-DD') : '',
      end_date: record.end_date ? moment(record.end_date).format('YYYY-MM-DD') : '',
      note: record.note || '',
      labels: record.labels || '',
      status: record.status || 'draft',
      payment_status: record.payment_status || 'success',
      tax_id: record.tax_id || '',
      tax_id2: record.tax_id2 || '',
      repeat_every: record.repeat_every || 1,
      repeat_type: record.repeat_type || 'days',
      no_of_cycles: record.no_of_cycles || 0,
      next_recurring_date: record.next_recurring_date ? moment(record.next_recurring_date).format('YYYY-MM-DD') : '',
      no_of_cycles_completed: record.no_of_cycles_completed || 0
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        const response = await api.delete(`/subscriptions/${id}`);
        if (response.data.success) {
          toast.success('Subscription deleted successfully');
          fetchSubscriptions();
        } else {
          toast.error(response.data.message || 'Failed to delete subscription');
        }
      } catch (error) {
        console.error('Error deleting subscription:', error);
        toast.error(error.response?.data?.message || 'Failed to delete subscription');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!values.client_id) {
        toast.error('Please select a client');
        return;
      }

      const payload = {
        ...values,
        bill_date: values.bill_date ? moment(values.bill_date).format('YYYY-MM-DD') : null,
        end_date: values.end_date ? moment(values.end_date).format('YYYY-MM-DD') : null,
        next_recurring_date: values.next_recurring_date ? moment(values.next_recurring_date).format('YYYY-MM-DD') : null,
        tax_id: values.tax_id || 0,
        tax_id2: values.tax_id2 || 0,
        labels: values.labels || '',
        note: values.note || '',
        company_id: 1,
        files: 'a:0:{}',
        type: 'app'
      };

      let response;
      if (editingId) {
        response = await api.put(`/subscriptions/${editingId}`, payload);
      } else {
        response = await api.post('/subscriptions', payload);
      }

      if (response.data.success) {
        toast.success(editingId ? 'Subscription updated successfully' : 'Subscription created successfully');
        setIsModalVisible(false);
        fetchSubscriptions();
      } else {
        toast.error(response.data.message || `Failed to ${editingId ? 'update' : 'create'} subscription`);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast.error(error.response?.data?.message || `Failed to ${editingId ? 'update' : 'create'} subscription`);
    }
  };

  const fields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { 
      name: 'client_id', 
      label: 'Client', 
      type: 'select', 
      options: clients.map(client => ({ value: client.id, label: client.company_name })),
      required: true 
    },
    { name: 'bill_date', label: 'Bill Date', type: 'date', required: true },
    { name: 'end_date', label: 'End Date', type: 'date' },
    { name: 'note', label: 'Note', type: 'textarea' },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending' },
        { value: 'active', label: 'Active' },
        { value: 'cancelled', label: 'Cancelled' }
      ],
      required: true 
    },
    { 
      name: 'payment_status', 
      label: 'Payment Status', 
      type: 'select', 
      options: [
        { value: 'success', label: 'Success' },
        { value: 'failed', label: 'Failed' }
      ],
      required: true 
    },
    { 
      name: 'tax_id', 
      label: 'Tax 1', 
      type: 'select', 
      options: taxes.map(tax => ({ value: tax.id, label: tax.title }))
    },
    { 
      name: 'tax_id2', 
      label: 'Tax 2', 
      type: 'select', 
      options: taxes.map(tax => ({ value: tax.id, label: tax.title }))
    },
    { name: 'repeat_every', label: 'Repeat Every', type: 'number', min: 1, required: true },
    { 
      name: 'repeat_type', 
      label: 'Repeat Type', 
      type: 'select', 
      options: [
        { value: 'days', label: 'Days' },
        { value: 'weeks', label: 'Weeks' },
        { value: 'months', label: 'Months' },
        { value: 'years', label: 'Years' }
      ],
      required: true 
    },
    { name: 'no_of_cycles', label: 'Number of Cycles', type: 'number', min: 0 },
    { name: 'next_recurring_date', label: 'Next Recurring Date', type: 'date' }
  ];

  return (
    <div className="p-4">
      <ToastContainer />
      <PageHeader
        title="Subscriptions"
        buttons={[
          { label: "Add Subscription", icon: FiPlusCircle, onClick: handleAdd }
        ]}
      />
      
      {loading ? (
        <div className="text-center py-4">Loading subscriptions...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bill Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Recurring</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!subscriptions || subscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                subscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{subscription.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.client_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.bill_date ? moment(subscription.bill_date).format('YYYY-MM-DD') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.end_date ? moment(subscription.end_date).format('YYYY-MM-DD') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                        subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {subscription.next_recurring_date ? moment(subscription.next_recurring_date).format('YYYY-MM-DD') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(subscription)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(subscription.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <FormDialog
        open={isModalVisible}
        handleClose={() => setIsModalVisible(false)}
        type="Subscription"
        fields={fields}
        formData={form}
        handleChange={(e) => {
          const { name, value } = e.target;
          setForm(prev => ({ ...prev, [name]: value }));
        }}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: () => handleSubmit(form)
          }
        ]}
        isEditMode={!!editingId}
        showUploadButton={false}
      />
    </div>
  );
};

export default Subscriptions; 