import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import style from './css/newMessageModal.module.css'
import { useContext } from 'react'
import { CurrentUserContext } from './App'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { set } from 'date-fns'

function NewMessage(props){
    axios.defaults.withCredentials = true
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [forumid, setForumid] = useState(1)

    function verifyTitle(){
        if(title.length>300){
            toast.error("Title must be less than 300 characters")
            return false
        }
        if(/[!@#$%^&*]/.test(title)){
            toast.error("Title must not contain special characters")
            return false
        }

        if(title.length<5){
            toast.error("Title must be at least 5 characters long")
            return false
        }
        return true
    }
    function verifyContent(){
        if(content.length>1000){
            toast.error("Content must be less than 1000 characters")
            return false
        }
        if(content.length<10){
            toast.error("Content must be at least 10 characters long")
            return false
        }
        return true
    }
    const navigate = useNavigate()

    const send =async () => {
        //checking session
        axios.get('http://localhost:4000/api/session')
        .then((response)=>{
            if(!verifyTitle() || !verifyContent()){
                return
            }
            axios.post('http://localhost:4000/api/message',
            {
                title:title,
                content:content,
                date: new Date().toISOString(),
                userid:currentUser._id,
                replyingTo:null,
                forumid:forumid
            })
            .then(()=>{
                toast.success("Message sent")
                props.refreshData()
                props.setIsOpen(false)
                setTitle("")
                setContent("")
            })
            .catch((error)=>{
                toast.error("Message not sent")
            })
        })
        .catch((error)=>{
            toast.error("You are not connected",{duration: 2000})
            navigate('/login')
            setCurrentUser({})
            props.setIsConnected(false)
            props.setIsOpen(false)

            return
        })
        
        
    }
    return (
        <AnimatePresence>
        {props.isOpen && (
        <Dialog static as="div" className={style.newMessageModal} open={props.isOpen} onClose={props.setIsOpen}>
            <motion.div className={style.newMessageModalBox} 
                          initial={{ scale: 0 }}
                          animate={{ rotate: 360, scale: 1.2 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                            duration: 1
                          }}
                          exit={{ scale:0, rotate: -360 }}

                          >
                <Dialog.Overlay />
                <Dialog.Title>New Message</Dialog.Title>
                <Dialog.Description as="div" className={style.form}>
                    {currentUser.role==="admin" &&(
                        <select className={style.select} onChange={(e)=>setForumid(e.target.value)}>
                            <option value="1">Public Forum </option>
                            <option value="2">Private Forum</option>

                        </select>
                    )    
                    }
                    <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title"/>
                    <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" />
                    <div className={style.inline}>
                        <button onClick={()=>props.setIsOpen(false)}>Cancel</button>
                        <button onClick={send}>Send</button>
                    </div>
                </Dialog.Description>
            </motion.div>
        </Dialog>)}
        </AnimatePresence>
    
    )
}
export default NewMessage