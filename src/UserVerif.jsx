import {useState, useEffect} from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from './css/admin.module.css'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from "react-router-dom"
import axios from "axios"

function UserVerif(props){
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [allUsers, setAllUsers] = useState([])

    async function fetchUsers(){
        axios.get('http://localhost:4000/api/usersWaiting')
        .then(response => {
            setUsers(response.data)
            setAllUsers(response.data)
        })
    }

    useEffect(()=>{
        fetchUsers()
    },[])
    function acceptUser(id){
        axios.put(`http://localhost:4000/api/userRole/${id}`,{role:"user"})
        .then(response => {
            fetchUsers()
        })
    }
    function refuseUser(id){
        axios.delete(`http://localhost:4000/api/user/${id}`)
        .then(response => {
            fetchUsers()
        })
    }

    function search(event){
        setUsers(allUsers.filter((user)=>user.login.includes(event.target.value) && user.role === "user"))
    }

    return (
        <>
        <input className={style.search} type="text" placeholder="Search user" onChange={search}/>
        <motion.div className={style.userVerif} 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}>
            <h2> {users.length === 0 ? "No user to verify" : "Users to verify"} </h2>
            <div className={style.usersCardList}>
                <AnimatePresence>
                {users.map((user) => {
                    return (
                        <motion.div key={user._id} className={style.userCard} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}>
                            <div className={style.userInfos}>
                                <div>
                                    <h3 className={style.h3 +' ' + style.clickable} onClick={()=>navigate("/profile/" + user._id)}>@{user.login}</h3>
                                    <p>{user.firstname} {user.lastname}</p>
                                    <p className={style.email}>{user.email}</p>
                                </div>
                            </div>
                            <div className={style.userActions}>
                                <button className={style.accept} onClick={()=>acceptUser(user._id)}><FontAwesomeIcon icon={faCheck} size='lg'/></button>
                                <button className={style.reject} onClick={()=>refuseUser(user._id)}><FontAwesomeIcon icon={faTimes} size='lg'/></button>
                            </div>
                        </motion.div>
                    )
                })}
                </AnimatePresence>
            </div>

        </motion.div>
        </>
    )

}

export default UserVerif