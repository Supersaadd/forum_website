import { useState,useEffect,useContext } from "react"
import { useParams , useNavigate} from "react-router-dom"
import Header from "./Header"
import style from './css/messagePage.module.css'
import styleMessage from './css/message.module.css'
import Message from "./Message"
import axios from 'axios'
import ListMessage from "./ListMessage.jsx"
import {CurrentUserContext} from './App'
import {AnimatePresence, motion} from 'framer-motion'
import {toast} from 'react-hot-toast'
function MessagePage(props) {
    axios.defaults.withCredentials = true
    var {messageid} = useParams()
    const navigate = useNavigate()
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [loading , setLoading] = useState(true)
    const [replies , setReplies] = useState([])
    const [message,setMessage] = useState()

    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let userid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
            const message = await axios.get(`http://localhost:4000/api/messages/${messageid}`)
            const replies = await axios.get(`http://localhost:4000/api/messages/replies/${messageid}`)
            setReplies(replies.data)
            setMessage(message.data)
            setCurrentUser(user.data)
            props.setIsConnected(true)  
            setLoading(false)
        }
        catch(error){
            console.log(error)
            setCurrentUser(null)
            props.setIsConnected(false)
            toast.error("You are not connected",{duration: 2000})
            navigate('/login')
        }
    }

    useEffect(()=>{
        //fetch replies and message
        checkSession()
    },[messageid])



    useEffect(()=>{
        checkSession()
    },[])

if(!loading){
    return (
        <>
        <Header setIsConnected={props.setIsConnected}/>
        <motion.div 
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        >
        <Message key={message._id} id={message._id} title={message.title} content={message.content} date={message.date} user={message.userid} replyingTo={message.replyingTo} refreshData={()=>navigate("/home")}/>
            <div className={styleMessage.replies}>
                <ListMessage listMessages={replies} refreshData={checkSession} />
            </div>
        </motion.div>

        </>)
}
    
}

export default MessagePage