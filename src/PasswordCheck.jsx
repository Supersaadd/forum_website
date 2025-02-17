import React, {useState, useEffect} from 'react'
import './css/passwordcheck.css'
import {input} from './css/signup.module.css'
import { AnimatePresence, motion } from 'framer-motion'
function PasswordCheck(props){
    
    const [isError, setIsError] = useState(false)
    

    useEffect( ()=> {
        if(props.confirmpassword!="" && props.password !== props.confirmpassword){
            setIsError(true)
        }
        else{
            setIsError(false)

        }
    },[props.password,props.confirmpassword])

    return (
        <>
            <input type="password" className={input} value={props.password} placeholder="Password" onChange={ (e)=>props.setPassword(e.target.value)}/>
            <input type="password" className={input} value={props.confirmpassword} placeholder="Confirm Password" onChange={(e)=>props.setConfirmPassword(e.target.value)}/>
            <AnimatePresence initial={false}>
            {isError && <motion.div
                key="error"
                className="error"
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.5}}
                >
                Passwords do not match
                </motion.div>

        }
            </AnimatePresence>
        </>

    )

}

export default PasswordCheck