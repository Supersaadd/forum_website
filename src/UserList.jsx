import axios from "axios"
import { useEffect, useState,useContext,useRef } from "react"
import style from './css/admin.module.css'
import { AnimatePresence, motion } from 'framer-motion'
import { CurrentUserContext, windowSizeContext } from "./App"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan,faUserPlus,faUserMinus } from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
function UserList(props){
    axios.defaults.withCredentials = true
    const searchRef = useRef()
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [loading , setLoading] = useState(true)
    const [allUsers, setAllUsers] = useState([])
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const {innerWidth, innerHeight} = useContext(windowSizeContext)
    async function fetchUsers(){       
        axios.get('http://localhost:4000/api/users')
        .then(response => {
            setUsers(response.data)
            setAllUsers(response.data)
            setLoading(false)
        }) 
    }
    useEffect(()=>{
        fetchUsers()
    },[])

    async function handleSetRole(id,role){
        if(id === currentUser._id){
            toast.error("You cannot change your own role")
            return
        }
       let newRole = role 
         toast.promise(axios.put(`http://localhost:4000/api/userRole/${id}`,
         {role:newRole}),
            {
                loading: 'Changing role...',
                success: (response) => {
                    fetchUsers()
                    return 'Role changed'
                },
                error: (error) => {
                    return 'Role change failed'
                }
            })
    }

    function handleBan(id,role){
        if(id === currentUser._id){
            toast.error("You cannot ban yourself")
            return
        }
        if(role === "banned"){
            handleSetRole(id,"user")
        }else{
        handleSetRole(id,"banned")
        }
    }

    function handleSearch(event){
       //filter users by username
       setUsers(allUsers.filter(user=>user.login.includes(event.target.value)))
    }


    if(!loading){
    return (

        //Input to filter users : 
        <>
        <input className={style.search} ref={searchRef} type="text" placeholder="Search user" onChange={handleSearch}/>
        <div className={style.userList}>
            <table className={style.table}>
                <thead className={style.thead}>
                    <tr className={style.tr} >
                        <th className={style.th + ' ' + style.username}>Username</th>
                        <th className={style.th + ' ' + style.firstname}>First Name</th>
                        <th className={style.th + ' ' + style.lastname}>Last Name</th>
                        <th className={style.th + ' ' + style.email}>Email</th>
                        <th className={style.th + ' ' + style.role}>Role</th>
                        <th className={style.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <AnimatePresence>
                    {users.map((user) => {

                        return (

                            <motion.tr className={style.tr} key={user._id}
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                            transition={{duration:0.4,delay:0.1*users.indexOf(user)}}
                            >
                                <td className={style.td + ' ' + style.username +' ' + style.clickable} onClick={()=>navigate("/profile/"+user._id)}>{user.login}</td>
                                <td className={style.td + ' ' + style.firstname}>{user.firstname}</td>
                                <td className={style.td}>{user.lastname}</td>
                                <td className={style.td+' '+ style.email}>{user.email}</td>
                                <td className={style.td + ' ' + style.role}>{user.role}</td>
                                <td className={style.td}>
                                    <div className={style.actions}>
                                        <button onClick={ ()=>handleSetRole(user._id,(user.role==="admin" ? "user":"admin"))}> {!(user.role === "admin") ? <><FontAwesomeIcon icon={faUserPlus} /> Set Admin</> : <> <FontAwesomeIcon icon={faUserMinus}/> Remove Admin </>}</button>
                                        <button onClick={()=> handleBan(user._id,user.role)}> {!(user.role === "banned") ? <><FontAwesomeIcon icon={faBan}/> Ban</> : "Unban"}</button>
                                    </div>
                                </td>
                            </motion.tr>
                        )
                    })}
                    </AnimatePresence>
                </tbody>
            </table>
        </div> 
        </> )         
    }   
}

export default UserList