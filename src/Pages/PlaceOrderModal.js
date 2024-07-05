

import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, InputNumber, DatePicker, Select, message } from 'antd';
import moment from 'moment';
import { addOrder, editOrder } from '../APICALLS/orders'; // Import the addOrder function
const { axiosInstance } = require('../APICALLS/index');
const { Option } = Select;

const PlaceOrderModal = ({ visible, onCancel, formData, onChange, onSubmit, isEditMode, editOrderId, setFormData }) => {
  const [products, setProducts] = useState([]);
  const [productPrices, setProductPrices] = useState({});
  const [productVendors, setProductVendors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/api/products');
        const productData = response.data.data;
        const productNames = productData.map(item => item.name);
        const productPrices = productData.reduce((acc, item) => {
          acc[item.name] = item.price;
          return acc;
        }, {});
        const productVendors = productData.reduce((acc, item) => {
          acc[item.name] = item.vendorname;
          return acc;
        }, {});
        setProducts(productNames);
        setProductPrices(productPrices);
        setProductVendors(productVendors);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductChange = (value) => {
    setFormData({
      ...formData,
      productsOrdered: value,
      totalPrice: productPrices[value] * formData.quantity, // Set total price based on selected product and quantity
      vendorName: productVendors[value] // Set vendor name based on selected product
    });
  };

  const handleQuantityChange = (value) => {
    setFormData({
      ...formData,
      quantity: value,
      totalPrice: productPrices[formData.productsOrdered] * value // Recalculate total price based on quantity
    });
  };

  const handleSubmit = async () => {
    try {
      // Add "In process" order status to formData before sending to the backend
      const updatedFormData = { ...formData, orderStatus: 'In process' };
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
          onChange={handleProductChange}
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
        <InputNumber
          name="quantity"
          value={formData.quantity}
          onChange={handleQuantityChange}
          min={1}
        />
      </div>
      <div>
        <label>Total Price:</label>
        <InputNumber name="totalPrice" value={formData.totalPrice} disabled />
      </div>
      <div>
        <label>Order Date:</label>
        <DatePicker
          name="orderDate"
          value={formData.orderDate ? moment(formData.orderDate) : null}
          format="YYYY-MM-DD"
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
      <div>
        <label>Vendor Name:</label>
        <Input
          name="vendorName"
          value={formData.vendorName}
          disabled
        />
      </div>
    </Modal>
  );
};

export default PlaceOrderModal;
