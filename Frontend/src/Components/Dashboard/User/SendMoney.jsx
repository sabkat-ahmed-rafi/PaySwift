import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import { Link } from 'react-router-dom';

const SendMoney = () => {

    let index = 1;
    const [search, setSearch] = useState('')

    const {data = []} = useQuery({
        queryKey: ['allUsers', search],
        queryFn: async () => {
            const {data} = await axiosSecure.get(`/users?search=${search}`);
            return data;
        }
    })



    return (
        <>
            <section className='flex flex-col lg:space-y-0 space-y-3  lg:flex-row justify-center mt-12 space-x-7'>
                <div className='pl-7 lg:pl-0 space-y-2'>
                    <h1 className='text-xl'>Search a user</h1>
                    <input onChange={(e) => setSearch(e.target.value)} className='input input-bordered' placeholder='Search' type="search" name="search" id="" />
                </div>
                <section className='overflow-y-scroll'>
                {
                    data.map((user) => (
                        <div className='border rounded-lg w-[250px] lg:w-[350px] p-3 space-y-2' key={index++}>
                            <Link>
                            <h2>{user.name}</h2>
                            <p>{user.number}</p>
                            </Link>
                        </div>
                    ))
                }
                </section>
            </section>
        </>
    );
};

export default SendMoney;