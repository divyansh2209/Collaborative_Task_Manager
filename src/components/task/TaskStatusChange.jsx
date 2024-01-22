import { child, get, ref, set } from 'firebase/database';
import React, { useState } from 'react'
import { db } from '../../firebase';
import toast from "react-hot-toast";


const TaskStatusChange = ({ task_id, task_title ,default_value }) => {

    console.log(`task_title:${task_title} and default_value:${default_value}`)

    const [status, setStatus] = useState(default_value);

    function handleStatusChange(value, taskId) {
        setStatus(value);

        const taskRef = ref(db, `tasks/${task_id}`);

        // Fetch the current task data
        get(taskRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentTaskData = snapshot.val();

                    // Modify only the status field
                    currentTaskData.status = value;

                    // Update the task with the modified data
                    set(taskRef, currentTaskData)
                        .then(() => {
                            toast.success("Task status changed.");
                            // Assuming setRefetch is a function to trigger a refetch
                        })
                        .catch((error) => {
                            console.error(error);
                            toast.error("Error changing task status.");
                        });
                } else {
                    console.log("Task not found");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Error fetching task data.");
            });
    }

    return (
        <div className="">
            <select
                onChange={(e) => handleStatusChange(e.target.value, task_id)}
                id="status"
                value={status}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
        </div>
    )
}

export default TaskStatusChange