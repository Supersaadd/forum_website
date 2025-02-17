import { useState,useEffect,useContext} from "react"
import style from './css/admin.module.css'
import Header from "./Header"
import UserList from "./UserList"
import UserVerif from "./UserVerif"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {CurrentUserContext} from './App'
import {motion} from 'framer-motion'
function Admin(props){
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const [loading , setLoading] = useState(true)
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let userid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
            setCurrentUser(user.data)
            props.setIsConnected(true)
            if(user.data.role !== "admin"){
                navigate('/home')
            }
            setLoading(false)
        }
        catch(error){
            setCurrentUser(null)
            props.setIsConnected(false)
            navigate('/login')

        }
    }

    useEffect(()=>{
        document.title = "Admin"
        checkSession()
    },  [])

    const [tab, setTab] = useState("user-verif")

    if(!loading){

    return (
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{duration:0.5}}
        >
        <Header setIsConnected={props.setIsConnected}/>
        <div className={style.admin}>
            <div className={style.menu}>
                <div className={tab==="user-verif" ? style.active : style.inactive} onClick={()=>{setTab("user-verif")}}>UserVerification</div>
                <div className={tab==="user-list" ? style.active : style.inactive} onClick={()=>{setTab("user-list")}}>UserList</div>
            </div>
            <div className={style.content}>
                {tab === "user-verif" && 
                    <UserVerif/>


                }
                {tab === "user-list" && 
                   <UserList/>
                }
            </div>
        </div>
        </motion.div>
    )
}
}

export default Admin