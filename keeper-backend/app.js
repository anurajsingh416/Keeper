const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/db');
const jwt = require("jsonwebtoken");
// const User = require("./model/User");
// const Note = require("./model/Note");
const bcrypt = require("bcrypt");
// const authenticationToken = require("./utilities/authenticationToken");
require("dotenv").config();
const cors = require('cors');
const PORT = 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.get("/", (req, res) => {
    res.send("Hello, world!");
})

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(401).json({ error: true, message: "Name Required" });
    }
    if (!password) {
        return res.status(401).json({ error: true, message: "Password Required" });
    }
    if (!email) {
        return res.status(401).json({ error: true, message: "Email Required" });
    }

    const ExistingUser = await User.findOne({ email });

    if (ExistingUser) {
        return res.status(401).json({ error: true, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const accessToken = jwt.sign({ user: newUser }, process.env.SECRET_KEY, {
        expiresIn: "36000m"
    });

    return res.status(200).json({
        error: false,
        newUser,
        accessToken,
        message: "Registration Successful",
    })
});

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email) {
        return res.status(401).json({ error: true, message: "Email Required" });
    }
    if (!password) {
        return res.status(401).json({ error: true, message: "Password Required" });
    }
    try{

    const ExistingUser = await User.findOne({ email });

    if (!ExistingUser) {
        return res.status(400).json({ message: "User not found" })
    }
    const userPassword = ExistingUser.password;
    const isValidPassword = await bcrypt.compare(password,userPassword);
    
    if (!isValidPassword) {
        return res.status(401).json({
            error: true,
            message: "Invalid Password"
        })
    }
        const accessToken = jwt.sign({ user: ExistingUser }, process.env.SECRET_KEY, {
            expiresIn: "36000m"
        });
        return res.status(200).json({
            error: false,
            ExistingUser,
            accessToken,
            message: "Login successful"
        });
    }catch(error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
    
});

app.get('/get-userInfo',authenticationToken, async (req, res) => {
    const userId = req.user._id;
    // console.log("user: "+user);
    const userInfo = await User.findOne({ _id:userId });
    if(!userInfo) {
        return res.status(401).json({
            message: 'User not found'
        });
    }
    return res.json({
        user: {name:userInfo.name,email:userInfo.email,createdOn:userInfo.createdOn,password:userInfo.password},
        message: 'User Fetched successfully'
    })
})

app.put('/update-userInfo',authenticationToken,async (req,res) =>{
    const userId = req.user._id;
    // console.log({req});
    const {name,email,password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(userId);
    try{
        const updateData = {
            name: name,
            email: email,
            password: hashedPassword
        }
        const user = await User.findOneAndUpdate(
            {_id: userId},
            // {name,email,password:hashedPassword},
            updateData,
            {new:true}
        )
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        console.log(user);

        res.json({
            user,
            message: "User updated Successfully"
        })
    }catch(error){
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'An error occurred while updating user info' });
    }
})

app.get('/get-AllNotes',authenticationToken,async(req,res)=>{
    const userId = req.user._id;
    try{
        const notes = await Note.find({userId: userId});
        if(!notes){
            res.status(404).json({message:'No Notes found for the User'})
        }
        res.status(200).json({
            notes,
            message:'Notes Fetched successfully'
        })
    }catch(error){
        res.status(500).json({ message: 'An error occurred while'});
    }
})

app.post('/add-note',authenticationToken,async (req,res)=>{
    const userId = req.user._id;
    const {title,content} = req.body;
    console.log(req.body)
    if(!title || !content){
        return res.status(400).json({
            error:true,
            message:"Invalid title/content"
        })
    }
    try{
        const note = new Note({
            title,content,userId
        });
        
        console.log(await note.save());

        res.status(201).json({
            error: false,
            note,
            message: "Note saved successfully"
        })
    }catch(error){
        res.status(500).json({ 
            error:true,
            message: 'An error occurred while adding note'
        });
    }
})

app.put('/updateNote',authenticationToken,async (req, res)=>{
    const {title, content} = req.body;
    const noteId = req.body.id;
    console.log("note update id  ",noteId);
    if(!title || !content){
        return res.status(400).json({
            error:true,
            message:"Invalid title/content"
        })
    }
    try{
        const  updateNoteData = {
            title: title,
            content:content,
            createdOn:new Date().getTime()
        };

        const note = await Note.findOneAndUpdate(
            {_id: noteId},
            updateNoteData,
            {new:true}
        );

        if(!note){
            return res.status(404).json({message: "Note not found"});
        }
        console.log(note);

        res.json({
            note,
            message: "Note updated successfully"
        });
    }catch(error){
        console.error('Error updating Note:', error);
        res.status(500).json({error:true, message: 'An error occurred while updating Note ' });
    }
});

app.delete('/deleteNote/:noteId', authenticationToken, async(req, res)=>{
    const noteId = req.params.noteId;
    try{
        const deleteNote = await Note.findByIdAndDelete(noteId);
        if(deleteNote){
            res.json({
                error:false,
                message: "Note deleted successfully"
            })
        }else{
            res.json({
                error:true,
                message: "Error while deleting Note"
            })
        }
    }catch(error){
        res.status(500).json({ error:true, message: 'An error occurred while updating Note ' });
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
