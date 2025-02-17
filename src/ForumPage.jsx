/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import style from './css/forum.module.css'
import Header from './Header'
import ListMessage from './ListMessage'
import NewMessage from './NewMessage'
import axios from 'axios'
import {useContext} from 'react'
import {CurrentUserContext} from './App'
import {AnimatePresence, delay, motion} from 'framer-motion'
import {toast} from 'react-hot-toast'
function ForumPage(props){
    axios.defaults.withCredentials = true
    const [loading , setLoading] = useState(true)
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [isOpenNewMessage, setIsOpenNewMessage] = useState(false)
    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
      }
    const [allMessages, setAllMessages] = useState([])
    const [listMessages, setListMessages] = useState([])
    const [forumid , setForumid] = useState(1)

     const navigate = useNavigate()
        useEffect(()=>{
            if(forumid===1){
                setListMessages(allMessages.filter((message) => message.forumId == 1 &&  message.replyingTo ==null))
                
            }else{
                setListMessages(allMessages.filter((message) => message.forumId == 2 && message.replyingTo ==null))
            }
        },[forumid,allMessages])

        async function fetchData(){
            try{
                
                const response = await axios.get('http://localhost:4000/api/session')
                let userid = response.data.userid
                const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
                const messages = await axios.get(`http://localhost:4000/api/messages`)
                setAllMessages(messages.data)
                setListMessages(messages.data.filter((message) => message.forumId == 1 &&  message.replyingTo ==null))
                setCurrentUser(user.data)
                props.setIsConnected(true)  
                setLoading(false)
            }
            catch(error){
                setCurrentUser({})
                props.setIsConnected(false)
                if(error.response.status===401){
                toast.error("You are not connected",{duration: 2000})
                }else{
                    toast.error("An error occured",{duration: 2000})
                }
                navigate('/login')
            }
        }



        useEffect(()=>{
            document.title = "Organiz'Asso"
            fetchData()
        },[])


    if(!loading){
    return (
        <>
        <Header setIsConnected={props.setIsConnected}/>
        <motion.main className={style.body}
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
        >
        <div className={style.main}>
            {currentUser.role==="admin" &&(
                <div className={style.forumSelector}>
                    <div className={forumid===1 ? style.active : style.inactive} onClick={()=>{setForumid(1)}}>Public Forum</div>
                    <div className={forumid===2 ? style.active : style.inactive} onClick={()=>{setForumid(2)}}>Private Forum</div>
                </div>

            )}
            <motion.div className={style.welcome + ' ' + (forumid===2 ? style.private : null)}
            initial={{x: 2000}}
            animate={{x:0}}
            exit={{x: -2000}}
            transition={{duration: 0.5}}>
                <h1>Welcome to the {currentUser.role==="admin" ? (forumid===1 ? "public":"private"): null} forum</h1>
                <div className={style.wave}>
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={style.shapefill}></path>
                    </svg>
                </div>
            </motion.div>
            <motion.div 
            initial={{x: -2000}}
            animate={{x:0}}
            exit={{x: 2000}}
            transition={{duration: 0.5, delay: 0.2}}
            >
            <ListMessage listMessages={listMessages} refreshData={fetchData}/>
            </motion.div>
            <div className="newMessageContainer">
                <button className="newMessageButton" onClick={()=>{setIsOpenNewMessage(!isOpenNewMessage)}}>+</button>
            </div>
            <NewMessage isOpen={isOpenNewMessage} setIsOpen={setIsOpenNewMessage} refreshData={fetchData} forumid={forumid} setIsConnected={props.setIsConnected}/>
        </div>
    </motion.main>
    </>
    )
}}

export default ForumPage

