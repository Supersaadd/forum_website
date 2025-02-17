import { useState,useEffect,useRef,useContext } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './css/message.module.css'
import { faReply,faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { formatDistance } from "date-fns"
import { CurrentUserContext } from "./App"
import DeleteMessage from "./DeleteMessage"
import Likes from "./Likes"
function Message(props){
    axios.defaults.withCredentials = true
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [loading , setLoading] = useState(true)
   const [userRep,setUserRep] = useState()
    const [reply, setReply] = useState(false)
    const [messageOwner,setMessageOwner] = useState()
    const [nbReplies,setNbReplies] = useState(0)
    const [isOpenDelete, setIsOpenDelete] = useState(false)
    
    const replyContentRef = useRef()
    let navigate = useNavigate()
    
    async function fetchData(){
        //fetch user data
        await axios.get('http://localhost:4000/api/user/'+props.user)
        .then(response => {
            setMessageOwner(response.data)
        })
        .catch(error => {
            console.log(error)
        })
        //getting the number of replies
        await axios.get('http://localhost:4000/api/messages/nbreplies/' + props.id)
        .then(response => {
            setNbReplies(response.data)
        })
        .catch(error => {
            console.log(error)
        })
        if(props.replyingTo){
            //fetch the user i'm replying to
            await axios.get('http://localhost:4000/api/messages/userReplyingToMessage/'+props.replyingTo)
            .then(async (response) => {
                let userid = response.data
                await axios.get('http://localhost:4000/api/user/'+userid)
                .then(response => {
                    setUserRep(response.data)
                })
                .catch(error => {
                    console.log(error)
                })
            })
            .catch(error => {
                console.log(error)
            })
        }
        setLoading(false)
    }
    
    async function handleReply(messageId){
        if(replyContentRef.current.value === ""){
            toast.error("You cannot send an empty reply")
            return
        }
        try{
           const message =await axios.get('http://localhost:4000/api/messages/' + messageId)
           let forumId = message.data.forumId
            try{
                await axios.post('http://localhost:4000/api/message',{
                    title: null,
                    content: replyContentRef.current.value,
                    forumid: forumId,
                    replyingTo: messageId,
                    date: new Date().toISOString(),
                    userid: currentUser._id
                })
                toast.success("Reply sent")
                setReply(false)
                replyContentRef.current.value = ""
            }catch(error){
                console.log(error)
                toast.error("Reply not sent")
            }
        }catch(error){
            toast.error("An error occured")
            console.log(error)}
        fetchData()
    }

    useEffect(()=>{
        //fetch user data
        fetchData()
    },[])
    useEffect(()=>{
        //fetch user data
        fetchData()
    },[props.user,props.replyingTo,props.id])

if(!loading){
    return (
        <div className={style.message}>
                <div className={style.messageUserDate}>
                    <div className={style.messageUser} onClick={()=> navigate(`/profile/${messageOwner._id}`)}>
                        <img src={`https://ui-avatars.com/api/?name=${messageOwner.login}&background=363535&color=fff`} alt="user"/>
                        <h4>@{messageOwner.login}</h4>
                    </div>
                    <div className={style.messageDate}>
                            <h4>  {formatDistance(new Date(props.date), new Date(), {addSuffix: true })}</h4>
                    </div>
                </div>
                {
                !props.replyingTo &&(
                <div className={style.messageTitle}>
                    <h3>{props.title}</h3>
                </div>)
                }
                {
                props.replyingTo &&(
                    <div className={style.messageReply}>
                        <p className={style.replyingTo}>replying to  <span onClick={()=> navigate(`/profile/${userRep._id}`)}>@{userRep.login}</span></p>
                    </div>
                    
                )
                }
                <div className={style.messageContent}>
                    <p>
                        {props.content}
                    </p>
                </div>
                <div className={style.messageActions}>
                    <div className={style.inline}>
                        <button className={style.replyButton} onClick={()=>setReply(!reply)}><FontAwesomeIcon icon={faReply} size='sm'/>Reply</button>
                        {(currentUser._id === props.user || currentUser.role==="admin") && <button className={style.deleteButton} onClick={()=>setIsOpenDelete(true)}> <FontAwesomeIcon icon={faTrash} size='sm'/></button>}
                        <Likes id={props.id} currentUser={currentUser}/>
                    </div>
                    <Link to={`/message/${props.id}`} className={style.seeAllReplies}>{nbReplies>0 ? `See all ${nbReplies} replies` : "No replies yet"}</Link>
                </div>
                <AnimatePresence>
                {reply && 
                <motion.div className={style.reply}
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.3}}
                >
                     <textarea className={style.replyContent} ref={replyContentRef} placeholder="Reply to this message"></textarea>
                     <button onClick={()=>handleReply(props.id)} className={style.sendButton}> <FontAwesomeIcon icon={faPaperPlane} size='sm'/>Send</button>
                </motion.div>}
                </AnimatePresence>
                <DeleteMessage id={props.id} isOpen={isOpenDelete} setIsOpen={setIsOpenDelete} refreshData={props.refreshData}/>
        </div>
    )
}
}

export default Message