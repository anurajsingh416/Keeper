import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axiosInstance from "./utils/axiosInstance";

export default function App(){
    return(
        <Router>
            <Routes>
                <Route exact path='/home' element={<Home />} />
                <Route exact path='/' element={<Login />} />
                <Route exact path='/register' element={<Register />} />
            </Routes>
        </Router>
    )
}