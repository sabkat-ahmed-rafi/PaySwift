import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const CashoutPinCheck = () => {

    const {user} = useAuth();
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target
        const checkingPassword = form.password.value;
        const email = user?.email

        try{
            const {data} = await axiosSecure.post("/checkPassword", {email, checkingPassword});
            console.log(data);
            if(data.success){
                
                navigate('/cashOut')
            }else{
                toast.error("Invalid Pin");
            }
        }catch(err) {
            console.log(err.message);
            toast.error("Invalid Pin");
        }



    }

    return (
        <>
           <section className='space-y-7 pt-8'>
                <h1 className='text-center text-6xl text-[#E2126D] font-bold'>Enter your Pin</h1>
                <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center space-y-4'>
                    <input name='password' className='input input-bordered' type="password" placeholder="Enter your Pin" />
                    <button className='btn bg-[#E2126D] text-white hover:text-black' type="submit">Enter</button>
                </form>
            </section> 
        </>
    );
};

export default CashoutPinCheck;