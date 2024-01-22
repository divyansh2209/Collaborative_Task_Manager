import React, { useEffect, useState } from 'react'

import {
    ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Typography,
    CardBody,
    Chip,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";
import TaskItemModal from './TaskItemModal';
import { db } from '../../firebase';
import { get, ref } from 'firebase/database';
import toast from 'react-hot-toast';

const TasksTable = ({ myTasks, assignedTasks }) => {
    const [isOpenTaskItemModals, setIsOpenTaskItemModals] = useState(myTasks.map(() => false));
    const [assignedUserObjects, setAssignedUserObjects] = useState([]);
    const TaskList = myTasks.length === 0 ? assignedTasks : myTasks
    const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
    const [sortBy, setSortBy] = useState("due_date"); // default sort by due_date

    useEffect(() => {
        // Fetch user objects for assigned users
        const fetchUserObjects = async () => {
            const userObjects = await Promise.all(
                TaskList.map(async (task) => {
                    const userRef = ref(db, `users/${task.assigned_user}`);
                    try {
                        const snapshot = await get(userRef);
                        return snapshot.exists() ? snapshot.val() : null;
                    } catch (error) {
                        console.error(error);
                        toast.error('Error fetching user data.');
                        return null;
                    }
                })
            );
            setAssignedUserObjects(userObjects);
        };

        fetchUserObjects();
    }, [TaskList]);

    const sortTasks = () => {
        const sortedTasks = [...TaskList];

        sortedTasks.sort((a, b) => {
            const aValue = sortBy === "due_date" ? new Date(a[sortBy]) : a[sortBy];
            const bValue = sortBy === "due_date" ? new Date(b[sortBy]) : b[sortBy];

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });

        return sortedTasks;
    };


    const handleSortClick = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };


    const openTaskItemModal = (index) => {
        const updatedModals = [...isOpenTaskItemModals];
        updatedModals[index] = true;
        setIsOpenTaskItemModals(updatedModals);
    };

    const closeTaskItemModal = (index) => {
        const updatedModals = [...isOpenTaskItemModals];
        updatedModals[index] = false;
        setIsOpenTaskItemModals(updatedModals);
    };

    return (
        <div>
            <CardBody className="px-0 mb-6">
                <table className="w-full table-auto text-left">
                    <thead>
                        <tr>
                            <th
                                className=" border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    Title
                                </Typography>
                            </th>
                            <th
                                className=" border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors "
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    Description
                                </Typography>
                            </th>
                            <th onClick={() => handleSortClick("due_date")}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    Due Date
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                </Typography>
                            </th>
                            <th onClick={() => handleSortClick("status")}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    Status
                                    <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                </Typography>
                            </th>
                            <th
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors "
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    {TaskList === myTasks ? "Assignee" : "Assigneed By"}
                                </Typography>
                            </th>
                            <th
                                className={`${TaskList == assignedTasks ? 'hidden' : ''} border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50`}
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className={`flex items-center justify-between gap-2 font-normal leading-none opacity-70`}
                                >
                                </Typography>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortTasks().map((task, index) => {
                            const { title, description, status, due_date, user } = task;
                            const assigned_user_object = assignedUserObjects[index];
                            const isLast = index === myTasks.length - 1;
                            const classes = isLast ? "p-4 pb-0" : "p-4 border-b border-blue-gray-50";

                            return (
                                <React.Fragment key={title}>
                                    {isOpenTaskItemModals[index] && (
                                        <TaskItemModal task={task} closeModal={() => closeTaskItemModal(index)} />
                                    )}

                                    <tr key={title}>
                                        <td className={`${classes} `}>
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-bold"
                                                    >
                                                        {title}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col w-max">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {description}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {due_date}
                                                </Typography>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <div className="w-max">
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={status === 'pending' ? "Pending" : "Completed"}
                                                    color={status === 'pending' ? "red" : "green"}
                                                />
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {TaskList === myTasks ? assigned_user_object?.username : user.displayName}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} ${TaskList == assignedTasks ? 'hidden' : ''}` }>
                                            <Tooltip content="Edit Task">
                                                <IconButton variant="text" onClick={() => openTaskItemModal(index)}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </IconButton>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
        </div>
    );
};

export default TasksTable;