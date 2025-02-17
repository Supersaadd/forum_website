/* eslint-disable react/no-unescaped-entities */
import {Link,useNavigate} from 'react-router-dom'
import { useRef,useEffect,useContext } from 'react';
import style from './css/signup.module.css'
import {CurrentUserContext} from './App'
import axios from 'axios';
import {toast} from 'react-hot-toast'
function Login(props) {
    axios.defaults.withCredentials = true
    const {currentUser,setCurrentUser} = useContext(CurrentUserContext)
    let navigate = useNavigate();

    async function checkSession(){
        try{
            const response = await axios.get('http://localhost:4000/api/session')
            let userid = response.data.userid
            const user = await axios.get(`http://localhost:4000/api/user/${userid}`)
            setCurrentUser(user.data)
            props.setIsConnected(true)
            toast.success("You are already connected")
            navigate('/home')
        }
        catch(error){
            setCurrentUser(null)
            props.setIsConnected(false)
        }
    }
    useEffect( ()=> {
        document.title = "Login"
        checkSession()
    },[])


    const usernameRef = useRef();
    const passwordRef = useRef();
    async function handleLogin( event) {
        event.preventDefault()
        if(usernameRef.current.value === "" || passwordRef.current.value === ""){
            toast.error("Please fill all the fields")
            return
        }
        toast.promise(
            axios.post('http://localhost:4000/api/user/login',{login:usernameRef.current.value,password:passwordRef.current.value}),
            {
                loading: 'Logging in...',
                success: (response) => {
                    setCurrentUser(response.data)
                    props.setIsConnected(true)
                    navigate('/home')
                    return 'Login successful'
                },
                error: (error) => {
                    props.setIsConnected(false)

                    return error.response.data.message
                }
            }
        )
    }
    function cancelChange() {
        usernameRef.current.value = ""
        passwordRef.current.value = ""
    }

    return (
    <>
    <main className={style.main}>
        <div className={style.center}>
            <div className={style.box}>
                <h1>Login</h1>
                <form className={style.form}>
                    <input type="text" ref={usernameRef} placeholder="Username" className={style.input}/>
                    <input type="password" ref={passwordRef} placeholder="Password" className={style.input}/>
                    <div className={style.inline}>
                        <button type="submit" className={style.button} onClick={handleLogin}>Login</button>
                        <button type="button" className={style.button} onClick={cancelChange}>Cancel</button>
                    </div>
                    <Link to="/signup" className={style.a}>Don't have an account ? Sign up here</Link>
                </form>
            </div>
        </div>
    </main>
    </>
    )
}

export default Login