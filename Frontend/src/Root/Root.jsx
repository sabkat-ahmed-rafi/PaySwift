import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/Navbar/NavBar';


const Root = () => {
    return (
        <>
            <NavBar></NavBar>
            <Outlet></Outlet>
        </>
    );
};

export default Root;