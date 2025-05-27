import axios from 'axios'
import { BASE_URL } from './apiPaths'

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json",
        Accept:"application/json"
    }
})

//Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
)
//Response Interceptor 
axiosInstance.interceptors.response.use(
    (response)=>{
        return response
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 401 ){
                // Redirect to login page
                window.location.href = "/login"
            } else if(error.response.status === 500 ){
                console.error("Server error. please try again later.");
            } else if(error.code === "ECONNABORTED"){
                console.error("Request timeout.try after sometime")
            }
            return Promise.reject(error);
        }
    }
)

export default axiosInstance;