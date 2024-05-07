import React, {useState, useEffect} from 'react'
import '../stylesheets/App.css';
import {FakeStackOverflowSidebar } from './globalcomponents.js';
import axios from 'axios';

export function AdminProfile({handleQuestionPageToggle,handleTagsPageToggle,registeredState,changePageView}) {

    const [userName, setUsername] = useState("")
    const [userReputation,setUserReputation] = useState(50)
    const [joinedByDate,setJoinedByDate] = useState("")
    const [userList,setUserList] = useState([])

    useEffect(() =>{
 
        async function retriveAdminInfo(){
            try{
                const response = await axios.get('http://localhost:8000/admin/admininfo', {withCredentials: true});
                let thisuser = response.data.user
                setUsername(thisuser.username)
                setUserReputation(thisuser.reputation)

                const options = {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                };
                setJoinedByDate( new Date(thisuser.joinedDate).toLocaleDateString("en-US",options) );

                const userList = await axios.get('http://localhost:8000/users', {withCredentials: true});

                setUserList(userList.data)
            }catch(err){
                alert(err.response.data.error)  
            }

        }
        
        retriveAdminInfo()
    },[])
    return (
        <div id ="main_body" className="main_body">
            <table className="main_body">
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle} registeredState={registeredState} changePageView={changePageView}/>
                        <td>
                            <UserDetails username ={userName} userReputation={userReputation} joinedByDate={joinedByDate}/>
                            <UserList listOfUsers = {userList} changePageView ={changePageView}/>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

function UserDetails({username,userReputation,joinedByDate}){

    return(
        <div className='userDetails'>
            <p className='userDetailsText'>Username : {username}</p>
            <p className='userDetailsText'>Reputation : {userReputation}</p>
            <p className='userDetailsText'>Joined at : {joinedByDate}</p>
        </div>
    );
}

function UserList({listOfUsers,changePageView}){


    let [userElements, setuserElements] = useState([])

    useEffect( ()=>{

        let arrayOfUserElements = []
        listOfUsers.forEach( (elem) =>{

            arrayOfUserElements.push(<UserElement username={elem.username} userid = {elem._id} changePageView={changePageView}/> )

        }
        )

        setuserElements(arrayOfUserElements)
    },[changePageView, listOfUsers])

    return(
        <div className='userList'>
            {userElements}
        </div>
    );
}

function UserElement({username,userid,changePageView}){


    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const handleUserClick = (userid) =>{
        changePageView("adminViewUser",[userid])
    }

    const handleUserDelete = async (userid) =>{
        
        setDeleteConfirmation(true)
    }

    async function executeDeletion(userid){
        try{
            await axios.delete("http://localhost:8000/admin/users/"+userid,{withCredentials:true})
            alert("User Successfully Deleted")
            changePageView("homePage")
        }catch(err){
            setDeleteConfirmation(false)
            alert(err.response.data.error)  
        }
    }

    function backOffDeletion(){
        setDeleteConfirmation(false)
    }


    if(deleteConfirmation){
        return(
            <div className='userElement'>
                <h4 className='questionTitle' onClick={ () => handleUserClick(userid)}>{username}</h4>
                <div className='deleteBox'>
                <h4>Are you sure?</h4><button onClick={() => executeDeletion(userid)}>Yes</button><button onClick={() => backOffDeletion()}>No</button>
                </div>
            </div>
        )    
    }else{
        return(
            <div className='userElement'>
                <h4 className='questionTitle' onClick={ () => handleUserClick(userid)}>{username}</h4><button onClick={() => handleUserDelete(userid)}>Delete</button>
            </div>
        )
    }

}