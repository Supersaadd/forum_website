/* eslint-disable react/no-unescaped-entities */
import {Link,useNavigate} from 'react-router-dom'
import { useRef,useEffect, useState,useContext } from 'react';
import PasswordCheck from './PasswordCheck';
import style from './css/signup.module.css'
import {CurrentUserContext} from './App'
import axios from 'axios';
import {toast} from 'react-hot-toast'
function Signup(props) {
    axios.defaults.withCredentials = true
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmPassword] = useState("")
    const navigate = useNavigate();
    const usernameRef = useRef();
    const firstnameRef = useRef();
    const lastnameRef = useRef();
    const mailRef = useRef();
    const birthdateRef = useRef();

    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let userid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
            setCurrentUser(user.data)
            props.setIsConnected(true)
            //Maybe put a toaster to say that the user is already connected
            toast.success("You are already connected")
            navigate('/home')
        }
        catch(error){
            setCurrentUser(null)
            props.setIsConnected(false)
        }
    }


    useEffect( ()=> {
        document.title = "SignUp"
        checkSession()
    },[])



    function verifyPassword(password){
        if(password.length < 8){
            toast.error("Password must be at least 8 characters long")
            return false
        }
        if(!/[a-z]/.test(password)){
            toast.error("Password must contain at least one lowercase letter")
            return false
        }
        if(!/[A-Z]/.test(password)){
            toast.error("Password must contain at least one uppercase letter")
            return false
        }
        if(!/[0-9]/.test(password)){
            toast.error("Password must contain at least one number")
            return false
        }
        if(!/[!@#$%;.?,=+:/^&*]/.test(password)){
            toast.error("Password must contain at least one special character")
            return false
        }
        return true
    }

    function verifyMail(mail){
        const validEmail = new RegExp(
            '^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$'
         );
        if(!validEmail.test(mail)){
            toast.error("Invalid email")
            return false
        }
        return true        
    }

    function verifyUsername(username){
        if(username.length < 5){
            toast.error("Username must be at least 5 characters long")
            return false
        }
        if(username.length > 15){
            toast.error("Username must be at most 15 characters long")
            return false
        }
        if(!/[a-zA-Z0-9]/.test(username)){
            toast.error("Username must contain only letters and numbers")
            return false
        }
        return true
    }


    function verifyBirthdate(birthdate){
        let today = new Date()
        let birth = new Date(birthdate)
        if(today.getFullYear() - birth.getFullYear() > 100){
            toast.error("Invalid birthdate")
            return false
        }
        if(today.getFullYear() - birth.getFullYear() < 13){
            toast.error("You must be at least 13 years old to sign up")
            return false
        }
        return true
    }



    function handleSignUp(event) {
        event.preventDefault()
        if(usernameRef.current.value === "" || password === "" || confirmpassword === "" || firstnameRef.current.value === "" || lastnameRef.current.value === "" || mailRef.current.value === ""|| birthdateRef.current.value === ""){
            toast.error("Please fill all the fields")
            return
        }
        if(!verifyBirthdate(birthdateRef.current.value)){
            return
        }
        let birthdate = birthdateRef.current.value
        let account_created = new Date().toISOString()
        let username = usernameRef.current.value.trim().toLowerCase()
        let firstname = firstnameRef.current.value.trim().toLowerCase()
        let lastname = lastnameRef.current.value.trim().toLowerCase()
        let mail = mailRef.current.value.trim().toLowerCase()
        let pwd = password.trim()
        let confirmpwd = confirmpassword.trim()
        if(!verifyPassword(pwd)){
            return
        }
        if(pwd !== confirmpwd){
            toast.error("Passwords don't match")
            return
        }
        if(!verifyMail(mail)){
            return
        }
        if(!verifyUsername(username)){
            return
        }
        toast.promise(
            axios.post('http://localhost:4000/api/user/signup',
            {
                login:username,
                password:pwd,
                firstname:firstname,
                lastname:lastname,
                email:mail,
                birthdate:birthdate,
                account_created:account_created
            }),
            {
                loading: 'Signing up...',
                success: (response) => {
                    navigate('/login')
                    return 'Your account has been created'
                },
                error: (error) => {
                    return error.response.data.message
                }
            }
        )
    }
    function cancelChange() {
        setPassword("")
        setConfirmPassword("")
        usernameRef.current.value = ""
    }

    return (
    <main className={style.main}>
        <div className={style.center}>
            <div className={style.box}>
                <h1>Sign Up</h1>
                <form className={style.form}>
                    <div className={style.inline}>
                        <input type="text" className={style.input} ref={firstnameRef} placeholder="First Name"/>
                        <input type="text" className={style.input} ref={lastnameRef} placeholder="Last Name"/>
                    </div>
                    <input type="text" className={style.input }ref={usernameRef} placeholder="Username"/>
                    <input type="email" className={style.input} ref={mailRef} placeholder="Email"/>
                    <input type="date" className={style.input} ref={birthdateRef} placeholder="Birthdate"/>
                    <PasswordCheck  password={password} confirmpassword={confirmpassword} setPassword={setPassword} setConfirmPassword={setConfirmPassword}/>
                    <div className={style.inline}>
                        <button type="submit" className={style.button} onClick={handleSignUp}>Sign Up</button>
                        <button type="button" className={style.button} onClick={cancelChange}>Cancel</button>
                    </div>
                    <Link to="/login" className={style.a}>Already got an account ? Log in here</Link>
                </form>
            </div>
        </div>
    </main>
    )
}

export default Signup