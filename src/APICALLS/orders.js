const { axiosInstance } = require(".");

export const addOrder = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/orders', payload);
    console.log(response)
    return response.data;
  } catch (error) {
    return error;
  }
};

// APICALLS/orders.js


export const editOrder = async (id, updatedData) => {
    try {
      const response = await axiosInstance.put(`/api/orders/${id}`, updatedData);
      console.log('Order updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      return error.response ? error.response.data : error;
    }
  };




export const deleteOrder = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/orders/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting order:', error);
    return error.response ? error.response.data : error;
  }
};
