export default function Event({event, index, onEventClick} : {event : any, index : number, onEventClick : any}) {
    if (event.type === 'focus') {
        return <>
            <div 
                key={index} 
                className="absolute w-[calc(100%-30px)] bg-cyan-400 rounded-md text-[#202020] overflow-hidden" 
                style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                onClick={() => onEventClick(event)}
            >
                <p className='pt-2 pl-2 text-xs font-semibold text-black truncate'>{event.title}</p>
                <p className='pl-2 text-xs text-black truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
            </div>
        </>
    }
    if (event.type === 'break') {
        return <>
            <div 
                key={index} 
                className="absolute w-[calc(100%-30px)] bg-[#405742] rounded-md text-[#202020] overflow-hidden" 
                style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                onClick={() => onEventClick(event)}
            >
                <p className='pt-2 pl-2 text-xs font-semibold text-white truncate'>{event.title}</p>
                <p className='pl-2 text-xs text-white truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
            </div>
        </>
    }
    if (event.type === 'meeting') {
        return <>
            <div 
                key={index} 
                className="absolute w-[calc(100%-30px)] bg-[#9370DB] rounded-md text-[#202020] overflow-hidden" 
                style={{ top: `${40 + (event.start.hour * 60) + event.start.minute}px`, height: `${(event.end.hour - event.start.hour) * 60 + event.end.minute - event.start.minute}px` }}
                onClick={() => onEventClick(event)}
            >
                <p className='pt-2 pl-2 text-xs font-semibold text-white truncate'>{event.title}</p>
                <p className='pl-2 text-xs text-white truncate'>{event.start.hour}:{event.start.minute > 9 ? event.start.minute : "0"+event.start.minute } - {event.end.hour}:{event.end.minute > 9 ? event.end.minute : "0"+event.end.minute } </p>
            </div>
        </>
    }
}