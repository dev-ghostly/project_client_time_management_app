import { useDispatch, useSelector } from "react-redux";
import { openModalCreateClient } from "../redux/modalSlice";
import Client from "../components/Client";

export default function Clients() {
    const dispatch = useDispatch();
    const clients = useSelector((state: any) => state.client.clients);
    const clientTimer = useSelector((state: any) => state.calendar);

    function displayClientTimer(){
        console.log(clientTimer)
    }

    return (
        <div className="w-10/12 mx-auto">
            <div className="flex justify-between">
                <h1 onClick={displayClientTimer} className="text-2xl">Client</h1>
                <button onClick={() => dispatch(openModalCreateClient())} className='bg-[#373350] py-2 px-8 rounded-full'>Create</button>
            </div>
            <div className="w-full h-[calc(100vh-180px)] mt-5 overflow-y-scroll">
                {clients.map((client: any) => (
                            <Client client={client} />
                ))}
            </div>
        </div>
    );
}