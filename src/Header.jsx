import React from 'react'
import { useState, useEffect,useContext } from 'react'
import style from './css/header.module.css'
import logo from './assets/logo.png'
import logoLong from './assets/logoLong.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import SearchBar from './SearchBar'
import {useFloating, autoUpdate} from '@floating-ui/react'
import {offset} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {CurrentUserContext,windowSizeContext} from './App'
import axios from 'axios'
import {toast} from 'react-hot-toast'
function Header(props){
    axios.defaults.withCredentials = true
    const navigate = useNavigate()
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const {innerWidth, innerHeight} = useContext(windowSizeContext)
    const [isOpen, setIsOpen] = useState(false)
    const [crossAxisVar, setCrossAxisVar] = useState(-20)
    useEffect( ()=> {
        innerWidth < 800 ? setCrossAxisVar(-10) : setCrossAxisVar(-20)
    },[innerWidth]
    )


    const {refs,floatingStyles} = useFloating({
        whileElementsMounted: autoUpdate,
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset(
            {
                crossAxis: crossAxisVar,
            }
        )]
    })



    const handleLogout = () => {

        axios.delete('http://localhost:4000/api/session')
        .then(()=>{
            toast.success("You are disconnected")
            navigate('/login')
            props.setIsConnected(false)
            setCurrentUser({})
        })
        .catch(error => {
            console.log(error)
            toast.error("Error while disconnecting")
        })

    }
    const location = window.location.pathname

    const handleProfile = () => {
        if(location !== '/profile/'+currentUser._id){
            navigate('/profile/'+currentUser._id)
        }
    }

    const handleRedirectHome = () => {
        if(location !== '/home'){
            navigate('/home')
        }
    }


    return (
        <div className={style.headerWrapper}>
        <header className={style.header}>
            <div className={style.logo} onClick={handleRedirectHome}>
               <img className={style.img} src={innerWidth < 1000 ? logo : logoLong} alt="logo"/>
            </div>
            <SearchBar setListMessages={props.setListMessages}/>
            <div className={style.wrapper}>
            <button ref={refs.setReference} className={style.button} onClick={()=>{setIsOpen(!isOpen)}}>
                    <FontAwesomeIcon icon={faUser} size='sm'/>
            </button>
            </div>
            <AnimatePresence>
            {isOpen && 
            <motion.div className={style.menu} style={floatingStyles} ref={refs.setFloating}
            key="menu"
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.3}}>
                <button onClick={handleProfile}>
                    Profile
                </button>
                {currentUser.role === "admin" &&
                <button onClick={()=>{navigate('/admin')}}>
                    Admin
                </button>
                }
                <button  onClick={handleLogout}>
                    Logout
                </button>

            </motion.div>
            }
            </AnimatePresence>
            
        
        </header>
        </div>
    )
}

export default Header