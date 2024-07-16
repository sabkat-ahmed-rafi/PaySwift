import React from 'react';
import { ImSpinner3 } from 'react-icons/im'
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';

const Register = () => {

    const loading = false; 
    const {signup, user} = useAuth();
    const navigate = useNavigate()

    // console.log(user.password)

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const form = e.target
        const name = form.name.value;
        const password = form.password.value;
        const number = form.number.value;
        const email = form.email.value;
        const role = form.role.value;

        console.log(name, password, email, role, number)

        signup(email, password, name, role, number)
        navigate('/')
    };

    return (
        <>
            <section className="pt-2 flex justify-center items-center space-x-3">
        <h1 className="lg:text-4xl font-extrabold text-2xl text-pretty">
          Create an account
        </h1>
      </section>
      <section className="flex flex-col justify-center items-center pb-8">
        <form onSubmit={handleSubmit} className="pt-5 space-y-2">
          <div className="pb-1">
            <p className='pb-1'>Name</p>
            <input
              name="name"
              size="lg"
              type="text"
              label="User Name"
              className='input input-bordered w-full'
            />
          </div>
          <div className="pb-1">
          <p className='pb-1'>Email</p>
            <input
              name="email"
              size="lg"
              type="email"
              label="Email"
              className='input input-bordered w-full'
            />
          </div>
          <div className="pb-1">
          <p className='pb-1'>Mobile Number</p>
            <input
              name="number"
              size="lg"
              type="number"
              label="number"
              className='input input-bordered w-full'              
            />
          </div>
          <div className="w-[400px] pb-1">
          <p className='pb-1'>Pin</p>
            <input
              name="password"
              size="lg"
              type="number"
              label="Password"
              className='input input-bordered w-full'              
            />
          </div>
          <div className="">
          <p className='pb-1'>Select Role</p>
            <select
            name='role'
            defaultValue={'user'}
              className="select select-bordered w-full max-w-xs"
            >
              <option disabled>
                Select Role
              </option>
              <option value={'agent'}>agent</option>
              <option value={'user'}>user</option>
            </select>
          </div>
          <div className='pt-4'>
            <button className="btn w-full text-white font-bold bg-[#E2126D] ">
            {"Sign Up"}
            </button>
          </div>
        </form>        
          <div className="pt-2 italic text-center">
            <p>
              Already Have an Account? <Link to={"/login"}>Log in</Link>
            </p>
          </div>
      </section>
        </>
    );
};

export default Register;