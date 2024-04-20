// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
//import FakeStackOverflow from './components/fakestackoverflow.js'
import { useState } from 'react';
import {QuestionPage} from './components/questionpagecomponent.js'
import { FakeStackOverflowTopbar } from './components/globalcomponents.js';
import { TagsPage } from './components/tagspagecomponent.js';
import NewQuestionPage from './components/submitquestion.js'
import ViewQuestion from './components/viewquestion.js';
import SubmitAnswer from './components/submitanswer.js';


import WelcomePage from './components/welcomepage.js'; // ***
//Enter here, use this component to maintain state across the entire website
//This component will do the branching and switching between pages

function App() {

  //Page state variables
  const [showWelcomePage, setShowWelcomePage] = useState(true); // ***
  const [showQuestionPage, setShowQuestionPage] = useState(false); // *** chagned to false 
  const [showTagsPage, setShowTagsPage] = useState(false);
  const [showSubmitQuestion, setShowSubmitQuestion] = useState(false);
  const [showQuestionAnswerPage, setshowQuestionAnswerPage] = useState(null)
  const [showSubmitAnswer, setShowSubmitAnswer] = useState(null)

  const [questionFilter, setFilter] = useState("newest");
  const [searchString, setSearchString] = useState("");
  const [tagState, setTagState] = useState("");

  const handleQuestionPageToggle = () => {
    setShowWelcomePage(false);
    setShowQuestionPage(true);
    setShowTagsPage(false);
    setShowSubmitQuestion(false);
    setshowQuestionAnswerPage(null);
    setShowSubmitAnswer(null);
    setSearchString("");
    setFilter("newest");
    setTagState("");
  };

  //Tag > Search > Filter in order of priority

  //Switch to Tags Page
  const handleTagsPageToggle = () => {
    setShowWelcomePage(false);
    setShowQuestionPage(false);
    setShowSubmitQuestion(false);
    setShowTagsPage(true);
  };

  //Proccesses a new search string and passes it down to question
  const handleSearchString = (newString) =>{
    setSearchString(newString);
    setShowWelcomePage(false);
    setShowQuestionPage(true);
    setTagState("");
    setFilter("newest");
    setshowQuestionAnswerPage(null)

  };

  //Process changes in the three filters and passes it down to question
  const setFilterHandler = (filter) =>{
    setSearchString("");
    setTagState("");
    setFilter(filter)

  }

  //Passes changes in tag filtering state and passes it down question
  const handleTagStateChange = (newTagState) =>{
    setShowWelcomePage(false);
    setTagState(newTagState);
    setShowTagsPage(false);
    setShowQuestionPage(null);

    setShowQuestionPage(true);

  }

  //Switches to the submit question page
  const handleSubmitQuestionPageToggle = () => {
    setShowWelcomePage(false);
    setShowQuestionPage(false)
    setShowTagsPage(false);;
    setShowQuestionPage(null);

    setShowSubmitQuestion(true);

  };

  //Switches to the answers page of a specific question
  const handleshowQuestionAnswerPage = (question) =>{
    setShowWelcomePage(false);
    setShowQuestionPage(false);
    setShowTagsPage(false);
    setShowSubmitQuestion(false);
    setshowQuestionAnswerPage(question);

  }

  // Switches to the welcome page:

  const handleWelcomePageToggle = () => { // ***
    setShowWelcomePage(true);
    setShowQuestionPage(false);
    setShowTagsPage(false);
    setShowSubmitQuestion(false);
    setshowQuestionAnswerPage(null);
    setShowSubmitAnswer(null);
    setSearchString("");
    setFilter("newest");
    setTagState("");  
  }


  //Switches to the answers page of a specific question
  const handleShowSubmitAnswerPage = (question) =>{
    setShowWelcomePage(false);
    setShowQuestionPage(false)
    setShowTagsPage(false)
    setShowSubmitQuestion(false);
    setshowQuestionAnswerPage(null)
    setShowSubmitAnswer(question)
  }
  //const handleSubmitQuestionPage = () => {

  //}


/*   useEffect(() => {
    if (!showQuestionPage && !showTagsPage) {
      // Default to showing the QuestionPage if neither is set
      setShowQuestionPage(true);
    }
  }, [showQuestionPage, showTagsPage]); */

  if (showWelcomePage === true){ // *** 
    return (
      <>
      <FakeStackOverflowTopbar  toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <WelcomePage  toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} tagState={tagState} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle}/>
      </>
    );
  }
  else if(showQuestionPage === true){
    return (
    <>
      <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <QuestionPage searchString={searchString} questionFilter = {questionFilter} setFilterHandler={setFilterHandler}
      toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} tagState={tagState} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle}
      handleshowQuestionAnswerPage ={handleshowQuestionAnswerPage} />
    </>
    );
  }else if(showTagsPage === true){
    return (
      <>
      <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
      <TagsPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle} handleTagStateChange={handleTagStateChange} />

      </>
    )
  }else if(showSubmitQuestion === true){

    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <NewQuestionPage handleQuestionPageToggle = {handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle}/>
      </>
    )

  }else if(showQuestionAnswerPage != null){
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <ViewQuestion question ={showQuestionAnswerPage} handleQuestionPageToggle={handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle}
        handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle} handleShowSubmitAnswerPage={handleShowSubmitAnswerPage}/>

      </>
    );
  }else if(showSubmitAnswer != null){
    return(
      <>
        <FakeStackOverflowTopbar toggleWelcomePage = {handleWelcomePageToggle} toggleQuestionPage = {handleQuestionPageToggle} handleSearchString = {handleSearchString} />
        <SubmitAnswer question ={showSubmitAnswer} toggleQuestionPage={handleQuestionPageToggle} handleTagsPageToggle={handleTagsPageToggle}/>
      </>
    )
  }

}

export default App;
