import { useState } from "react";
import {MdDelete, MdModeEdit} from "react-icons/md";


function Note({id,title,date,content,onDelete,onUpdate,color}){
    const [showMore, setShowMore] = useState(false);
    const text = content;
    const trimmedContent = showMore ? content : text.slice(0,100);
    const noteStyle = {
        backgroundColor:color
    }
    
    return (
        <div className="note" style={noteStyle}>
            <h1>{title} </h1>
            <span id="date">{date}</span> 
            <p>{trimmedContent}</p>
            {
                showMore?(<a className="showMore" onClick={()=>{setShowMore(false)}}>Show Less</a>):(<a className="showMore" onClick={()=>{setShowMore(true)}}>Show More... </a>)
            }
            
            <button onClick={()=>{
                onDelete(id);
            }} id="delete"><MdDelete title="Delete" style={{fontSize:"1.4em"}} /></button>
            <button onClick={()=>{
                onUpdate(id); 
            }} id="edit"><MdModeEdit title="Edit" style={{fontSize:"1.4em"}} /></button>
        </div>
    )
}
export default Note;