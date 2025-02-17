import React from 'react'
import { useState,useEffect,createContext} from 'react'
import {useLocation,Route,Routes} from "react-router-dom"
import SignUp from './Signup.jsx'
import Login from './Login.jsx'
import ForumPage from './ForumPage.jsx'
import './css/App.css'
import Profile from './Profile.jsx'
import Admin  from './Admin.jsx'
import MessagePage from './MessagePage.jsx'
import { Toaster } from 'react-hot-toast'
import Search from './Search.jsx'
import { AnimatePresence } from 'framer-motion'
export const CurrentUserContext = createContext(null)
export const SearchContext = createContext(null)
export const windowSizeContext = createContext({
  innerWidth:0,
  innerHeight:0
})
function App() {
    function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }
  const [isConnected, setIsConnected] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const [searchResults, setSearchResults] = useState([])
  const [windowSize, setWindowSize] = useState(getWindowSize());
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  }, []);

  function handleResize() {
    setWindowSize(getWindowSize());
  }



  const location = useLocation()
  return (
    <CurrentUserContext.Provider value={{currentUser,setCurrentUser}}>
      <windowSizeContext.Provider value={windowSize}>
        <SearchContext.Provider value={{searchResults,setSearchResults}}>
          <Toaster position='top-center' reverseOrder={false}/>
          <AnimatePresence mode="wait">
             <Routes location={location} key={location.key}>
               <Route path="/" element={isConnected ? <ForumPage isConnected={isConnected} setIsConnected={setIsConnected}/> : <Login isConnected={isConnected} setIsConnected={setIsConnected}/>}/>
                <Route path="login" element={<Login isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="signup" element={<SignUp isConnected={isConnected} setIsConnected={setIsConnected}/>}/>
                <Route path="home" element={<ForumPage isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="profile" element={<Profile isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="/profile/:userid" element={<Profile isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="/admin" element={<Admin isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="/message/:messageid" element={<MessagePage isConnected={isConnected} setIsConnected={setIsConnected} />}/>
                <Route path="/search" element={<Search setIsConnected={setIsConnected}/>}/>
            </Routes>
          </AnimatePresence>
        </SearchContext.Provider>
      </windowSizeContext.Provider>
    </CurrentUserContext.Provider>)
}

export default App
