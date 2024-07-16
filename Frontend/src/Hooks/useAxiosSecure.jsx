import axios from 'axios'


export const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
})



const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;