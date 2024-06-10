import React, {useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {validate} from '../utils/validate';
import Header from '../components/Header';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa6";
import {Link, useNavigate} from 'react-router-dom';
function Login(){
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    function handleChange(event){
        const {name, value} = event.target;
        setFormData((prev)=>{
            return {
                ...prev,
                [name]:value
            }
        });
    }

    async function handleSubmit(event){
        event.preventDefault();
        const {email,password} = formData;
        
        if(!validate(email)||!email) {
            setError("Please enter valid email!");
            return ;
        }
        if(!password) {
            setError("Please enter valid password!");
            return ;
        }
        setError("");

        try{
            const response = await axiosInstance.post('/login',{
                email,
                password
            });
            console.log(response);
            if(response.data && response.data.error){
                setError(response.data.error);
                return;
            }

            if(response.data && response.data.accessToken){
                localStorage.setItem("token", response.data.accessToken);
                navigate("/home");
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }
    function togglePassword(){
        setShowPassword(!showPassword);
    }
    return (
        <>
            <header>
                <h1>Keeper</h1>
            </header>
        <div style={{display: "grid",placeItems: "center",height: "85vh"}}>
            <form
                className='login-form'
                onSubmit={handleSubmit}
            >
                <h1>Login</h1>
                
                <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    placeholder="Email"
                    id=""
                />
                <input
                    type={showPassword?"text":"password"}
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    placeholder="Password"
                    id=""
                /> <span className='eye' onClick={togglePassword}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</span> 
                
                <input type="submit" className='login-btn' value="Login"/>
                {error && <p id='error'>{error}</p>}
                <p>
                    New User? <Link to="/register">Register</Link>
                </p>
            </form>
            
        </div>
        </>
    );
}
export default Login;