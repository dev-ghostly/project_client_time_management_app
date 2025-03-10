import { useDispatch, useSelector } from "react-redux";
import { openModalCreateProject } from "../redux/modalSlice";
import Project from "../components/Project";

export default function Projects() {
    const dispatch = useDispatch();
    const projects = useSelector((state: any) => state.project.projects);

    return (
        <div className="w-10/12 mx-auto">
            <div className="flex justify-between">
                <h1 className="text-2xl">Projects</h1>
                <button onClick={() => dispatch(openModalCreateProject())} className='bg-[#373350] py-2 px-8 rounded-full'>Create</button>
            </div>
            <div className="w-full h-[calc(100vh-180px)] mt-5 overflow-y-scroll flex flex-col gap-3">
                    {projects.map((project: any) => (
                               <Project project={project} />
                            ))}
                    
            </div>
        </div>
    );
}