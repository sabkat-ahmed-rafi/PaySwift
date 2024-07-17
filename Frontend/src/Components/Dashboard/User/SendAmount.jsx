import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import toast from 'react-hot-toast'

const SendAmount = () => {

    const singleUser = useLoaderData()
    const {user} = useAuth()
    const navigate = useNavigate()

    console.log(singleUser)


    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target
        const money = form.money.value;
        const email = singleUser.email
        const senderEmail = user.email
        console.log(money)

        if(email === senderEmail) return toast.error("You can't send money to yourself")

        if(user?.balance < parseInt(money) || user?.balance == 0) return toast.error('Insufficient Balance')

        if(parseInt(money) <= 50) return toast.error('Insufficient Balance')

        try{
            const {data} = await axiosSecure.patch('/sendMoney', {money, email, senderEmail});

        if(data.success) {
            toast.success('Money transfered successfully')
            navigate('/')
        }
        }catch(error){
            if(error.response.data.message === 'Insufficient Balance'){
                toast.error('Insufficient Balance')
            }
            
        }
        

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