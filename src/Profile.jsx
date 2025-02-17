import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState,useEffect,useContext } from "react"
import Header from "./Header"
import {CurrentUserContext} from './App'
import {windowSizeContext} from './App'
import style from './css/profile.module.css'
import ListMessage from "./ListMessage"
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {format } from 'date-fns'
import {motion,AnimatePresence} from 'framer-motion'
function Profile(props){
    axios.defaults.withCredentials = true
    var {userid} = useParams()
    const {innerWidth, innerHeight} = useContext(windowSizeContext)
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [userProfile, setUserProfile] = useState()
    const [loading , setLoading] = useState(true)
    const [listMessages, setListMessages] = useState([])
    const navigate = useNavigate()



    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let currentUserid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${currentUserid}`)
            setCurrentUser(user.data)
            props.setIsConnected(true)
            //fetching the user profile
            try{
                const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
                setUserProfile(user.data)
                //fetching the messages of the user
                try{
                    const messages = await axios.get(`http://localhost:4000/api/messages/user/${userid}`)
                    if(user.data.role==="admin"){
                        setListMessages(messages.data)
                    }else{
                        setListMessages(messages.data.filter((message) => message.forumId == 1))
                    }
                }catch(error){
                    console.log(error)
                    toast.error("Error while fetching messages",{duration: 2000})
                }
            }catch(error){
                toast.error("User not found",{duration: 2000})
                navigate('/home')
            }

           
            setLoading(false)
        }
        catch(error){
            setCurrentUser(null)
            props.setIsConnected(false)
            toast.error("You are not connected",{duration: 2000})
            navigate('/login')
        }
    }



    useEffect( ()=> {
        checkSession()
        },[userid])
    
    
    useEffect(()=>{
        document.title = "Profile"
        checkSession()
    },[])

if(!loading){
    return (
        <motion.div     
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{duration:0.5}}
        >
            <Header setIsConnected={props.setIsConnected} />
            <motion.div className={style.profile}
                initial={{x:2000}}
                animate={{x:0}}
                exit={{x:-2000}}
                transition={{duration:0.5}}
            >
                <div className={style.avatar}>
                    <img className={style.avatarimg} src={`https://ui-avatars.com/api/?name=${userProfile.login}&background=363535&color=fff`} />            
                </div>
                {innerWidth>768 && <h1 className={style.h1}>@{userProfile.login}</h1>}
                <div className={style.userinfo}>
                    {innerWidth<768 && <h1 className={style.h1}>@{userProfile.login}</h1>}
                    <p className={style.p}>Birthday: {format(userProfile.birthdate,"dd/MM/yyyy")}</p>
                    <p className={style.p}>Date joined: {format(userProfile.account_created,"MMMM yyyy")}</p>
                    <p className={style.p}>Number of messages: {listMessages.length}</p>
                </div>
            </motion.div>
            <motion.div 
                initial={{x:-2000}}
                animate={{x:0}}
                exit={{x:2000}}
                transition={{duration:0.5,delay:0.2}}
            >
            <h1 className={style.h1}> {userProfile.login}'s Messages</h1>
            {listMessages.length === 0 && <h2 className={style.h2}>No messages yet</h2>}
            <ListMessage listMessages={listMessages} setListMessages={setListMessages} refreshData={checkSession}/>
            </motion.div>
        </motion.div>
    )
}
}

export default Profile