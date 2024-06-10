
import { MdOutlineNoteAdd } from "react-icons/md";
export default function NoNotes(){
    return (
        <div className="no-notes">
            <div><MdOutlineNoteAdd style={{fontSize:"200px",color:"#aaa"}}/>
            <p>No Notes Yet</p>
            <p>Lets get Started</p>
            </div>
        </div>
    );
}