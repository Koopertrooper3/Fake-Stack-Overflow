// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
//import FakeStackOverflow from './components/fakestackoverflow.js'
import { useEffect, useState } from 'react';
import {QuestionPage} from './components/questionpagecomponent.js'
import { FakeStackOverflowTopbar } from './components/globalcomponents.js';
import { TagsPage } from './components/tagspagecomponent.js';
import NewQuestionPage from './components/submitquestion.js'
import ViewQuestion from './components/viewquestion.js';
import SubmitAnswer from './components/submitanswer.js';
import { UserProfile } from './components/userprofile.js';
import { EditQuestionPage } from './components/editquestion.js';
import { UserTagsPage } from './components/usertagspage.js';
import { AdminProfile } from './components/adminprofile.js';
import { AdminUserProfile } from './components/adminuserprofile.js';

import WelcomePage from './components/welcomepage.js'; // ***
import axios from 'axios';
//Enter here, use this component to maintain state across the entire website
//This component will do the branching and switching between pages

function App() {

  //Page state variables
  //const [showWelcomePage, setShowWelcomePage] = useState(true); // ***
  //const [showQuestionPage, setShowQuestionPage] = useState(false); // *** chagned to false 
  //const [showTagsPage, setShowTagsPage] = useState(false);
  //const [showSubmitQuestion, setShowSubmitQuestion] = useState(false);
  const [showQuestionAnswerPage, setshowQuestionAnswerPage] = useState(null)
  const [showSubmitAnswer, setShowSubmitAnswer] = useState(null)
  const [showEditedQuestion, setShowEditedQuestion] = useState(null)
  const [showTagsCreated, setShowTagsCreated] = useState(null)

  const [pageView,setPageview] = useState("welcomePage")
  
  const [questionFilter, setFilter] = useState("newest");
  const [searchString, setSearchString] = useState("");
  const [tagState, setTagState] = useState("");

  const [registeredState, setRegisteredState] = useState(false)
  const [adminState, setAdminState] = useState(false)
  const [adminViewUser, setAdminViewUser] = useState(null)

  const handleQuestionPageToggle = () => {

    setPageview("homePage")
    setshowQuestionAnswerPage(null);
    setShowSubmitAnswer(null);
    setSearchString("");
    setFilter("newest");
    setTagState("");
  };

  //Tag > Search > Filter in order of priority

  //Switch to Tags Page
  const handleTagsPageToggle = () => {

    setPageview("tagsPage")

  };

  //Proccesses a new search string and passes it down to question
  const handleSearchString = (newString) =>{
    setSearchString(newString);
    //setShowWelcomePage(false);
    //setShowQuestionPage(true);
    setPageview("homePage")
    setTagState("");
    setFilter("newest");
    setshowQuestionAnswerPage(null)

  };

  //Process changes in the three filters and passes it down to question
  const setFilterHandler = (filter) =>{
    setTagState("");
    setFilter(filter)

  }

  //Passes changes in tag filtering state and passes it down question
  const handleTagStateChange = (newTagState) =>{
    //setShowWelcomePage(false);
    setTagState(newTagState);
    //setShowTagsPage(false);
    //setShowQuestionPage(null);

    //setShowQuestionPage(true);
    setPageview("homePage")

  }

  //Switches to the submit question page
  const handleSubmitQuestionPageToggle = () => {
    //setShowWelcomePage(false);
    //setShowQuestionPage(false)
    //setShowTagsPage(false);
    //setShowQuestionPage(null);

    //setShowSubmitQuestion(true);
    setPageview("submitQuestion")

  };

  //Switches to the answers page of a specific question
  const handleshowQuestionAnswerPage = (question) =>{
    //setShowWelcomePage(false);
    //setShowQuestionPage(false);
    //setShowTagsPage(false);
    //setShowSubmitQuestion(false);
    setPageview(null)
    setshowQuestionAnswerPage(question);

  }

  // Switches to the welcome page:

  const handleWelcomePageToggle = () => { // ***
    //setShowWelcomePage(true);
    //setShowQuestionPage(false);
    //setShowTagsPage(false);
    //setShowSubmitQuestion(false);
    setPageview("welcomePage");
    setshowQuestionAnswerPage(null);
    setShowSubmitAnswer(null);
    setSearchString("");
    setFilter("newest");
    setTagState("");
    setRegisteredState(false)
  }


  //Switches to the answers page of a specific question
  const handleShowSubmitAnswerPage = (question) =>{
    //setShowWelcomePage(false);
    //setShowQuestionPage(false)
    //setShowTagsPage(false)
    //setShowSubmitQuestion(false);
    setPageview(null)
    setshowQuestionAnswerPage(null)
    setShowSubmitAnswer(question)
  }
  
  //New handler for changing pages
  const changePageView = (newPage,args) =>{

    if(newPage === "returnToQuestion"){
      setPageview(null)
      setshowQuestionAnswerPage(args[0])

    }else if(newPage === "editQuestion"){
      setPageview("editQuestion")
      setShowEditedQuestion(args[0])
    }else if(newPage === "userTagsCreated"){
      setPageview("userTagsCreated")
      setShowTagsCreated(args[0])
      
    }else if(newPage === "adminViewUser"){
      setPageview("userProfile")
      setAdminViewUser(args[0])
    }else{
      setPageview(newPage)
      setshowQuestionAnswerPage(null)
      setShowSubmitAnswer(null)
      setAdminViewUser(null)
    }
    
  }

  //Handle logging in as a registered user
  const handleLogIn = (role) =>{
    setRegisteredState(true)
    if(role === "admin"){
      setAdminState(true)
    }
  }

  useEffect( ()=>{
    async function checkCookie(){

      try{
        let response = await axios.get(`http://localhost:8000/user/probecookie`,{withCredentials: true})

      if(response.data.cookie){
        setRegisteredState(true)
        if(pageView === 'welcomePage'){
          changePageView("homePage")
        }

        if(response.data.role === "admin"){
          setAdminState(true)
        }
      }else{
        setRegisteredState(false)
      }
      }catch(err){
        
      }
    }

    checkCookie()
  },[pageView])


  if (pageView === "welcomePage" && registeredState === false){ // *** 
    return (
      <>
      <FakeStackOverflowTopbar  toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <WelcomePage  toggleQuestionPage = {handleQuestionPageToggle} handleLogIn= {handleLogIn}/>
      </>
    );
  }else if(pageView === "userProfile"){

    if(adminState && adminViewUser){
      return(
        <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <AdminUserProfile handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} registeredState= {registeredState} changePageView ={changePageView}
        userid = {adminViewUser}/>
        </>
      )
    }else if(adminState){
      return(
        <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <AdminProfile handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} registeredState= {registeredState} changePageView ={changePageView}/>
        </>
      )
    }else{
      return(
        <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <UserProfile handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} registeredState= {registeredState} changePageView ={changePageView}/>
        </>
      )
    }
    
  }else if(pageView === "editQuestion"){
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <EditQuestionPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} changePageView ={changePageView}
        subjectQuestion = {showEditedQuestion} registeredState={registeredState}/>
      </>
    )
  }else if(pageView === "homePage"){
    return (
    <>
      <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <QuestionPage searchString={searchString} questionFilter = {questionFilter} setFilterHandler={setFilterHandler}
      toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} tagState={tagState} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle}
      handleshowQuestionAnswerPage ={handleshowQuestionAnswerPage} registeredState={registeredState} changePageView={changePageView}/>
    </>
    );
  }else if(pageView === "userTagsCreated"){

    return(
      <>
      <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <UserTagsPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} handleTagStateChange={handleTagStateChange} 
      tagsCreated={showTagsCreated} registeredState={registeredState} changePageView={changePageView}/>
      </>
    );
  }else if(pageView === "tagsPage"){
    return (
      <>
      <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <TagsPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} handleTagStateChange={handleTagStateChange} 
      registeredState={registeredState} changePageView={changePageView}/>
      </>
    )
  }else if(pageView === "submitQuestion"){

    if(registeredState === false){
      alert("LOGICAL ERROR: Guest User")
      //Logical error, hopefully doesn't trigger
    }
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <NewQuestionPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} changePageView={changePageView} registeredState={registeredState}/>
      </>
    )

  }else if(showQuestionAnswerPage != null){
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <ViewQuestion question ={showQuestionAnswerPage} handleQuestionPageToggle={handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle}
        handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle} handleShowSubmitAnswerPage={handleShowSubmitAnswerPage} registeredState={registeredState} 
        changePageView={changePageView}/>

      </>
    );
  }else if(showSubmitAnswer != null){
    if(registeredState === false){
      alert("LOGICAL ERROR: Guest User")
      //Logical error, hopefully doesn't trigger
    }
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <SubmitAnswer question ={showSubmitAnswer} toggleQuestionPage={handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} changePageView={changePageView}
        registeredState={registeredState}/>
      </>
    )
  }

}

export default App;
