import React, {useState, useEffect} from 'react'
import '../stylesheets/App.css';
import {FakeStackOverflowSidebar } from './globalcomponents.js';
import axios from 'axios';

export function AdminUserProfile({handleQuestionPageToggle,handleTagsPageToggle,registeredState,changePageView,userid}) {

    const [userName, setUsername] = useState("")
    const [userReputation,setUserReputation] = useState(50)
    const [joinedByDate,setJoinedByDate] = useState("")
    const [userQuestions,setUserQuestions] = useState([])
    const [tagsCreated,setTagsCreated] = useState([])
    useEffect(() =>{
 
        async function retriveUser(){

            try{
                const response = await axios.get('http://localhost:8000/admin/userinfo/'+userid, {withCredentials: true});
            let thisuser = response.data.user
            setUsername(thisuser.username)
            setUserReputation(thisuser.reputation)
            setUserQuestions(thisuser.questionsAsked)
            setTagsCreated(thisuser.tagsCreated)

            const options = {
                year: "numeric",
                month: "long",
                day: "numeric",
              };
            setJoinedByDate( new Date(thisuser.joinedDate).toLocaleDateString("en-US",options) );
            }catch(err){
                alert(err.response.data.error)  
            }
        }
        
        retriveUser()
    },[])
    return (
        <div id ="main_body" className="main_body">
            <table className="main_body">
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle} registeredState={registeredState}
                        changePageView={changePageView}/>
                        <td>
                            <UserDetails username ={userName} userReputation={userReputation} joinedByDate={joinedByDate}/>
                            <UserQuestions userQuestions = {userQuestions} changePageView ={changePageView}/>
                            <div className='userTags'>
                                <h3 className='userQuestionsAnswered' onClick={() => changePageView("questionsAnswered",[tagsCreated])}>Questions Answered</h3><h3 className='userTagsCreated' onClick={() => changePageView("userTagsCreated",[tagsCreated])}>Tags Created</h3>
                            </div>
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

function UserQuestions({userQuestions,changePageView}){


    let [questionElements, setQuestionElements] = useState([])
    useEffect( ()=>{

        let arrayOfQuestionElements = []
        userQuestions.forEach( (elem) =>{
            arrayOfQuestionElements.push(<QuestionElement questionTitle={elem.title} question ={elem} changePageView={changePageView}/> )

        }
        )

        setQuestionElements(arrayOfQuestionElements)
    },[userQuestions,changePageView,setQuestionElements])
    return(
        <div className='userQuestions'>
            {questionElements.length > 0? questionElements : <h1>No Users</h1>}
        </div>
    );
}

function QuestionElement({questionTitle,question,changePageView}){


    const handleQuestionClick = (question) =>{
        changePageView("editQuestion",[question])
    }

    return(
        <h4 className='questionTitle' onClick={ () => handleQuestionClick(question)}>{questionTitle}</h4>
    )

}