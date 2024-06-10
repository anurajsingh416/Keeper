import React, {useState} from 'react';
import axiosInstance from '../utils/axiosInstance';
import {validate} from '../utils/validate';
import Header from '../components/Header';
import { FaRegEye,FaRegEyeSlash } from "react-icons/fa6";
import {Link, useNavigate} from 'react-router-dom';
function Register(){
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
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
        const {name,email,password} = formData;
        if(!name) {
            setError("Please enter Name!");
            return ;
        }
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
            const response = await axiosInstance.post('/register',{
                name,
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
                <h1>Register</h1>
                <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Name"
                    id=""
                />
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
                /> <span className='eye' style={{"top":"222px"}} onClick={togglePassword}>{showPassword?<FaRegEyeSlash />:<FaRegEye />}</span> 
                <input type="submit" className='login-btn' value="Register"/>
                {error && <p id='error'>{error}</p>}
                <p>
                    Already have a account? <Link to="/">Login</Link>
                </p>
            </form>
            
        </div>
        </>
    );
}
export default Register;