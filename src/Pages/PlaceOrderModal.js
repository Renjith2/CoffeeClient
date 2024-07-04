

import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, InputNumber, DatePicker, Select, message } from 'antd';
import moment from 'moment';
import { addOrder, editOrder } from '../APICALLS/orders'; // Import the addOrder function
const { axiosInstance } = require('../APICALLS/index');
const { Option } = Select;

const PlaceOrderModal = ({ visible, onCancel, formData, onChange, onSubmit, isEditMode,editOrderId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products/search');
        const productNames = response.data.data.map(item => item.name);
        setProducts(productNames);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async () => {
    try {
      // Add "In process" order status to formData before sending to the backend
      const updatedFormData = { ...formData, orderStatus: 'In process' };
      console.log(formData._id)
      const response = await (isEditMode ? editOrder(editOrderId, updatedFormData) : addOrder(updatedFormData));
      if (response.success) {
        message.success(isEditMode ? 'Order updated successfully!' : 'Order placed successfully!');
        onCancel();
      } else {
        message.error(isEditMode ? 'Failed to update order.' : 'Failed to place order.');
      }
    } catch (error) {
      message.error(isEditMode ? 'An error occurred while updating the order.' : 'An error occurred while placing the order.');
    }
  };

  const handleDateChange = (date, dateString) => {
    onChange({ target: { name: 'orderDate', value: dateString } });
  };

  return (
    <Modal
      title={isEditMode ? 'Edit Order' : 'Place Order'}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditMode ? 'Edit' : 'Add'}
        </Button>,
      ]}
    >
      <div>
        <label>Customer Name:</label>
        <Input name="customerName" value={formData.customerName} onChange={onChange} />
      </div>
      <div>
        <label>Products Ordered:</label>
        <Select
          name="productsOrdered"
          value={formData.productsOrdered}
          onChange={(value) => onChange({ target: { name: 'productsOrdered', value } })}
          style={{ width: '100%' }}
        >
          {products.map(product => (
            <Option key={product} value={product}>
              {product}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label>Quantity:</label>
        <InputNumber name="quantity" value={formData.quantity} onChange={(value) => onChange({ target: { name: 'quantity', value } })} />
      </div>
      <div>
        <label>Total Price:</label>
        <InputNumber name="totalPrice" value={formData.totalPrice} onChange={(value) => onChange({ target: { name: 'totalPrice', value } })} />
      </div>
      <div>
        <label>Order Date:</label>
        <DatePicker
          name="orderDate"
          value={formData.orderDate ? moment(formData.orderDate) : null}
          onChange={handleDateChange}
        />
      </div>
      <div>
        <label>Order Status:</label>
        <Input
          name="orderStatus"
          value="In process"
          disabled
        />
      </div>
    </Modal>
  );
};

export default PlaceOrderModal;
