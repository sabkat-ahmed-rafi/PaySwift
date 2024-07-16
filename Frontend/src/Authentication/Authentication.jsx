import React, { createContext, useEffect, useState } from 'react';
import { axiosSecure } from '../Hooks/useAxiosSecure';



export const AuthContext = createContext();

const Authentication = ({ children }) => {


    const [user, setUser] = useState(null);


    // login existing user 
    const login = async (email, password) => {
        try {
          const response = await axiosSecure.post('/jwt', { email, password }, { withCredentials: true });
          if (response.data.success) {
            await checkAuthState();
          }
          return response
        } catch (error) {
          console.error('Login failed:', error);
        }
      };


    //   creating a new user by the given
      const signup = async (email, password, name, role, number) => {
        try {
          const response = await axiosSecure.post('/signup', { email, password, name, role, number }, { withCredentials: true });
          if (response.data.success) {
            await checkAuthState();
          }
        } catch (error) {
          console.error('Signup failed:', error);
        }
      };


    //   logout a user 
      const logout = async () => {
        try {
          const response = await axiosSecure.get('/logout', { withCredentials: true });
          if (response.data.success) {
            setUser(null);
          }
        } catch (error) {
          console.error('Logout failed:', error);
        }
      };



      const checkAuthState = async () => {
        try {
          const response = await axiosSecure.get('/verify-token', { withCredentials: true });
          setUser(response.data.user);
          console.log(response.data.user)
        } catch (error) {
          setUser(null);
          console.log(error.message)
        }
      };
    
      useEffect(() => {
        checkAuthState();
      }, []);



    return (
        <>
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
        </>
    );
};

export default Authentication;