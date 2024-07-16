import React from 'react';
import useRole from '../../Hooks/useRole';
import AdminHome from './Admin/AdminHome';
import AgentHome from './Agent/AgentHome';
import UserHome from './User/UserHome';

const Dashboard = () => {

    const [role] = useRole()

    if(role === 'admin') return <AdminHome></AdminHome>
    if(role === 'agent') return <AgentHome></AgentHome>
    if(role === 'user') return <UserHome></UserHome>
};

export default Dashboard;