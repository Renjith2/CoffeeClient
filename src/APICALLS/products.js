const { axiosInstance } = require(".");


export const addProducts = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/products', payload);
    return response.data; // Assuming backend responds with data
  } catch (error) {
    if (error.response && error.response.data) {
      // Return the error response from the backend
      return error.response.data;
    } else {
      // Return a generic error message if no response is available
      return { success: false, message: 'Failed to add product' };
    }
  }
};


export const getProducts = async () => {
  try {
    const response = await axiosInstance.get('/api/products');
    return response.data; // Assuming backend responds with data
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, message: 'Failed to fetch products' };
  }
};


export const updateProduct = async (productId, payload) => {
  try {
    const response = await axiosInstance.put(`/api/products/${productId}`, payload);
    return response.data; // Assuming backend responds with data
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, message: 'Failed to update product' };
  }
};


export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, message: 'Failed to delete product' };
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await axiosInstance.get(`/api/products/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    return { success: false, message: 'Failed to search products' };
  }
};