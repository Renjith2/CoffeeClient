
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Input } from 'antd';
import PlaceOrderModal from './PlaceOrderModal'; // Adjust the path as per your project structure
import { addOrder, editOrder, deleteOrder } from '../APICALLS/orders'; // Import the functions
import moment from 'moment'; // Ensure moment is imported
const { axiosInstance } = require('../APICALLS/index');

const UserOrder = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    productsOrdered: '',
    quantity: 1,
    totalPrice: 0,
    orderDate: null,
    orderStatus: 'In process', // Default order status
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch existing orders
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get('/api/orders');
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const searchOrders = async (query) => {
    try {
      const response = await axiosInstance.get(`/api/orders/search?q=${query}`);
      console.log(response.data)
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error searching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isModalVisible]); // Update dependency to refresh orders when modal visibility changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    searchOrders(searchQuery);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setEditOrderId(null);
    setFormData({
      customerName: '',
      productsOrdered: '',
      quantity: 1,
      totalPrice: 0,
      orderDate: null,
      orderStatus: 'In process',
    });
  };

  const handleModalSubmit = async () => {
    try {
      let response;
      if (isEditMode) {
        response = await editOrder(editOrderId, formData);
      } else {
        response = await addOrder(formData);
      }

      if (response.success) {
        message.success(isEditMode ? 'Order updated successfully!' : 'Order placed successfully!');
        fetchOrders(); // Refresh orders after successful submission
        setIsModalVisible(false);
        setIsEditMode(false);
        setEditOrderId(null);
        // Update orders state or perform other actions on success
      } else {
        message.error(isEditMode ? 'Failed to update order.' : 'Failed to place order.');
      }
    } catch (error) {
      message.error(isEditMode ? 'An error occurred while updating the order.' : 'An error occurred while placing the order.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceOrder = () => {
    setFormData({
      customerName: '',
      productsOrdered: '',
      quantity: 1,
      totalPrice: 0,
      orderDate: null,
      orderStatus: 'In process', // Default order status
    });
    setIsModalVisible(true);
  };

  const handleEditOrder = (record) => {
    setFormData({
      customerName: record.customerName,
      productsOrdered: record.productsOrdered,
      quantity: record.quantity,
      totalPrice: record.totalPrice,
      orderDate: record.orderDate ? moment(record.orderDate) : null,
      orderStatus: record.orderStatus,
    });
    setIsEditMode(true);
    setEditOrderId(record._id);
    setIsModalVisible(true);
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await deleteOrder(id);
      if (response.success) {
        message.success('Order deleted successfully!');
        setOrders(prevOrders => prevOrders.filter(order => order._id !== id));
      } else {
        message.error('Failed to delete order.');
      }
    } catch (error) {
      message.error('An error occurred while deleting the order.');
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Products Ordered',
      dataIndex: 'productsOrdered',
      key: 'productsOrdered',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleEditOrder(record)}>Edit</Button>
          <Button type="link" onClick={() => handleDeleteOrder(record._id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: '16px' }}>
        <Input
          placeholder="Search orders"
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ width: '200px', marginRight: '16px' }}
        />
        <Button type="primary" onClick={handleSearch} style={{ marginRight: '16px' }}>
          Search
        </Button>
        <Button type="primary" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
      <Table columns={columns} dataSource={orders} rowKey="_id" />
      <PlaceOrderModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleModalSubmit}
        isEditMode={isEditMode}
        editOrderId={editOrderId}
      />
    </>
  );
};

export default UserOrder;