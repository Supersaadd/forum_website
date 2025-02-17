import { useState, useContext,useEffect } from 'react';
import { CurrentUserContext } from './App';
import axios from 'axios';
import {motion} from 'framer-motion';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './css/message.module.css'
function Likes(props){
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [isLiked,setIsLiked] = useState(false)
    const [loading,setLoading] = useState(true)
    const [nbLikes,setNbLikes] = useState(0)
    axios.defaults.withCredentials = true
    async function fetchData(){
        await axios.get('http://localhost:4000/api/messages/isLikedBy/'+props.id+'/'+currentUser._id)
        .then(response => {
            setIsLiked(response.data)
        })
        .catch(error => {
            console.log(error)
        })
        await axios.get('http://localhost:4000/api/messages/nbLikes/'+props.id)
        .then(response => {
            setNbLikes(response.data)
        })
        .catch(error => {
            console.log(error)
        })
        setLoading(false)
    }

    function handleLike(){
        if(isLiked){
            axios.delete('http://localhost:4000/api/messages/like/'+props.id+'/'+currentUser._id)
            .then(() => {
                setNbLikes(nbLikes - 1)
                setIsLiked(false)
            })
            .catch(error => {
                console.log(error)
            })
        }else{
            axios.post('http://localhost:4000/api/messages/like/'+props.id+'/'+currentUser._id)
            .then(() => {
                setNbLikes(nbLikes + 1)
                setIsLiked(true)
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        if(currentUser){
            fetchData()
        }
    },[])

    return(
        <div>
            <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={style.likeButton}
            >
               {isLiked ? <FontAwesomeIcon icon={faHeart} size='sm' color="red"/> : <FontAwesomeIcon icon={faHeart} size='sm' color="black" />}
                <span>{nbLikes}</span>
            </motion.div>
        </div>
    )


}

export default Likes;