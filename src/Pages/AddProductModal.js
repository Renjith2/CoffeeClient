

import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { addProducts, updateProduct } from '../APICALLS/products';

const AddProductModal = ({ isModalVisible, handleCancel, editingProduct, productToEdit, update,SetUpdate }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingProduct) {
      console.log(productToEdit)
      form.setFieldsValue(productToEdit);
    } else {
      form.resetFields();
    }
  }, [editingProduct, productToEdit]);

  const onFinish = async (values) => {
    console.log('Form values:', values); // Log form values to check correctness
    try {
      let response;
      if (editingProduct) {
        response = await updateProduct(productToEdit._id, values);
        SetUpdate(true)
      } else {
        response = await addProducts(values);
        SetUpdate(true)
      }
      if (response.success) {
        message.success(response.message);
        form.resetFields();
        handleCancel();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Failed to add/edit product');
      console.error('Error adding/editing product:', error);
    }
  };

  return (
    <Modal
      title={editingProduct ? "Edit Product" : "Add New Product"}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please input the product name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Product Description"
          rules={[{ required: true, message: 'Please input the product description!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Product Price"
          rules={[{ required: true, message: 'Please input the product price!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="category"
          label="Product Category"
          rules={[{ required: true, message: 'Please input the product category!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="availability"
          label="Product Availability"
          rules={[{ required: true, message: 'Please input the product availability!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="vendorname"
          label="Vendor Name"
          rules={[{ required: true, message: 'Please input the Vendor Name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editingProduct ? "Update Product" : "Add Product"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
