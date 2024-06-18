import { IoSearch } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function Header({onToggle,onShow}){
    const navigate = useNavigate();
    function handleLogout(){
        localStorage.clear();
        navigate("/")
    }
    return (
        <header>
            <h1>Keeper</h1>
            <div className="buttons">
            <button className="search-icon search-svg" style={{borderRadius:"40px",padding:"0px"}}>
            <IoSearch title="search" fontSize="30px" onClick={()=>{
                onToggle();
            }} />
            </button>
            <button className="profile-icon" style={{borderRadius:"40px",padding:"0px"}} onClick={()=>{
                onShow();
            }}>
                <MdOutlineAccountCircle title="Profile" fontSize={"25px"}/>
            </button>
            <button style={{color:"#ff0000c9",background:"none",border:"none",outline:"none"}} onClick={handleLogout}>
            <MdLogout title="Logout" fontSize="30px"/>
            </button>
            </div>
        </header>
    )
}
export default Header;
