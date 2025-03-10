import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState, useEffect, useRef } from "react"
import axios from "axios"

export default function ProjectManagement(){
    const { id } = useParams()
    const project = useSelector((state : any) => state.project.projects)
    const [projectData, setProjectData] = useState<any>({})
    const [tasks, setTasks] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const pendingRef = useRef<HTMLInputElement>(null)
    const inProgressRef = useRef<HTMLInputElement>(null)
    const completedRef = useRef<HTMLInputElement>(null)

    const [pendingTask, setPendingTask] = useState<string>("")
    const [inProgressTask, setInProgressTask] = useState<string>("")
    const [completedTask, setCompletedTask] = useState<string>("")

    useEffect(() => {
        setLoading(true)
        setError(null)
        axios.get(`http://localhost:3210/api/projects/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log(res.data)
            setProjectData(res.data)
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setError("Failed to fetch project data")
            setLoading(false)
        })
        const projectDatas = project.find((p : any) => p._id === id)
        setProjectData(projectDatas)
    }, [project, id])

    useEffect(() => {
        axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log(res.data)
            setTasks(res.data)
        }).catch((err) => {
            console.log(err)
            setError("Failed to fetch tasks")
        })
    }, [id])

    function createPendingTask(e : any){
        // if I type enter on the input field
        if (e.key !== "Enter") return
        // if the input field is empty
        if (!pendingTask) return
        axios.post(`http://localhost:3210/api/tasks`, {
            name: pendingTask,
            status: "pending",
            project: id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data)
                setTasks(res.data)
                setPendingTask("")
                // empty the input
                pendingRef.current!.value = ""
            }).catch((err) => {
                console.log(err)
                setError("Failed to fetch tasks")
            })
        }).catch((err) => {
            console.log(err)
            setError("Failed to create task")
        })
    }

    function createInProgressTask(e : any){
        // if I type enter on the input field
        if (e.key !== "Enter") return
        // if the input field is empty
        if (!inProgressTask) return
        axios.post(`http://localhost:3210/api/tasks`, {
            name: inProgressTask,
            status: "in-progress",
            project: id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data)
                setTasks(res.data)
                setInProgressTask("")
                // empty the input
                inProgressRef.current!.value = ""
            }).catch((err) => {
                console.log(err)
                setError("Failed to fetch tasks")
            })
        }).catch((err) => {
            console.log(err)
            setError("Failed to create task")
        })
    }
    function createCompletedTask(e : any){
        // if I type enter on the input field
        if (e.key !== "Enter") return
        // if the input field is empty
        if (!completedTask) return
        axios.post(`http://localhost:3210/api/tasks`, {
            name: completedTask,
            status: "completed",
            project: id
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data)
                setTasks(res.data)
                setCompletedTask("")
                // empty the input
                completedRef.current!.value = ""
            }).catch((err) => {
                console.log(err)
                setError("Failed to fetch tasks")
            })
        }).catch((err) => {
            console.log(err)
            setError("Failed to create task")
        })
    }

    function toPending(task : any){
        axios.put(`http://localhost:3210/api/tasks/${task._id}`, {
            status: "pending"
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data)
                setTasks(res.data)
            }).catch((err) => {
                console.log(err)
                setError("Failed to fetch tasks")
            })
        }).catch((err) => {
            console.log(err)
            setError("Failed to update task")
        })
    }

    function toInProgress(task : any){
        axios.put(`http://localhost:3210/api/tasks/${task._id}`, {
            status: "in-progress"
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                console.log(res.data)
                setTasks(res.data)
            }).catch((err) => {
                console.log(err)
                setError("Failed to fetch tasks")
            })
        }).catch((err) => {
            console.log(err)
            setError("Failed to update task")
        })
    }

    function toCompleted(task : any){
        axios.put(`http://localhost:3210/api/tasks/${task._id}`, {
            status: "completed"
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((_) => {
            axios.get(`http://localhost:3210/api/tasks/project/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then((res) => {
                setTasks(res.data)
            }).catch((_) => {
                setError("Failed to fetch tasks")
            })
        }).catch((_) => {
            setError("Failed to update task")
        })
    }

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return <div className="w-10/12 mx-auto">
        <h1 className="text-2xl">Project Management - {projectData.name}</h1>
        <div className="mt-10 w-full h-[calc(100vh-180px)] flex justify-between">
            <div className="w-[30%] h-fit max-h-full bg-[#1C1B23] rounded-2xl overflow-y-scroll flex flex-col gap-4 relative">
                <div className="w-full min-h-12 h-12 flex items-center">
                    <div className="w-2 h-full bg-indigo-300 rounded-tl-2xl">
                    </div>
                    <p className="tracking-wide font-semibold pl-4">Pending</p>
                </div>
                {tasks.filter((task) => task.status === "pending").map((task) => (
                    <div className="bg-white min-h-16 w-11/12 mx-auto rounded-2xl">
                        <p className="p-4 text-black tracking text-sm">{task.name}</p>
                        <div className="text-black flex justify-between w-full pb-2.5 px-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 invisible">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <div onClick={() => toInProgress(task)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
                <input ref={pendingRef} onKeyDown={(e) => createPendingTask(e)} onChange={(e) => setPendingTask(e.target.value)} placeholder="Add a task" className="w-full py-3 px-4 rounded-b-2xl" type="text" />
            </div>
            <div className="w-[30%] h-fit max-h-full bg-[#1C1B23]  rounded-2xl overflow-y-scroll flex flex-col gap-4">
                <div className="w-full h-12  flex items-center">
                    <div className="w-2 h-full bg-orange-300 rounded-tl-2xl">
                    </div>
                    <p className="tracking-wide font-semibold pl-4">In progress</p>
                </div>
                {tasks.filter((task) => task.status === "in-progress").map((task) => (
                    <div className="bg-white min-h-16 w-11/12 mx-auto rounded-2xl">
                        <p className="p-4 text-black tracking text-sm">{task.name}</p>
                        <div className="text-black flex justify-between w-full pb-2.5 px-4">
                            <div onClick={() => toPending(task)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                            <div onClick={() => toCompleted(task)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
                <input ref={inProgressRef} placeholder="Add a task" onKeyDown={(e) => createInProgressTask(e)} onChange={(e) => setInProgressTask(e.target.value)} className="w-full py-3 px-4 rounded-b-2xl" type="text" />
            </div>
            <div className="w-[30%] h-fit max-h-full bg-[#1C1B23] rounded-2xl overflow-y-scroll flex flex-col gap-4">
                <div className="w-full h-12 flex items-center">
                    <div className="w-2 h-full bg-green-300 rounded-tl-2xl">
                    </div>
                    <p className="tracking-wide font-semibold pl-4">Completed</p>
                </div>
                {tasks.filter((task) => task.status === "completed").map((task) => (
                    <div className="bg-white min-h-16 w-11/12 mx-auto rounded-2xl">
                        <p className="p-4 text-black tracking text-sm">{task.name}</p>
                        <div className="text-black flex justify-between w-full pb-2.5 px-4">
                            <div onClick={() => toInProgress(task)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 invisible">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                ))}
                <input ref={completedRef} placeholder="Add a task" onKeyDown={(e) => createCompletedTask(e)} onChange={(e) => setCompletedTask(e.target.value)} className="w-full py-3 px-4 rounded-b-2xl" type="text" />
            </div>
        </div>
    </div>
}