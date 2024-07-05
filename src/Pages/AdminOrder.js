import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../APICALLS';
import { Button, Table, Select, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch admin details to get the vendor name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/get-current-user');
        console.log(response.data.data.name); // Debugging: Log the full response

        if (response.data.success) {
          setUser(response.data.data.name);
          console.log(user);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch orders only after user is set
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return; // Wait until user is set

      try {
        const response = await axiosInstance.get('/api/orders');
        const orders = response.data.data;

        const filteredOrders = orders.filter(order => order.vendorName === user);
        const formattedOrders = filteredOrders.map(order => ({
          ...order,
          orderDate: moment(order.orderDate).format('YYYY-MM-DD')
        }));

        setOrders(formattedOrders);
        console.log(orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOrders();
  }, [user]); // Dependency on user

  

  const handleStatusChange = async (value, record) => {
    try {
      const updatedOrder = { ...record, orderStatus: value };
      await axiosInstance.put(`/api/orders/${record._id}`, updatedOrder);

      const updatedOrders = orders.map(order =>
        order._id === record._id ? updatedOrder : order
      );

      setOrders(updatedOrders);
      message.success('Order status updated successfully!');
    } catch (error) {
      console.log(error);
      message.error('Error updating order status.');
    }
  };

  const handleSubmit = async (record, status) => {
    try {
      const updatedOrder = { ...record, orderStatus: status };
      await axiosInstance.put(`/api/orders/${record._id}`, updatedOrder);
  
      const updatedOrders = orders.map(order =>
        order._id === record._id ? updatedOrder : order
      );
  
      setOrders(updatedOrders);
      message.success(`Order status changed to ${status} successfully!`);
    } catch (error) {
      console.log(error);
      message.error(`Error changing order status to ${status}.`);
    }
  };
   
  

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
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text, record) => (
        <Select
          value={record.orderStatus}
          onChange={(value) => handleStatusChange(value, record)}
        >
          <Option value="In process">In process</Option>
          <Option value="Dispatched">Dispatched</Option>
          <Option value="Delivered">Delivered</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },

    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button type="link" onClick={() => handleSubmit(record)}>
          Confirm
        </Button>
      ),
    }
  ];

  return (
    <div>
      <Table columns={columns} dataSource={orders} rowKey="_id" />
    </div>
  );
}

export default AdminOrder;

