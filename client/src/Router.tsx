import { HashRouter, Routes, Route } from "react-router-dom";

import Template from "./pages/Template.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Client from "./pages/Client.tsx";
import Project from "./pages/Project.tsx";
import { io } from "socket.io-client";
import ProjectManagement from "./pages/ProjectManagement.tsx";

const socket = io("http://localhost:3210");

export default function Router() {
    return (
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<Template />}>
                        <Route path="" element={<Home />} />
                        <Route path="timer" element={<div>Timer</div>} />
                        <Route path="project" element={<Project />} />
                        <Route path="project/:id" element={<ProjectManagement />} />
                        <Route path="client" element={<Client />} />
                    </Route>
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </HashRouter>
        </>
    );
}

export { socket };