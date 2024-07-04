




import React, { useState, useEffect } from 'react';
import { Table, Button, message, Modal, Input } from 'antd';
import AddProductModal from './AddProductModal';
import { getProducts, deleteProduct, searchProducts } from '../APICALLS/products';

const { confirm } = Modal;

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct,SeteditingProduct]=useState(false)

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success) {
        setProducts(response.data);
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
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      message.error('Failed to search products');
    } finally {
      setSearchQuery(''); // Clear the search input field
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
    console.log("Hi from edit product", product);
    setProductToEdit(product);
    SeteditingProduct(true);
    setIsModalVisible(true);
  };

  const handleAddProductClick = () => {
    setProductToEdit(null);
    SeteditingProduct(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    SeteditingProduct(false);
    fetchProducts(); // Fetch updated products list after closing the modal
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
        <Button type="primary" onClick={handleAddProductClick}>
          Add New Product
        </Button>
      </div>
      <AddProductModal
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        productToEdit={productToEdit}
        editingProduct={editingProduct}
      />
      <Table columns={columns} dataSource={products}  />
    </div>
  );
};

export default ProductTable;
