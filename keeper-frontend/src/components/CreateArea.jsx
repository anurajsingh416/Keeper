import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { IoCloseCircleOutline } from "react-icons/io5";
function CreateArea({ onAdd, currentNote, isEditing }) {
    const [inputArea, setInputArea] = useState({
        title: "",
        content: "",
    });
    const [isEmpty, setIsEmpty] = useState(false);
    const [area, setArea] = useState(false);
    useEffect(() => {
        if (isEditing) {
            setArea(true);
            setInputArea({
                id: currentNote.id,
                title: currentNote.title,
                content: currentNote.content,
            });
        } else {
            setInputArea({
                id: null,
                title: "",
                content: "",
            });
        }
    }, [isEditing, currentNote]);

    function handleChange(event) {
        const { name, value } = event.target;
        setInputArea((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    }
    function handleSubmit(event){
        event.preventDefault();
                    if(inputArea.title =="" && inputArea.content==""){
                        setIsEmpty(true);
                        toast.error('Note is empty')
                    }else{
                        setIsEmpty(false);
                        onAdd(inputArea);
                    }
                    
                    setInputArea({
                        title: "",
                        content: ""
                        })
    }
    const emptyStyle={
        border:"2px solid red"
    }
    return (
        
        <div>
            {area?(
            <form
            style={isEmpty?emptyStyle:null}
                onSubmit={handleSubmit}
            >
                <IoCloseCircleOutline onClick={()=>{setArea(false)}} style={{float:"right",fontSize:"1.5em"}}/>
                <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    value={inputArea.title}
                    placeholder="Title"
                    id=""
                    style={{fontWeight:"600"}}
                />
                <textarea
                    name="content"
                    onChange={handleChange}
                    value={inputArea.content}
                    placeholder="Take a note..."
                    rows="5"
                    id=""
                ></textarea>
                <button type="submit" style={{fontWeight:"600"}}>{isEditing?"Update":" Add"}</button>
            </form>
            ):<button type="button" className="button" onClick={()=>{
                setArea(true);
            }}> Add</button>}
        </div>
    );
}
export default CreateArea;