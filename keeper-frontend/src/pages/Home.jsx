import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Note from "../components/Note";
import CreateArea from "../components/CreateArea";
import Search from "../components/Search";
import Profile from "../components/Profile";
import moment from "moment";
import NoNotes from "../components/NoNotes";
import toast, { Toaster } from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

function Home() {
  const [notes, setNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    title: "",
    content: "",
  });
  const [revealNotes, setReveal] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  

  async function handleAdd(inputArea) {
    if (isEditing) {
      try{
        const response = await axiosInstance.put('/updateNote',inputArea);
      setNotes((prev) => {
        return [...prev, response.data.note]
      });
      getAllNotes();
      toast.success("Note Updated Successfully");
      setIsEditing(false);
      setCurrentNote({ id: null, title: "", content: "" });
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        toast.error(error.response.data.message);
      }
    }
    } else {
      try{
        const response = await axiosInstance.post('/add-note',inputArea);
        if(response.data && response.data.note){
          setNotes((prev) => {
            return [...prev, response.data.note];
          });
          toast.success(response.data.message);
        }
      }catch(error){
        if(error.response && error.response.data && error.response.data.message){
          toast.error(error.response.data.message);
        }
      }
    }
  }
  async function handleDelete(id) {
    // setNotes((prev) => {
    //   return prev.filter((note, index) => index !== id);
    // });
    try{
      const response = await axiosInstance.delete('deleteNote/'+id);
      if(response.data && response.data.message)
      getAllNotes();
      toast.success(response.data.message);
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        toast.error(error.response.data.message);
      }
    }
  }
  function handleEdit(id) {
    setIsEditing(true);
    const EditNote = notes.find(note => note._id === id);
    setCurrentNote({
      id: EditNote._id,
      title: EditNote.title,
      content: EditNote.content,
    });
  }
  function handleSearch(searchTerm) {
    const results = notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    results.length === 0
      ? toast.error("Note not found!")
      : toast.success("Note found!");
    setSearchResults(results);
  }
  function toggle() {
    isSearching ? setIsSearching(false) : setIsSearching(true);
  }
  const getAllNotes = async () =>{
    try{
      const response = await axiosInstance.get('/get-AllNotes');
      if(response.data && response.data.notes){
        setNotes(response.data.notes);
      }
    }catch(error){
      if(error.response && error.response.data && error.response.data.message){
        console.log(error.response.data.message);
      }
    }
  }

  const getUserInfo = async ()=>{
    try{
      const response = await axiosInstance.get('/get-userInfo');
      if(response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    }catch(error){
      console.error(error);
      if(error.response && error.response.status === 401){
        localStorage.removeItem("token");
        navigate("/");
    }
  }
}
  

  useEffect(()=>{
    getUserInfo();
    getAllNotes();
  },[]);
  
  function showProfileCard() {
    setShowCard(!showCard);
    setReveal(!revealNotes);

  }
  return (
    <div className="container">
      <Header onToggle={toggle} onShow={showProfileCard} />
      {isSearching && <Search onSearch={handleSearch} />}
      {showCard && <Profile  userInfo={userInfo}  onShow={showProfileCard} />}
      <CreateArea
        onAdd={handleAdd}
        currentNote={currentNote}
        isEditing={isEditing}
      />

      {(searchResults.length > 0 ? searchResults : notes).map((note, index) => (
        revealNotes && <Note
          key={index}
          id={note._id}
          title={note.title}
          date={moment(note.createdOn).format("D MMMM YYYY")}
          content={note.content}
          onDelete={handleDelete}
          onUpdate={handleEdit}
        />
      ))}
      {notes.length === 0 && <NoNotes />}

      <Toaster position="bottom-right" reverseOrder={false} />
      {/* <Footer /> */}
    </div>
  );
}

export default Home;
