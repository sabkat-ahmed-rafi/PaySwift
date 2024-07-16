import React, { useContext } from 'react';
import { ImSpinner3 } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Authentication';

const Login = () => {


    const loading = false;
    const navigate = useNavigate();
    const {login} = useContext(AuthContext)

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const form = e.target
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password)

      try {
       login(email, password)
       navigate('/')
      }catch(err) {
        console.log(err)
      }
    };

    return (
        <section className='flex justify-center items-center min-h-screen lg:mx-0'>
            <section className='flex w-[700px] flex-col justify-center items-center rounded-3xl  bg-slate-100 shadow-lg shadow-[#E2126D]'>
            <section className="pt-2 flex justify-center items-center space-x-3">
        <h1 className="lg:text-4xl font-extrabold text-2xl text-pretty">
          Log in
        </h1>
      </section>
      <section className="flex flex-col justify-center items-center pb-8">
        <form onSubmit={handleSubmit} className="pt-5 space-y-2">
          <div className="pb-1">
            <p className='pb-1'>Email or Phone Number</p>
            <input
              name="email"
              size="lg"
              type="text"
              label="User Name"
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
          <div className='pt-4'>
            <button type='submit' className="btn w-full text-white font-bold bg-[#E2126D] ">
            {loading? <ImSpinner3 className="animate-spin mx-auto text-white size-6" /> : "Sign Up"}
            </button>
          </div>
        </form>        
          <div className="pt-2 italic text-center">
            <p>
              Already Have an Account? <Link to={"/register"}>Create</Link>
            </p>
          </div>
      </section>
            </section>
        </section>
    );
};

export default Login;