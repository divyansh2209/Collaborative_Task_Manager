import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import React from 'react';
import { useForm } from 'react-hook-form';
import { auth } from '../../firebase';
import toast from 'react-hot-toast';

const PasswordResetModal = ({closeModal}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await sendPasswordResetEmail(auth, data.email);
            closeModal();
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <div className="fixed top-0 left-0 right-0 z-50 w-full h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0  flex justify-center bg-slate-900/60 items-center">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-[white] rounded-lg shadow">
                        <div className="px-6 py-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900">Reset Password</h3>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                                action="#"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Email
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Send Password Reset Email
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetModal;
