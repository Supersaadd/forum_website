
import Message from "./Message"
import style from './css/forum.module.css'
import {AnimatePresence, motion} from 'framer-motion'
function ListMessage(props){


    return (
        <div className={style.listMessages}>
            <AnimatePresence mode="popLayout">
            {props.listMessages.map((message,index) => {
                return (
                <motion.div 
                key={message._id}
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.1,delay:index*0.1}}
                >
                <Message key={index} refreshData={props.refreshData} id={message._id} title={message.title} content={message.content} date={message.date} user={message.userid} replyingTo={message.replyingTo}/>
                </motion.div>
                )     
            })}
            </AnimatePresence>

        </div>)
}


export default ListMessage