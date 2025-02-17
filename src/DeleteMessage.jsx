import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import style from './css/deleteMessage.module.css'
import { useContext } from 'react'
import { CurrentUserContext } from './App'
import {toast} from 'react-hot-toast'
import axios from 'axios'
//A changer pour supprimer les utilisaters aussi (en rendant plus modulable et en prenant en props la fonction de suppression)
function DeleteMessage(props){
    axios.defaults.withCredentials = true
    function deleteMessage(messageId){
        axios.delete(`http://localhost:4000/api/messages/${messageId}`)
        .then(async ()=>{
            toast.success("Message deleted")
            await props.refreshData()
            props.setIsOpen(false)
        })
        .catch((error)=>{
            console.log(error)
            toast.error("Error while deleting message")
        })
    }

    return (
        <Dialog as="div" className={style.deleteMessageModal} open={props.isOpen} onClose={props.setIsOpen} >
            <motion.div
            className={style.deleteMessageModalBox}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            >
            <Dialog.Title as="h3" className={style.title} >
                Delete message
            </Dialog.Title>
            <Dialog.Description as="p" className={style.content}>
                Are you sure you want to delete this message?
            </Dialog.Description>
            <div className={style.buttons}>
                <button className={style.buttonRemove} onClick={()=>deleteMessage(props.id)}>Delete</button>
                <button className={style.buttonCancel}onClick={()=>props.setIsOpen(false)}>Cancel</button>
            </div>
            </motion.div>
        </Dialog>
    )
}

export default DeleteMessage