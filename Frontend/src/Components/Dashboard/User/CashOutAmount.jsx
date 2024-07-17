import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const CashOutAmount = () => {




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


        if(user?.balance < parseInt(money) || user?.balance == 0) return toast.error('Insufficient Balance')

        if(parseInt(money) < 50) return toast.error('You cannot cash out less that 50TK')

        try{
            const {data} = await axiosSecure.post('/cashOutRequest', {money, email, senderEmail});

           if(data.success) {
               toast.success('Transfer Request sent')
               navigate('/')
            }
        }catch(error){
            if(error){
                toast.error('Insufficient Balance')
            }
            
        }
        

    }




    return (
        <>
            <div>
                <form onSubmit={handleSubmit} className='flex space-y-4 flex-col justify-center items-center min-h-screen'>
                <h1 className='text-2xl text-[#E2126D] font-bold'>Send through: <span className='text-black font-medium'>{singleUser.name}</span></h1>
                <input className='input input-bordered' type="number" placeholder='$' name="money" id="" />
                <button className='btn text-white hover:text-black bg-[#E2126D]' type="submit">Send</button>
                </form>
            </div>
        </>
    );
};

export default CashOutAmount;