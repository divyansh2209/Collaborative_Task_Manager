import { child, get, ref, set } from 'firebase/database';
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../auth/authSlice';
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";
import { Link, Navigate } from 'react-router-dom';

const AddTaskModal = ({ closeModal }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [usersList, setUsersList] = useState([]);
    const LoggedInuser = useSelector(selectLoggedInUser);

    const getUserList = () => {
        get(child(ref(db), 'users'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const users = snapshot.val();
    
                    // Filter out the logged-in user
                    const filteredUsers = Object.values(users).filter(
                        (user) => user.id !== LoggedInuser.uid
                    );
    
                    console.log(filteredUsers);
                    setUsersList(filteredUsers);
                } else {
                    console.log('No data available');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };
    

    useEffect(() => {
        getUserList();
    }, []);

    function getPriorityColor(priority) {
        let color = "";
        if (priority === "high") {
            color = "bg-red-600";
        } else if (priority === "medium") {
            color = "bg-blue-600";
        } else {
            // for low
            color = "bg-green-600";
        }
        return color;
    }

    async function onSubmit(data) {
        // console.log(data)
        try {
            const { title, description, due_date, assigned_user } = data;
            const taskId = uuidv4();

            const newTask = {
                id: taskId,
                title,
                description,
                due_date,
                assigned_user,
                status: 'pending',
                user: {
                    uid: LoggedInuser.uid,
                    displayName: LoggedInuser.displayName,
                    email: LoggedInuser.email,
                },
            };

            // Simulating an asynchronous API call (replace this with your actual API call)
            await set(ref(db, 'tasks/' + taskId), newTask);

            reset();
            toast.success('Task added successfully.');
            closeModal();
        } catch (error) {
            // Handle form validation errors
            console.error('Error:', error);
            toast.error('An error occurred. Please try again later.',);
        }
    }

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 w-full h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0  flex justify-center bg-slate-900/60 items-center">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow">
                        <button
                            onClick={closeModal}
                            type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-full text-sm w-8 h-8 ml-auto inline-flex justify-center items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>

                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900">
                                Add new task
                            </h3>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6"
                                action="#"
                            >
                                <div>
                                    <label
                                        htmlFor="title"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Task title
                                    </label>
                                    <input
                                        {...register("title")}
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="Enter task title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Task description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        name="description"
                                        id="description"
                                        rows="4"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter task description"
                                    ></textarea>
                                </div>

                                <div>
                                    <label
                                        htmlFor="date"
                                        className="block mb-2 text-sm font-medium text-gray-900"
                                    >
                                        Date
                                    </label>
                                    <input
                                        {...register("due_date")}
                                        type="date"
                                        name="due_date"
                                        id="data"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="date"
                                        required
                                    />
                                </div>

                                <div className="mb-3 col-3 me-3">
                                    <label htmlFor="assigned_user" className="form-label mr-2">
                                        Assigned User
                                    </label>
                                    <select
                                        {...register('assigned_user')}
                                        className="form-select rounded-xl pt-1 pb-1"
                                        aria-label="Default select example"
                                        onChange={(e) => setValue('assigned_user', e.target.value)}
                                    >
                                        <option className=''>Select User</option>
                                        {usersList.map((item) => {
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {`${item.username} (${item.email})`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Add Task
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddTaskModal