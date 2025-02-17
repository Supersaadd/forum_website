import React from 'react'
import { useRef } from 'react'
import style from './css/search.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import { SearchContext } from './App'
import { useNavigate } from 'react-router-dom'
function SearchBar(props){
    axios.defaults.withCredentials = true
    const searchInput = useRef()
    const {searchResults, setSearchResults} = React.useContext(SearchContext)
    const navigate = useNavigate()
    async function search(){

        if(!searchInput.current.value){
            return
        }
        try{
            const response = await axios.get(`http://localhost:4000/api/search/${searchInput.current.value}`)
            setSearchResults(response.data)
            navigate('/search')
        }catch(error){
            console.log(error)
        }
    }

    function handleKeyDown(event){
        if(event.key === 'Enter'){
            search()
        }
    }

    return(
        <div className={style.searchBar}>
            <input type="text" onKeyDown={handleKeyDown} ref={searchInput} placeholder="Search" className={style.searchInput}/>
            <button className={style.searchButton} onClick={search}><FontAwesomeIcon icon={faMagnifyingGlass} size='xs'/></button>
        </div>

    )
}


export default SearchBar

