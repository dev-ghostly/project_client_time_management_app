import { useState, useEffect } from "react"

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

export default function Client({client} : {client : any}){

    const [lastActivity, setLastActivity] = useState('')

    useEffect(() => {
        var lastActivityDate = new Date(client.lastActivityDate)
        setLastActivity(lastActivityDate.toDateString())
    }, [])

    return <div className="bg-[#1C1B23] h-24 w-full flex rounded-lg">
        <div className={`h-full w-2 ${colorClasses[client.color] || "bg-gray-500"}`}>

        </div>
        <div className="p-5 w-4/12">
            <p className="text-gray-300/50 text-sm tracking-wide">Project</p>
            <p className="mt-1 font-semibold text-lg">{client.name}</p>
        </div>
        <div className="p-5 w-2/12">
            <p className="text-gray-300/50 text-sm tracking-wide">Last activity</p>
            <p className="mt-1 font-semibold text-lg">{lastActivity}</p>
        </div>
        <div className="p-5 w-5/12">
            <p className="text-gray-300/50 text-sm tracking-wide">Time (Total)</p>
            <p className="mt-1 font-semibold text-lg">{client.totalTimeSpent}min</p>
        </div>
        <div className="flex h-full w-1/12 items-center justify-end mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
            </svg>
        </div>
    </div>
}