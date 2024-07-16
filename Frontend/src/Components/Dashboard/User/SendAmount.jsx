import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const SendAmount = () => {

    const singleUser = useLoaderData()
    const {user} = useAuth()

    console.log(singleUser)


    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target
        const money = form.money.value;
        const email = singleUser.email
        const senderEmail = user.email
        console.log(money)

        const {data} = await axiosSecure.patch('/sendMoney', {money, email, senderEmail});
        

    }



    return (
        <>
            <div>
                <form onSubmit={handleSubmit} className='flex space-y-4 flex-col justify-center items-center min-h-screen'>
                <h1 className='text-2xl text-[#E2126D] font-bold'>Send Amount to: <span className='text-black font-medium'>{singleUser.name}</span></h1>
                <input className='input input-bordered' type="number" placeholder='$' name="money" id="" />
                <button className='btn text-white hover:text-black bg-[#E2126D]' type="submit">Send</button>
                </form>
            </div>
        </>
    );
};

export default SendAmount;