import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import useAuth from '../../../Hooks/useAuth';
import { BsCashCoin } from 'react-icons/bs';
import { GiMoneyStack } from 'react-icons/gi';
import { AiOutlineTransaction } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const AgentHome = () => {

    const {user} = useAuth()
    console.log(user)

    const {data: balance = {}} = useQuery({
        queryKey: ['agentBalance', user?.email],
        queryFn: async () => {
            const {data} = await axiosSecure.get(`/user/${user?.email}`);
            console.log(data);
            return data;
        },
        enabled: !!user?.email
    })


    return (
        <>
        <h1 className='text-center border-[#E2126D] text-2xl border w-[200px] mx-auto font-extralight px-3 py-1'>Balance: {balance.balance} TK</h1>

<section className='flex justify-center space-x-2 lg:space-x-12 mt-10'>
    <Link to={'/cashInRequests'} className='flex flex-col items-center border lg:p-5 rounded-lg text-white bg-[#E2126D] p-2'>
        <BsCashCoin size={60} />
        <h1 className='font-semibold'>Cash in Requests</h1>
    </Link>
    <Link to={'/cashOutRequests'} className='flex flex-col items-center border lg:p-5 rounded-lg text-white bg-[#E2126D] p-2'>
        <GiMoneyStack size={60} />
        <h1 className='font-semibold'>Cash Out Requests</h1>
    </Link>
    <Link to={'/transactionHistory'} className='flex flex-col items-center border lg:p-5 rounded-lg text-white bg-[#E2126D] p-2'>
        <AiOutlineTransaction size={60} />
        <h1 className='font-semibold'>Transaction History</h1>
    </Link>
</section> 
        </>
    );
};

export default AgentHome;