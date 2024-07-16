import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { axiosSecure } from '../../../Hooks/useAxiosSecure';

const ManageUsers = () => {

    let index = 1;

    const {data = [], refetch} = useQuery({
        queryKey: ['allUsers'],
        queryFn: async () => {
            const {data} = await axiosSecure.get('/allUsers');
            return data;
        }
    })

    console.log(data);

    const handleItemClick = async (status, email) => {

        console.log(status, email);
        
        try{
            const {data} = await axiosSecure.patch('/changeStatus', {status, email})
            console.log(data)
            refetch();
        }catch(err){
            console.error('Error changing status:', err);
        }

    }

    return (
        <>
            <div className="overflow-auto min-h-screen">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Number</th>
        <th>Email</th>
        <th>Account Status</th>
        <th>Change Status</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {
        data.map((user) => (
            <tr>
              <th>{index++}</th>
              <td>{user.name}</td>
              <td>{user.number}</td>
              <td>{user.email}</td>
              <td>{user.accountStatus}</td>
              <td><div className="dropdown dropdown-end">
  <div tabIndex={0} role="button" className="btn m-1">Change</div>
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    <li><a onClick={() => handleItemClick('Activated', user.email)}>Activated</a></li>
    <li><a onClick={() => handleItemClick('Blocked', user.email)}>Blocked</a></li>
  </ul>
</div></td>
          </tr>
        ))
      }
    </tbody>
  </table>
</div>
        </>
    );
};

export default ManageUsers;