const {axiosInstance}=require(".")
export const registerUser = async (payload)=>{
    try {
        const response= await axiosInstance.post('/api/user/register',payload)
        console.log(response.data)
        return response.data
    } catch (error) {
        return error
    }
}


export const loginUser = async (payload)=>{
    try {
        const response= await axiosInstance.post('/api/user/login',payload)
        console.log(response.data)
        return response.data
    } catch (error) {
        return error
    }
}


export const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/api/user/get-current-user');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  };