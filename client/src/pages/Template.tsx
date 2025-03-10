import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModalStartSession, closeModalStartSession, closeModalCreateClient, closeModalCreateProject, closeModalModifyEvent, updateActualEvent } from "../redux/modalSlice";
import { initClients } from "../redux/clientSlice";
import { initProject } from "../redux/projectSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../Router";
import { RootState } from "../store";
import { addEvent } from "../redux/calendarSlice";
import { addCalendar } from "../redux/calendarSlice";
import { addClientTimer } from "../redux/calendarSlice";
import { addProjectTimer } from "../redux/calendarSlice";


export default function Template() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const day = useSelector((state: any) => state.calendar.day);
    const modalStartSession = useSelector((state: RootState) => state.modal.modalStartSession);
    const modalCreateClient = useSelector((state: RootState) => state.modal.modalCreateClient);
    const modalCreateProject = useSelector((state: RootState) => state.modal.modalCreateProject);
    const modalModifyEvent = useSelector((state: RootState) => state.modal.modalModifyEvent);

    const modifiedEvent = useSelector((state: RootState) => state.modal.modifiedActualEvent);

    const [remainingTime, setRemainingTime] = useState<number | null>(null);

    const [timer, setTimer] = useState<any>({
        duration: 30,
        goal: "",
        project: "",
        client: "",
        type: "focus"
    });

    const [isSessionRunning, setIsSessionRunning] = useState<boolean>(false);

    const [client, setClient] = useState<any>({
        name: "",
        color: ""
    });

    const [project, setProject] = useState<any>({
        name: "",
        color: "",
        client : ""
    });

    const clients = useSelector((state: RootState) => state.client.clients);
    const projects = useSelector((state: RootState) => state.project.projects);
    const actualEvent = useSelector((state: RootState) => state.modal.actualEvent);

    useEffect(() => {
        var token = localStorage.getItem("token");
        if (!token) {
            // redirect with react router dom to /login page
            navigate("/login");
        }
        else {
            axios.get("http://localhost:3210/api/users/profile", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                console.log(res.data);
                localStorage.setItem("userId", res.data._id);
            }).catch((err) => {
                console.log(err);
                localStorage.removeItem("token");
                window.location.href = "/login";

            })
        }
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("timer_update", (data) => {
            setRemainingTime(data.remainingTime);
            setIsSessionRunning(true)
        });
        socket.on("timer_ended", () => {
            setRemainingTime(null);
            setIsSessionRunning(false);
            axios.get('http://localhost:3210/api/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    var data = [] as any[];
                    res.data.forEach((event: any) => {
                        var item = {
                            id : event._id,
                            start: { hour: 0, minute: 0 },
                            end: { hour: 0, minute: 0 },
                            title: '',
                            type: '',
                            startTime: '',
                            endTime: '',
                        }
                        // endTime "2025-02-17T16:10:18.545Z"
                        const startTime = new Date(event.startTime);
                        const endTime = new Date(event.endTime);
                        // I want to remove 1 hour from the start time and the end time
                        item.start.hour = startTime.getHours();
                        item.start.minute = startTime.getMinutes();
                        item.end.hour = endTime.getHours();
                        item.end.minute = endTime.getMinutes();
                        item.title = event.goal;
                        item.type = event.type;
                        // item.startTime = startTime.toISOString(); + 1 hour
                        var startPlusOneHour = new Date(startTime);
                        startPlusOneHour.setHours(startTime.getHours() + 1);
                        var endPlusOneHour = new Date(endTime);
                        endPlusOneHour.setHours(endTime.getHours() + 1);
                        item.startTime = startPlusOneHour.toISOString();
                        item.endTime = endPlusOneHour.toISOString();
                        // if the date is not today, skip
                        if (startTime.getDate() !== day.getDate()) return;
                        data.push(item);
                    });
                    dispatch(addEvent(data));
                })
                .catch(err => console.log(err));
        });
        socket.on("timer_stopped", () => {
            setRemainingTime(null);
            setIsSessionRunning(false);
            axios.get('http://localhost:3210/api/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    var data = [] as any[];
                    res.data.forEach((event: any) => {
                        var item = {
                            id : event._id,
                            start: { hour: 0, minute: 0 },
                            end: { hour: 0, minute: 0 },
                            title: '',
                            type: '',
                            startTime: '',
                            endTime: '',
                        }
                        // endTime "2025-02-17T16:10:18.545Z"
                        const startTime = new Date(event.startTime);
                        const endTime = new Date(event.endTime);
                        // I want to remove 1 hour from the start time and the end time
                        item.start.hour = startTime.getHours();
                        item.start.minute = startTime.getMinutes();
                        item.end.hour = endTime.getHours();
                        item.end.minute = endTime.getMinutes();
                        item.title = event.goal;
                        item.type = event.type;
                        // item.startTime = startTime.toISOString(); + 1 hour
                        var startPlusOneHour = new Date(startTime);
                        startPlusOneHour.setHours(startTime.getHours() + 1);
                        var endPlusOneHour = new Date(endTime);
                        endPlusOneHour.setHours(endTime.getHours() + 1);
                        item.startTime = startPlusOneHour.toISOString();
                        item.endTime = endPlusOneHour.toISOString();
                        // if the date is not today, skip
                        if (startTime.getDate() !== day.getDate()) return;
                        data.push(item);
                    });
                    dispatch(addEvent(data));
                })
                .catch(err => console.log(err));
        });

        axios.get('http://localhost:3210/api/clients', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            dispatch(initClients(res.data));
        }).catch(err => {
            console.log(err);
        })

        axios.get('http://localhost:3210/api/projects', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(res => {
            dispatch(initProject(res.data));
        }).catch(err => {
            console.log(err);
        })

    }, [])

    function onChangeClient(e : any){
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    }

    function onChangeTimer(e : any){
        setTimer({
            ...timer,
            [e.target.name]: e.target.value
        });
    }

    function onStartSessionSubmit(e : any){
        e.preventDefault();
        console.log("Start Session for", timer.duration, "minutes");
        socket.emit("start_timer", timer.duration , timer.goal, localStorage.getItem("userId"), timer.type, timer.client, timer.project);
        dispatch(closeModalStartSession());
    }

    function onEndSession(){
        socket.emit("stop_timer");
    }

    function onChangeActualEvent(e: any) {
        dispatch(updateActualEvent({ [e.target.name]: e.target.value }));
    }

    /* function connectCalendar(){
        axios.get("http://localhost:3210/api/google/auth-url", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((res) => {
            console.log(res.data);
            window.location.href = res.data.url;
        }).catch((err) => {
            console.log(err);
        })
    } */

    function onAddClient(e : any){
        e.preventDefault();
        axios.post('http://localhost:3210/api/clients', client, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(_ => {
            axios.get('http://localhost:3210/api/clients', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                dispatch(initClients(res.data));
                dispatch(closeModalCreateClient());
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    function onChangeProject(e : any){
        setProject({
            ...project,
            [e.target.name]: e.target.value
        });
    }

    function onAddProject(e : any){
        e.preventDefault();
        axios.post('http://localhost:3210/api/projects', project, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(_ => {
            axios.get('http://localhost:3210/api/projects', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                dispatch(initProject(res.data));
                dispatch(closeModalCreateProject());
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    function updateSession(e : any){
        e.preventDefault();
        var startTime = null;
        var endTime = null;
        if (actualEvent.startTime === modifiedEvent.startTime) {
            // startTime is not modified so date - 1 hour
            startTime = new Date(modifiedEvent.startTime);
            startTime.setHours(startTime.getHours() - 1);
        }
        else {
            startTime = new Date(modifiedEvent.startTime);
        }
        if (actualEvent.endTime === modifiedEvent.endTime) {
            // endTime is not modified so date + 1 hour
            endTime = new Date(modifiedEvent.endTime);
            endTime.setHours(endTime.getHours() - 1);
        }
        else {
            endTime = new Date(modifiedEvent.endTime);
        }
        var item = {
            ...modifiedEvent,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString()
        }
        axios.put(`http://localhost:3210/api/sessions/${actualEvent.id}`, item, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(_ => {
            axios.get('http://localhost:3210/api/sessions', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then(res => {
                    var data = [] as any[];
                    res.data.forEach((event: any) => {
                        var item = {
                            id : event._id,
                            start: { hour: 0, minute: 0 },
                            end: { hour: 0, minute: 0 },
                            title: '',
                            type: '',
                            startTime: '',
                            endTime: '',
                        }
                        // endTime "2025-02-17T16:10:18.545Z"
                        const startTime = new Date(event.startTime);
                        const endTime = new Date(event.endTime);
                        // I want to remove 1 hour from the start time and the end time
                        item.start.hour = startTime.getHours();
                        item.start.minute = startTime.getMinutes();
                        item.end.hour = endTime.getHours();
                        item.end.minute = endTime.getMinutes();
                        item.title = event.goal;
                        item.type = event.type;
                        // item.startTime = startTime.toISOString(); + 1 hour
                        var startPlusOneHour = new Date(startTime);
                        startPlusOneHour.setHours(startTime.getHours() + 1);
                        var endPlusOneHour = new Date(endTime);
                        endPlusOneHour.setHours(endTime.getHours() + 1);
                        item.startTime = startPlusOneHour.toISOString();
                        item.endTime = endPlusOneHour.toISOString();
                        // if the date is not today, skip
                        if (startTime.getDate() !== day.getDate()) return;
                        data.push(item);
                    });
                    dispatch(addEvent(data));
                })
                .catch(err => console.log(err));
    
            axios.get('http://localhost:3210/api/google/events', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                if (res.status === 200) {
                    var data = [] as any[];
                    res.data.forEach((event: any) => {
                        var item = {
                            start: { hour: 0, minute: 0 },
                            end: { hour: 0, minute: 0 },
                            title: '',
                        }
                        var startTime = new Date(event.start.dateTime);
                        var endTime = new Date(event.end.dateTime);
                        item.start.hour = startTime.getHours();
                        item.start.minute = startTime.getMinutes();
                        item.end.hour = endTime.getHours();
                        item.end.minute = endTime.getMinutes();
                        item.title = event.summary;
                        if (startTime.getDate() !== day.getDate()) return;
                        data.push(item);
                    });
                    dispatch(addCalendar(data));
                }
            }).catch(err => {
                console.log(err);
            })
    
            axios.get('http://localhost:3210/api/client-timers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                console.log(res.data);
                var data = [] as any[];
                var item = {
                    start: { hour: 0, minute: 0 },
                    end: { hour: 0, minute: 0 },
                    title: '',
                    color: '',
                }
                res.data.forEach((event: any) => {
                    var startTime = new Date(event.startTime);
                    var endTime = new Date(event.endTime);
                    item.start.hour = startTime.getHours();
                    item.start.minute = startTime.getMinutes();
                    item.end.hour = endTime.getHours();
                    item.end.minute = endTime.getMinutes();
                    item.title = event.client.name;
                    item.color = event.client.color;
                    if (startTime.getDate() !== day.getDate()) return;
                    data.push(item);
                });
                dispatch(addClientTimer(data));
            }).catch(err => {
                console.log(err);
            })
    
            axios.get('http://localhost:3210/api/project-timers', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }).then(res => {
                console.log(res.data);
                var data = [] as any[];
                var item = {
                    start: { hour: 0, minute: 0 },
                    end: { hour: 0, minute: 0 },
                    title: '',
                    color: '',
                }
                res.data.forEach((event: any) => {
                    var startTime = new Date(event.startTime);
                    var endTime = new Date(event.endTime);
                    item.start.hour = startTime.getHours();
                    item.start.minute = startTime.getMinutes();
                    item.end.hour = endTime.getHours();
                    item.end.minute = endTime.getMinutes();
                    item.title = event.project.name;
                    item.color = event.project.color;
                    if (startTime.getDate() !== day.getDate()) return;
                    data.push(item);
                });
                dispatch(addProjectTimer(data));
                dispatch(closeModalModifyEvent());
            }).catch(err => {
                console.log(err);
            })
        })
    }

    return (
        <>
            {modalModifyEvent && <div className='top-0 left-0 fixed bg-black/50 h-full w-full z-[60] flex items-center justify-center'>
                <div className='bg-[#121117] border border-[rgb(61,59,70)] w-3/12 h-3/12 overflow-x-scroll'>
                    <div className="flex justify-between w-11/12 mx-auto mt-2 text-white items-center">
                        <h1 className="text-xl truncate">{modifiedEvent.title}</h1>
                        <p onClick={() => dispatch(closeModalModifyEvent())}>X</p>
                    </div>
                    <form onSubmit={(e) => updateSession(e)} className='p-6 text-white' method="get">
                        <div className="flex justify-between mt-6">
                            <input type="datetime-local" name="startTime" id="startTime" className="bg-[#2B2A30] p-3 tracking-wider w-[45%]" value={modifiedEvent.startTime.slice(0,16)} onChange={onChangeActualEvent} />
                            <input type="datetime-local" name="endTime" id="endTime" className="bg-[#2B2A30] p-3 tracking-wider w-[45%]" value={modifiedEvent.endTime.slice(0,16)} onChange={onChangeActualEvent} />
                        </div>
                        <div className='flex justify-end gap-2 mt-8'>
                            <button onClick={() => dispatch(closeModalModifyEvent())} type="reset" className='text-[#E0E0E0] bg-[#3D3B46] py-2 px-8 rounded-full'>Cancel</button>
                            <button type='submit' className='bg-[#373350] py-2 px-8 rounded-full'>Change Time</button>
                        </div>
                    </form>
                </div>
            </div>}
            {modalStartSession && (<div className='text-white fixed top-0 left-0 bg-black/80 w-screen h-screen z-50 flex items-center justify-center'>
                <div className='w-[500px] bg-[#121117] rounded-lg border border-[#3D3B46]'>
                    <div className='flex items-center justify-between'>
                        <h1 className='p-6 text-3xl font-semibold'>Start Focus</h1>
                        <button onClick={() => dispatch(closeModalStartSession())} className='p-6'>X</button>
                    </div>
                    <form onSubmit={(e) => onStartSessionSubmit(e)} className='p-6' method="get">
                        <p className='mb-2'>Duration</p>
                        <select onChange={onChangeTimer} name="duration" id="duration" className='bg-[#2B2A30] w-full p-3'>
                            <option value="30">30min</option>
                            <option defaultChecked value="45">45min</option>
                            <option value="60">1h</option>
                            <option value="90">1h30</option>
                            <option value="120">2h</option>
                        </select>
                        <p className='mb-2 mt-5'>Goal</p>
                        <textarea placeholder="Enter a goal for this session" name="goal" onChange={onChangeTimer} className='bg-[#2B2A30] w-full resize-none rounded p-3 font-extralight' rows={4} id=""></textarea>
                        <select onChange={onChangeTimer} name="project" id="project" className='bg-[#2B2A30] w-full p-3 mt-3 font-light'>
                            <option defaultChecked value="">No project</option>
                            {projects.map((project: any) => (
                                <option value={project._id}>{project.name}</option>
                            ))}
                        </select>
                        <select onChange={onChangeTimer} name="client" id="client" className='bg-[#2B2A30] w-full p-3 mt-4 font-light'>
                            <option defaultChecked value="">No client</option>
                            {clients.map((client: any) => (
                                <option value={client._id}>{client.name}</option>
                            ))}
                        </select>
                        <select onChange={onChangeTimer} name="type" id="type" className='bg-[#2B2A30] w-full p-3 mt-4 font-light'>
                            <option defaultChecked value="focus">Focus</option>
                            <option value="meeting">Meeting</option>
                            <option value="break">Break</option>
                        </select>
                        <div className='flex justify-end gap-2 mt-6'>
                            <button onClick={() => dispatch(closeModalStartSession())} type="reset" className='text-[#E0E0E0] bg-[#3D3B46] py-2 px-8 rounded-full'>Cancel</button>
                            <button type='submit' className='bg-[#373350] py-2 px-8 rounded-full'>Start Focus</button>
                        </div>
                    </form>
                </div>
            </div>)}
            {modalCreateProject && (<div className='text-white fixed top-0 left-0 bg-black/80 w-screen h-screen z-50 flex items-center justify-center'>
                <div className='w-[500px] bg-[#121117] rounded-lg border border-[#3D3B46]'>
                    <div className='flex items-center justify-between'>
                        <h1 className='p-6 text-3xl font-semibold'>Create project</h1>
                        <button onClick={() => dispatch(closeModalCreateProject())} className='p-6'>X</button>
                    </div>
                    <form onSubmit={(e) => onAddProject(e)} className='p-6' method="get">
                        <p className='mb-2'>Name of the project</p>
                        <input onChange={(e) => onChangeProject(e)} type="text" name="name" id="name" placeholder="Name" className="bg-[#2B2A30] w-full p-3" />
                        <p className='mb-2 mt-5'>Color</p>
                        <select onChange={(e) => onChangeProject(e)} name="color" id="color" className='bg-[#2B2A30] w-full p-3 mt-1 font-light'>
                            <option defaultChecked value="red">Red</option>
                            <option value="orange">Orange</option>
                            <option value="yellow">Yellow</option>
                            <option value="lime">Lime</option>
                            <option value="green">Green</option>
                            <option value="cyan">Cyan</option>
                            <option value="blue">Blue</option>
                            <option value="indigo">Indigo</option>
                        </select>
                        <p className='mb-2 mt-5'>Client</p>
                        <select onChange={(e) => onChangeProject(e)} name="client" id="client" className='bg-[#2B2A30] w-full p-3 mt-1 font-light'>
                            <option defaultChecked value="">No client</option>
                            {clients.map((client: any) => (
                                <option value={client._id}>{client.name}</option>
                            ))}
                        </select>
                        <div className='flex justify-end gap-2 mt-6'>
                            <button onClick={() => dispatch(closeModalCreateProject())} type="reset" className='text-[#E0E0E0] bg-[#3D3B46] py-2 px-8 rounded-full'>Cancel</button>
                            <button type='submit' className='bg-[#373350] py-2 px-8 rounded-full'>Create Project</button>
                        </div>
                    </form>
                </div>
            </div>)}
            {modalCreateClient && (<div className='text-white fixed top-0 left-0 bg-black/80 w-screen h-screen z-50 flex items-center justify-center'>
                <div className='w-[500px] bg-[#121117] rounded-lg border border-[#3D3B46]'>
                    <div className='flex items-center justify-between'>
                        <h1 className='p-6 text-3xl font-semibold'>Create client</h1>
                        <button onClick={() => dispatch(closeModalCreateClient())} className='p-6'>X</button>
                    </div>
                    <form onSubmit={(e) => onAddClient(e)} className='p-6' method="get">
                        <p className='mb-2'>Name of the client</p>
                        <input onChange={(e) => onChangeClient(e)} type="text" name="name" id="name" placeholder="Name" className="bg-[#2B2A30] w-full p-3" />
                        <p className='mb-2 mt-5'>Color</p>
                        <select onChange={(e) => onChangeClient(e)} name="color" id="color" className='bg-[#2B2A30] w-full p-3 mt-1 font-light'>
                            <option defaultChecked value="red">Red</option>
                            <option value="orange">Orange</option>
                            <option value="yellow">Yellow</option>
                            <option value="lime">Lime</option>
                            <option value="green">Green</option>
                            <option value="cyan">Cyan</option>
                            <option value="blue">Blue</option>
                            <option value="indigo">Indigo</option>
                        </select>
                        <div className='flex justify-end gap-2 mt-6'>
                            <button onClick={() => dispatch(closeModalCreateClient())} type="reset" className='text-[#E0E0E0] bg-[#3D3B46] py-2 px-8 rounded-full'>Cancel</button>
                            <button type='submit' className='bg-[#373350] py-2 px-8 rounded-full'>Create Client</button>
                        </div>
                    </form>
                </div>
            </div>)}
            <div className="bg-[#121117] flex text-[#E0E0E0]">
                <aside className="h-[calc(100vh-64px)] w-12 border-r border-[#3D3B46]">
                    <div className="flex flex-col w-full mx-auto">
                        <NavLink className={({isActive, isPending}) => isPending ? "w-full px-3 py-2.5 hover:bg-[#3D3B46]" : isActive ? "w-full px-3 py-2.5 bg-[#3D3B46]" : "w-full px-3 py-2.5 hover:bg-[#3D3B46]"} to="/">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#E0E0E0]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </NavLink>    
                        {/* <NavLink className={({isActive, isPending}) => isPending ? "w-full px-3 py-2.5 hover:bg-[#3D3B46]" : isActive ? "w-full px-3 py-2.5 bg-[#3D3B46]" : "w-full px-3 py-2.5 hover:bg-[#3D3B46]"} to="/timer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#E0E0E0]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </NavLink>    */} 
                        <NavLink className={({isActive, isPending}) => isPending ? "w-full px-3 py-2.5 hover:bg-[#3D3B46]" : isActive ? "w-full px-3 py-2.5 bg-[#3D3B46]" : "w-full px-3 py-2.5 hover:bg-[#3D3B46]"} to="/project">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#E0E0E0]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                            </svg>
                        </NavLink>    
                        <NavLink className={({isActive, isPending}) => isPending ? "w-full px-3 py-2.5 hover:bg-[#3D3B46]" : isActive ? "w-full px-3 py-2.5 bg-[#3D3B46]" : "w-full px-3 py-2.5 hover:bg-[#3D3B46]"} to="/client">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-[#E0E0E0]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9 9 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                            </svg>
                        </NavLink>    
                    </div>
                </aside>
                <main className="p-6 w-full h-[calc(100vh-64px)]">
                    <Outlet />
                </main>
            </div>
            <div className="h-16 flex bg-[#1C1B23] px-6 gap-3 items-center">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                    </svg>
                </button>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
                    </svg>
                </button>
                <button className="text-white font-semibold">
                    {remainingTime !== null ? `Remaining: ${Math.floor(remainingTime / 60)}:${remainingTime % 60 > 9 ? remainingTime % 60 : "0"+remainingTime % 60 }` : "Paused"}
                </button>
                {isSessionRunning ? <button onClick={onEndSession} className="bg-[#3B3D46] text-white h-fit py-1 px-4 rounded-full text-xs">Stop Session</button> : <button onClick={() => dispatch(openModalStartSession())} className="bg-[#3B3D46] text-white h-fit py-1 px-4 rounded-full text-xs">Start Session</button> }
                {/* <button onClick={(e) => connectCalendar()} className="text-white">
                    Google
                </button> */}
            </div>
        </>
    );
}