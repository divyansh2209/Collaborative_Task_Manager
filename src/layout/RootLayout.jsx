import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import AddTaskModal from '../components/task/AddTaskModal';
import { Link } from 'react-router-dom';
import { child, get, onValue, ref } from 'firebase/database';
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoggedInUser, signOut } from '../components/auth/authSlice';
import picture from '../assests/download (13).png'
import toast from 'react-hot-toast';
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { Button } from "@material-tailwind/react";
import TasksTable from '../components/task/TasksTable'


const RootLayout = () => {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [isOpenTaskAddModal, setIsOpenTaskAddModal] = useState(false);
    const [assignedTasks, setAssignedTasks] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const loggedInUser = useSelector(selectLoggedInUser);
    const user = useSelector(selectLoggedInUser)
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const openTaskAddModal = () => {
        setIsOpenTaskAddModal(true);
    };
    const closeTaskAddModal = () => {
        setIsOpenTaskAddModal(false);
    };

    const handleSignOut = () => {
        dispatch(signOut());
    }

    const getAllTasks = () => {
        setLoading(true); // Set loading to true before fetching data

        const tasksRef = child(ref(db), 'tasks');

        onValue(tasksRef, (snapshot) => {
            setLoading(false); // Set loading to false after fetching data

            if (snapshot.exists()) {
                const tasks = snapshot.val();

                // Filter tasks based on assigned_user or user.uid
                const assignedTasksArray = [];
                const myTasksArray = [];

                Object.values(tasks).forEach((task) => {
                    if (task.assigned_user === loggedInUser.uid) {
                        assignedTasksArray.push(task);
                    }

                    if (task.user && task.user.uid === loggedInUser.uid) {
                        myTasksArray.push(task);
                    }

                });


                setAssignedTasks(assignedTasksArray);

                setMyTasks(myTasksArray);

                console.log('No data available');
            }
        }, {
            onlyOnce: false,
        });
    };


    useEffect(() => {
        getAllTasks();
    }, []);

    return (
        <>
            {loading && <p>Loading...</p>}
            {isOpenTaskAddModal && <AddTaskModal closeModal={closeTaskAddModal} />}
            <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                            <Transition.Child
                                as={Fragment}
                                enter="transition-opacity ease-linear duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity ease-linear duration-300"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0 bg-black bg-opacity-25" />
                            </Transition.Child>

                            <div className="fixed inset-0 z-40 flex">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transition ease-in-out duration-300 transform"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transition ease-in-out duration-300 transform"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                        <div className="flex items-center justify-between px-4">
                                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                            <button
                                                type="button"
                                                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                                onClick={() => setMobileFiltersOpen(false)}
                                            >
                                                <span className="sr-only">Close menu</span>
                                                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>                                        
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
                        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-3">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Task Manager</h1>

                            <div className="flex items-center">

                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">Open user menu</span>
                                            <img className="h-12 w-12 flex-none rounded-full bg-gray-50" src={picture} alt="" />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-10 mt-2 p-4  origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <div className="min-w-0 flex-auto">
                                                <p className="text-md hover:bg-gray-100 leading-6 text-gray-900">{user.displayName}</p>
                                                <p className="mt-1 mb-1 hover:bg-gray-100   truncate text-md leading-5">{user.email}</p>
                                                <button onClick={handleSignOut} className="align-start w-full text-md hover:bg-gray-100  " to='/'>Sign Out</button>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>

                            </div>
                        </div>

                        <section aria-labelledby="products-heading" className="pb-24 pt-6">

                            <div className="">

                                {/* Product grid */}
                                <div >
                                    <Button onClick={openTaskAddModal} className="flex items-center gap-3" size="sm">
                                        <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add New Task
                                    </Button>

                                    <h2 className=' mt-2 lg:mt-6 mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl'>My tasks</h2>

                                    <TasksTable myTasks={myTasks} assignedTasks={[]}></TasksTable>

                                    <h2 className=' mb-4 text-xl font-bold tracking-tight text-gray-900 sm:text-3xl'>Tasks Assigned to me</h2>

                                    <TasksTable myTasks={[]} assignedTasks={assignedTasks}></TasksTable>

                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    )
}

export default RootLayout