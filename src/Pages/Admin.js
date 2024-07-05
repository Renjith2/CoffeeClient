


import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Input } from 'antd';
import AddProductModal from './AddProductModal';
import { getProducts, deleteProduct, searchProducts } from '../APICALLS/products';
import { axiosInstance } from '../APICALLS';

const { confirm } = Modal;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, SetEditingProduct] = useState(false);
  const [user, setUser] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [update, SetUpdate] = useState(false);
  const [unsearch, setUnsearch] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [unsearch, update]); // Refetch products when unsearch or update changes

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user, update]); // Refetch products when user or update changes

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get('/api/user/get-current-user');
      if (response.data.success) {
        setUser(response.data.data.name);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
        // Filter products based on vendorname
        const filtered = response.data.filter(order => order.vendorname === user);
        setFilteredProducts(filtered);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Failed to fetch products');
    }
  };

  const handleSearch = async () => {
    try {
      const response = await searchProducts(searchQuery);
      if (response.success) {
        setProducts(response.data);
        const filtered = response.data.filter(order => order.vendorname === user);
        setFilteredProducts(filtered);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      message.error('Failed to search products');
    }
  };

  const handleDeleteProduct = async (productId) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      onOk: async () => {
        try {
          const response = await deleteProduct(productId);
          if (response.success) {
            message.success(response.message);
            fetchProducts();
          } else {
            message.error(response.message);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          message.error('Failed to delete product');
        }
      }
    });
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    SetEditingProduct(true);
    setIsModalVisible(true);
  };

  const handleAddProductClick = () => {
    setProductToEdit(null);
    SetEditingProduct(false);
    setIsModalVisible(true);
    SetUpdate(false);
  };

  const handleCancel = () => {
    setSearchQuery(''); // Clear search query
    setUnsearch(true); // Trigger refetch of products
    setIsModalVisible(false);
    SetEditingProduct(false);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Availability Status',
      dataIndex: 'availability',
      key: 'availability',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorname',
      key: 'vendorname',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          <Button style={{ margin: '5px' }} type="primary" onClick={() => handleEditProduct(record)}>Edit</Button>
          <Button style={{ margin: '5px' }} type="primary" danger onClick={() => handleDeleteProduct(record._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, textAlign: 'right' }}>
        <Input.Search
          placeholder="Search products"
          enterButton
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Button onClick={handleCancel}>Clear Search</Button>
        <Button type="primary" onClick={handleAddProductClick}>
          Add New Product
        </Button>
      </div>
      <AddProductModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        productToEdit={productToEdit}
        editingProduct={editingProduct}
        update={update}
        SetUpdate={SetUpdate}
      />
      <Table columns={columns} dataSource={filteredProducts} />
    </div>
  );
};

export default ProductTable;
