import { useState, useEffect } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import axiosInstance from "../utils/axiosInstance";
import { validate } from "../utils/validate";
import {profileIcon} from "../utils/profileIcon";
import toast from "react-hot-toast";
export default function Profile({userInfo,onShow}) {
    let profilePic = profileIcon(userInfo.name);
    const [profile, setProfile] = useState({
        name: userInfo.name,
        email: userInfo.email,
        password: "",
        picture: profilePic
    });
    const [formData, setFormData] = useState({ ...profile });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setFormData({ ...profile });
    }, [profile]);

    function handleChange(event){
        const {name, value} = event.target;

        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))
    }
    async function handleSubmit(event){
        event.preventDefault();
        setError("")
        if(!validate(formData.email)){
            setError("Please enter a valid email");
            return;
        }
        try{
            const response = await axiosInstance.put('/update-userInfo',formData);
            if(response.data && response.data.user){
                toast.success(response.data.message);
                profilePic = profileIcon(response.data.user.name);
                setProfile(response.data.user);
                setIsEditing(false);
            }
        }catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    }
    return (
        <div className="profile">
            <p id="profile">{profilePic}</p>
            <IoCloseCircleOutline id="close" alt="close" onClick={()=>{
                onShow();
            }}/>
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name: </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}
                            onChange={handleChange}
                        
                            id="" />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        
                            id=""
                        />
                    </div>
                    <div>
                        <label>Set Password: </label>
                        <input
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        
                            id=""
                        />
                    </div>
                    {/* <div>
                        <label>Picture URL:</label>
                        <input
                            type="text"
                            name="picture"
                            value={formData.picture}
                            onChange={handleChange}
                        
                            id=""
                        />
                    </div> */}
                    <button type="submit">Save</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    
                    
                </form>
            ) : (
                <div>
                <h1>Profile</h1>
                <h2>{profile.name}</h2>
                <p>{profile.email}</p>
                <button onClick={()=>{ setIsEditing(true)}}>Edit Profile</button>
                </div>
            )}
            
        </div>
    );
}