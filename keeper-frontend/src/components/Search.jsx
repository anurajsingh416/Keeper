import React, { useState } from "react";
import search from "../assets/search.svg"
import { IoSearch } from "react-icons/io5";
function Search({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState(null);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (<div className="search">
            <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleChange}
            />
            <button type="button" className="search-icon" onClick={()=>{
                onSearch(searchTerm);
            }}><IoSearch fontSize="30px" /></button>
            </div>
    );
}

export default Search;
