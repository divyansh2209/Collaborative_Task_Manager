import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser, signInAsync } from './authSlice';
import toast from "react-hot-toast";
import PasswordResetModal from '../task/PasswordResetModal';
import { Button } from "@material-tailwind/react";

const Login = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectLoggedInUser);

    const [IsOpenResetForm, setIsOpenResetForm] = useState(false);

    const openResetForm = () => {
        setIsOpenResetForm(true);
    };
    const closeResetForm = () => {
        setIsOpenResetForm(false);
    };





    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        dispatch(signInAsync(data));
    };



    return (
        <>
            {user && <Navigate to="/" replace={true}></Navigate>}

            <div>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Sign in to your account
                        </h2>
                    </div>
                    {/* {IsOpenResetForm && <PasswordResetModal closeModal={closeResetForm} ></PasswordResetModal>} */}

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block  text-start text-sm font-medium leading-6 text-gray-900">
                                    Email address
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        {...register("email", { required: true })}
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <button onClick={openResetForm} className="font-semibold text-zinc-950 hover:text-zinc-700">
                                            Forgot password?
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        {...register("password", { required: true })}
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="flex w-full justify-center rounded-mdpx-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Not a member?{' '}
                            <Link to='/signup' className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Register</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login