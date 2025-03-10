import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { addEvent, updateDay, addCalendar, addClientTimer, addProjectTimer } from '../redux/calendarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Event } from '../redux/calendarSlice';
import { openModalModifyEvent, setActualEvent, setModifiedActualEvent, openModalCreateSession, closeModalCreateSession } from '../redux/modalSlice';
import EventComponent from '../components/Event';

export default function Home() {

    const colorClasses : any = {
        red : 'bg-red-300',
        orange: 'bg-orange-300',
        yellow: 'bg-yellow-300',
        lime : "bg-lime-300",
        green: 'bg-green-300',
        cyan : 'bg-cyan-300',
        blue : 'bg-blue-300',
        indigo: 'bg-indigo-300',
    }

    const actualTimeBar = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
    const [todayString, setTodayString] = useState('');
    const dispatch = useDispatch();
    const day = useSelector((state: any) => state.calendar.day);
    const events = useSelector((state: any) => state.calendar.events);
    const calendar = useSelector((state: any) => state.calendar.calendar);
    const projectTimer = useSelector((state: any) => state.calendar.project_timer);
    const clientTimer = useSelector((state: any) => state.calendar.client_timer);
    const projects = useSelector((state: any) => state.project.projects);
    const clients = useSelector((state: any) => state.client.clients);

    const modalCreateSession = useSelector((state: any) => state.modal.modalCreateSession);

    // Define actual hour and actual minute at this exact moment and make it updating every minutes
    const [actualHour, setActualHour] = useState(new Date().getHours());
    const [actualMinute, setActualMinute] = useState(new Date().getMinutes());

    const [newSession, setNewSession] = useState({
        startTime: '',
        endTime: '',
        goal: '',
        project: '',
        client: '',
        type: 'focus',
    })

    setInterval(() => {
        setActualHour(new Date().getHours());
        setActualMinute(new Date().getMinutes());
    }, 60000);

    useEffect(() => {
        setActualHour(new Date().getHours());
        setActualMinute(new Date().getMinutes());
        setTodayString(day.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
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
        }).catch(err => {
            console.log(err);
        })

        if (actualTimeBar.current && calendarRef.current) {
            const topOffset = actualTimeBar.current.getBoundingClientRect().top;
            const heightOfCalendar = calendarRef.current.getBoundingClientRect().height;
            calendarRef.current.scrollTo({ top: topOffset - heightOfCalendar/2, behavior: 'instant' });
        }
    }, [day])

    function dayTomorrow() {
        const newDay = new Date(day);
        newDay.setDate(newDay.getDate() + 1);
        dispatch(updateDay(newDay));
    }

    function dayYesterday() {
        const newDay = new Date(day);
        newDay.setDate(newDay.getDate() - 1);
        dispatch(updateDay(newDay));
    }

    function dayToday() {
        dispatch(updateDay(new Date()));
    }

    function openEventModal(event : Event) {
        dispatch(openModalModifyEvent());
        dispatch(setActualEvent(event));
        dispatch(setModifiedActualEvent(event));
    }

    function onNewSessionChange(e : any) {
        setNewSession({ ...newSession, [e.target.name]: e.target.value });
    }

    function onNewSessionSubmit(e : any) {
        e.preventDefault();
        axios.post('http://localhost:3210/api/sessions', {
            startTime: newSession.startTime,
            endTime: newSession.endTime,
            goal: newSession.goal,
            project: newSession.project,
            client: newSession.client,
            type: newSession.type,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        }).then(_ => {
            dispatch(closeModalCreateSession());
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
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <>
            {modalCreateSession && <div className='text-white fixed top-0 left-0 bg-black/80 w-screen h-screen z-50 flex items-center justify-center'>
                <div className='w-[500px] bg-[#121117] rounded-lg border border-[#3D3B46]'>
                    <div className='flex items-center justify-between'>
                        <h1 className='p-6 text-3xl font-semibold'>Start Focus</h1>
                        <button onClick={() => dispatch(closeModalCreateSession())} className='p-6'>X</button>
                    </div>
                    <form className='p-6' method="get" onSubmit={(e) => onNewSessionSubmit(e)}>
                        <p className='mb-2'>Duration</p>
                        <div className="flex justify-between mt-6">
                            <input type="datetime-local" name="startTime" id="startTime" onChange={onNewSessionChange} className="bg-[#2B2A30] p-3 tracking-wider w-[45%]" />
                            <input type="datetime-local" name="endTime" id="endTime" onChange={onNewSessionChange} className="bg-[#2B2A30] p-3 tracking-wider w-[45%]"/>
                        </div>
                        <p className='mb-2 mt-5'>Goal</p>
                        <textarea placeholder="Enter a goal for this session" name="goal" onChange={onNewSessionChange} className='bg-[#2B2A30] w-full resize-none rounded p-3 font-extralight' rows={4} id=""></textarea>
                        <select onChange={onNewSessionChange} name="project" id="project" className='bg-[#2B2A30] w-full p-3 mt-3 font-light'>
                            <option defaultChecked value="">No project</option>
                            {projects.map((project: any) => (
                                <option value={project._id}>{project.name}</option>
                            ))}
                        </select>
                        <select onChange={onNewSessionChange} name="client" id="client" className='bg-[#2B2A30] w-full p-3 mt-4 font-light'>
                            <option defaultChecked value="">No client</option>
                            {clients.map((client: any) => (
                                <option value={client._id}>{client.name}</option>
                            ))}
                        </select>
                        <select onChange={onNewSessionChange} name="type" id="type" className='bg-[#2B2A30] w-full p-3 mt-4 font-light'>
                            <option defaultChecked value="focus">Focus</option>
                            <option value="meeting">Meeting</option>
                            <option value="break">Break</option>
                        </select>
                        <div className='flex justify-end gap-2 mt-6'>
                            <button onClick={() => dispatch(closeModalCreateSession())} type="reset" className='text-[#E0E0E0] bg-[#3D3B46] py-2 px-8 rounded-full'>Cancel</button>
                            <button type='submit' className='bg-[#373350] py-2 px-8 rounded-full'>Start Focus</button>
                        </div>
                    </form>
                </div>
            </div>}
            <div className='flex justify-between'>
                <h1 className="text-white pb-6 font-bold text-lg">{todayString}</h1>
                <div className='flex gap-5'>
                    <div className='flex text-white text-sm'>
                        <button className='bg-[#1C1B23] h-fit px-4 py-2 rounded-l-2xl'>Day</button>
                        <button className='bg-[#1C1B23] h-fit px-4 py-2'>Week</button>
                        <button className='bg-[#1C1B23] h-fit px-4 py-2'>Month</button>
                        <button className='bg-[#1C1B23] h-fit px-4 py-2 rounded-r-2xl'>Year</button>
                    </div>
                    <button className='bg-[#1C1B23] h-fit px-3 rounded-full py-2 text-white text-sm'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                    </button>
                    <div className='flex'>
                        <button onClick={dayYesterday} className='bg-[#1C1B23] h-fit px-3 py-2 text-white text-sm rounded-l-3xl'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <button onClick={dayToday} className='bg-[#1C1B23] h-fit px-3 py-2 text-white text-sm'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                            </svg>
                        </button>
                        <button onClick={dayTomorrow} className='bg-[#1C1B23] h-fit px-3 py-2 text-white text-sm rounded-r-3xl'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex w-full h-[calc(100%-16px)] justify-between'>
                <div className='w-5/8'>
                    <div className="h-10 w-full text-white rounded-t-md flex">
                        <div className="w-16 flex items-center pl-5 border border-stone-800 rounded-tl-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                            </svg>
                        </div>
                        <div className="group w-[calc(25%-2.5px)] flex items-center px-5 border border-stone-800 text-sm justify-between">
                            <p>Activity</p>
                        </div>
                        <div className="group w-[calc(25%-2.5px)] flex items-center px-5 border border-stone-800 text-sm justify-between">
                            <p>Tags</p>
                        </div>
                        <div className="group w-[calc(25%-2.5px)] flex items-center px-5 border border-stone-800 text-sm justify-between">
                            <p>Sessions</p>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={() => dispatch(openModalCreateSession())}>
                                <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth={1.5} 
                                stroke="currentColor" 
                                className="size-4"
                                >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M12 4.5v15m7.5-7.5h-15" 
                                />
                                </svg>
                            </button>
                        </div>
                        <div className="group w-[calc(25%-2.5px)] flex items-center px-5 border border-stone-800 text-sm justify-between">
                            <p>Calendar</p>
                        </div>
                        <div className="w-[10px] flex items-center border-t border-r border-b border-stone-800 rounded-tr-xl">
                        </div>
                    </div>
                    <div className="w-full h-[calc(100%-96px)] border border-stone-800 rounded-b-xl overflow-y-scroll relative" ref={calendarRef}>
                        <div className="h-[1470px] flex">
                            <div className="h-full w-16 relative text-stone-400">
                                {hours.map((hour, index) => (
                                    <p 
                                        key={index} 
                                        className="absolute left-5 text-xs" 
                                        style={{ top: `${30 + index * 60}px` }}
                                    >
                                        {hour}
                                    </p>
                                ))}
                            </div>
                            <div className="w-full relative">
                                {day.getDate() === new Date().getDate() && <div
                                    id='actualTime'
                                    ref={actualTimeBar}
                                    className='absolute border-white border h-0.5 w-[calc(100%-32px)] rounded-md ml-4 z-10'
                                    style={{ top: `${40 + (actualHour * 60) + actualMinute}px` }}
                                ></div>}
                                <div className="absolute h-full w-full flex">
                                    <div className="w-[calc(25%)] flex pl-2 hover:bg-[#101010]/50 relative z-10">
                                        
                                    </div>
                                    <div className="w-[calc(25%)] flex pl-2 hover:bg-[#101010]/50 relative z-10 ">
                                        <div className='relative w-1/2'>
                                            {clientTimer.map((event : any, index : any) => (
                                                <div 
                                                    key={index} 
                                                    className={`absolute w-[calc(100%-10px)] ${colorClasses[event.color] || "bg-gray-500"} rounded-md text-[#202020] overflow-hidden`}
                                                    style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                                                >
                                                    <p className='pt-2 pl-2 text-xs font-semibold text-black truncate'>{event.title}</p>
                                                    <p className='pl-2 text-xs text-black truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='relative w-1/2'>
                                            {projectTimer.map((event : any, index : any) => (
                                                <div 
                                                    key={index} 
                                                    className={`absolute w-[calc(100%-10px)] ${colorClasses[event.color] || "bg-gray-500"} rounded-md text-[#202020] overflow-hidden`}
                                                    style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                                                >
                                                    <p className='pt-2 pl-2 text-xs font-semibold text-black truncate'>{event.title}</p>
                                                    <p className='pl-2 text-xs text-black truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-[calc(25%)] flex pl-3 hover:bg-[#101010]/50 relative z-10">
                                        {events.map((event : Event, index : any) => (
                                            <EventComponent onEventClick={() => openEventModal(event)} event={event} index={index} key={index}/>
                                        ))}
                                    </div>
                                    <div className="w-[calc(25%)] flex pl-2 hover:bg-[#101010]/50 relative z-10">
                                        {calendar.map((event : any, index : any) => (
                                            <div 
                                                key={index} 
                                                className="absolute w-[calc(100%-30px)] bg-amber-600 rounded-md text-[#202020] overflow-hidden" 
                                                style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                                            >
                                                <p className='pt-2 pl-2 text-xs font-semibold text-white truncate'>{event.title}</p>
                                                <p className='pl-2 text-xs text-white truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {hours.map((_, index) => (
                                    <p 
                                        key={index} 
                                        className="absolute left-4 h-[1px] w-[calc(100%-32px)] border border-stone-400" 
                                        style={{ top: `${40 + index * 60}px` }}
                                    >
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-[calc(2.7/8*100%)] bg-[#1C1B23] h-1/2 mt-2 rounded-md'>

                </div>
            </div>
        </>
    );
}