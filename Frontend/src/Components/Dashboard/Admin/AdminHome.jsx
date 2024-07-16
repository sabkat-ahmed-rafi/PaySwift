import React from 'react';
import { AiOutlineTransaction } from 'react-icons/ai';
import { MdManageAccounts } from "react-icons/md";
import { Link } from 'react-router-dom';

const AdminHome = () => {
    return (
        <>
            <section className='flex justify-center space-x-2 lg:space-x-12 mt-10'>
    <Link to={'/manageUsers'} className='flex flex-col items-center border lg:p-5 rounded-lg text-white bg-[#E2126D] p-2'>
        <MdManageAccounts size={60} />
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

export default AdminHome;