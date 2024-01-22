import React from 'react'
import { useForm } from 'react-hook-form';
import ChangeTaskStatus from "./TaskStatusChange";
import { get, ref, remove, set } from 'firebase/database';
import { db } from '../../firebase';
import toast from "react-hot-toast";


const TaskItemModal = ({ closeModal, task }) => {

    const {
        id,
        title,
        description,
        status,
        due_date,
        priority,
    } = task;

    const { register, handleSubmit, reset } = useForm();

    const handleDelete = () => {
        const taskRef = ref(db, `tasks/${task.id}`);

        remove(taskRef)
            .then(() => {
                toast.success('Task removed successfully');
                closeModal();
            })
            .catch((error) => {
                toast.error('Error removing task:', error);
            });
    }

    const onSubmit = (data) => {
        const { id, title, description, status, due_date, priority } = data;
        const taskRef = ref(db, `tasks/${task.id}`);

        get(taskRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentTaskData = snapshot.val();

                    // Modify only the required fields
                    currentTaskData.title = title;
                    currentTaskData.description = description;
                    currentTaskData.due_date = due_date;

                    // Update the task with the modified data
                    set(taskRef, currentTaskData)
                        .then(() => {
                            toast.success('Task updated successfully.');
                            closeModal()
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error('Error updating task.');
                        });
                } else {
                    console.log('Task not found');
                }
            })
            .catch((error) => {
                console.log(error);
                toast.error('Error fetching task data.');
            });
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 w-full h-screen p-4 overflow-x-hidden overflow-y-auto md:inset-0  flex justify-center bg-slate-900/60 items-center">
            <div className="relative w-full max-w-3xl max-h-full">
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
                    <div className="grid grid-cols-12 py-4">
                        <div className="col-span-6 p-6">
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
                                        defaultValue={title}
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
                                        defaultValue={description}
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
                                        Data
                                    </label>
                                    <input
                                        {...register("due_date")}
                                        defaultValue={due_date}
                                        type="date"
                                        name="due_date"
                                        id="data"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        placeholder="date"
                                        required
                                    />
                                </div>


                                <button
                                    type="submit"
                                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Save change Task
                                </button>
                            </form>
                            <button onClick={handleDelete} className="w-full mt-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Delete task
                            </button>
                        </div>
                        <div className="col-span-6 px-6 py-6 lg:px-8">
                            <label
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Change Task Status
                            </label>
                            <ChangeTaskStatus task_id={id} task_title={title} default_value={status} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TaskItemModal