import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../Services/api';
import { FiPlusCircle, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import FormDialog from '../../extra/FormDialog';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

const SubscriptionView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form, setForm] = useState({
    description: '',
    quantity: 1,
    unit_price: 0,
    total: 0
  });
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    fetchSubscription();
    fetchItems();
  }, [id]);

  const fetchSubscription = async () => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      toast.error('Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get(`/subscriptions/${id}/items`);
      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch subscription items');
    }
  };

  const handleAddItem = () => {
    setEditingItemId(null);
    setIsModalVisible(true);
  };

  const handleEditItem = (record) => {
    setEditingItemId(record.id);
    setIsModalVisible(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await api.delete(`/subscriptions/items/${itemId}`);
        if (response.data.success) {
          toast.success('Item deleted successfully');
          fetchItems();
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (editingItemId) {
        const response = await api.put(`/subscriptions/items/${editingItemId}`, values);
        if (response.data.success) {
          toast.success('Item updated successfully');
        }
      } else {
        const response = await api.post(`/subscriptions/${id}/items`, values);
        if (response.data.success) {
          toast.success('Item added successfully');
        }
      }
      setIsModalVisible(false);
      fetchItems();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('Failed to save item');
    }
  };

  const fields = [
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'unit_price', label: 'Unit Price', type: 'number', required: true },
    { name: 'total', label: 'Total', type: 'number', required: true }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subscription) {
    return <div>Subscription not found</div>;
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <button
        onClick={() => navigate('/subscriptions')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <FiArrowLeft className="mr-2" />
        Back to Subscriptions
      </button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{subscription.title}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Client: {subscription.client_name}</p>
            <p className="text-gray-600">Bill Date: {subscription.bill_date}</p>
            <p className="text-gray-600">Due Date: {subscription.due_date}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount: ${subscription.amount}</p>
            <p className="text-gray-600">Status: {subscription.status}</p>
            <p className="text-gray-600">Tax: {subscription.tax_name}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">Subscription Items</h3>
          <button
            onClick={handleAddItem}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <FiPlusCircle className="mr-2" />
            Add Item
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">${item.unit_price}</td>
                <td className="px-6 py-4 whitespace-nowrap">${item.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FiEdit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormDialog
        open={isModalVisible}
        handleClose={() => setIsModalVisible(false)}
        type={editingItemId ? "Edit Item" : "Add Item"}
        fields={fields}
        formData={form}
        handleChange={(e) => {
          const { name, value } = e.target;
          setForm(prev => ({ ...prev, [name]: value }));
        }}
        handleSave={handleSubmit}
        extraButtons={[
          {
            label: "Save",
            icon: IoMdCheckmarkCircleOutline,
            onClick: handleSubmit,
            color: "#007bff",
          },
        ]}
      />
    </div>
  );
};

export default SubscriptionView; 