import axios from "axios"
const axiosInstance = axios.create({
    baseURL: 'https://keeper-backend-steel.vercel.app',
    timeout: 10000,
    headers: {
        "Content-Type":"application/json"
    }
});

axiosInstance.interceptors.request.use((config)=>{
    
    const accessToken = localStorage.getItem("token");
    if(accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('Authorization header set:', config.headers.Authorization);
    }else{
        console.log('No access token found in localStorage');
    }
    return config;
},(error)=>{
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
}
);

export default axiosInstance;