import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { format } from "date-fns";


const UserTransaction = () => {

    let index = 1;

    const {user} = useAuth()
    

    const {data = [], refetch} = useQuery({
        queryKey: ['userTransaction', user?.email],
        queryFn: async () => {
            const {data} = await axiosSecure.get(`/userTransaction/${user?.email}`);
            return data;
        }
    })

    return (
        <>
        <h1 className='text-3xl text-[#E2126D] font-bold text-center'>Transactions</h1>
             <div className="overflow-auto min-h-screen">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Number</th>
        <th>Email</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        data.map((user) => (
            <tr key={user._id}>
              <th>{index++}</th>
              <td>{user.receiverNumber}</td>
              <td>{user.receiverEmail}</td>
              <td>{user.amount} TK</td>
              <td>{user.type}</td>
              <td>{format(new Date(user.date), "MM/dd/yyyy")}</td> 
          </tr>
        ))
      }
    </tbody>
  </table>
</div>
        </>
    );
};

export default UserTransaction;