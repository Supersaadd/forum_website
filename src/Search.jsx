import Header from "./Header";
import { useContext, useEffect,useState } from "react";
import { CurrentUserContext } from "./App";
import { SearchContext } from "./App";
import ListMessage from "./ListMessage";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import {toast} from 'react-hot-toast'
import {motion} from 'framer-motion'
function Search(props){
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const {searchResults, setSearchResults} = useContext(SearchContext)
    const navigate = useNavigate()
    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let currentUserid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${currentUserid}`)
            setCurrentUser(user.data)
            props.setIsConnected(true)
        }
        catch(error){
            setCurrentUser(null)
            props.setIsConnected(false)
            toast.error("You are not connected",{duration: 2000})
            navigate('/login')
        }
    }
    useEffect(()=>{
        document.title = "Search"
        checkSession()
    },[])

if(searchResults.length>0){
    return(
    <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:0.5}}
    >
       <Header setIsConnected={props.setIsConnected}/>
       <div className="searchMessages">
        <ListMessage listMessages={searchResults} refreshData={checkSession}/>

        </div>
    </motion.div>
    )
}
else{
    return(
        <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{duration:0.5}}
        >
        <Header setIsConnected={props.setIsConnected}/>
        <div className="searchMessages">
            <h1>No results found</h1>
        </div>
        </motion.div>
    )
}
}
export default Search