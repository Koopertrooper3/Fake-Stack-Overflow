import React, {useState, useEffect} from 'react'
import '../stylesheets/App.css';
import {FakeStackOverflowSidebar } from './globalcomponents.js';
import axios from 'axios';

import { dbCountQuestionsPerTag, dbGetAndSearchQuestions, dbGetAndFilterQuestions,dbCountTagsPerQuestion, dbFormatDate } from '../models/datamethods.js';
//This is the Question page,the page that lists all the questions and 
//considered the homepage of the website

//This will be used as the homepage/questions page
export function QuestionPage({model,searchString, questionFilter,setFilterHandler,toggleQuestionPage,handleTagsPageToggle,tagState,handleSubmitQuestionPageToggle,handleshowQuestionAnswerPage,registeredState}) {
    return (
        <QuestionContent model={model} searchString={searchString} questionFilter = {questionFilter} setFilterHandler={setFilterHandler} 
        toggleQuestionPage = {toggleQuestionPage} handleTagsPageToggle={handleTagsPageToggle} tagState={tagState} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle}
        handleshowQuestionAnswerPage={handleshowQuestionAnswerPage} registeredState={registeredState}/>
    );
}

class QuestionContent extends React.Component{

    render() {
        return (
        <div id ="main_body" className="main_body">
            <table className="main_body">
                <tbody>
                    <tr className="main_body">
                        <FakeStackOverflowSidebar toggleQuestionPage = {this.props.toggleQuestionPage} handleTagsPageToggle = {this.props.handleTagsPageToggle}/>
                        <QuestionMainContent model={this.props.model} searchString ={this.props.searchString}
                        questionFilter = {this.props.questionFilter} setFilterHandler={this.props.setFilterHandler} tagState={this.props.tagState} 
                        handleshowQuestionAnswerPage={this.props.handleshowQuestionAnswerPage} handleSubmitQuestionPageToggle = {this.props.handleSubmitQuestionPageToggle}
                        registeredState={this.props.registeredState} />
                        {/*Add question page here */}
                    </tr>
                </tbody>
            </table>
        </div>
        )
    }
}

function QuestionMainContent({model, searchString, questionFilter, setFilterHandler, tagState, handleshowQuestionAnswerPage,handleSubmitQuestionPageToggle,registeredState}){
    //Tables cannot be nested under tables
    const [numOfQuestions, setNumOfQuestions] = useState(0);
    const [questions,setQuestions] = useState([])

    function setNumberOfQuestions(num){
        setNumOfQuestions(num)
    }

    useEffect(() =>{


        axios.all([
            axios.get(`http://localhost:8000/tags`), 
            axios.get(`http://localhost:8000/questions`)
          ]).then(axios.spread((tags, questions) => {

            questions = questions.data
            tags = tags.data
            if(tagState !== ""){

                questions = dbCountQuestionsPerTag(tagState,questions);
                
            }else if(searchString !== ""){

                questions = dbGetAndSearchQuestions(searchString,questions,tags);
                console.log("searchstring");

            }else{
                questions = dbGetAndFilterQuestions(questionFilter,questions);
                console.log("filter")
            }

            let questionElements = [];
            questions.forEach(element => {

                let thisQuestionTags = dbCountTagsPerQuestion(element,tags)
                thisQuestionTags = thisQuestionTags.map(tag =>{
                    return <TagElement tag={tag} />
                })

                let date = dbFormatDate(element.ask_date_time)
                questionElements.push(<QuestionElement question={element} tags={thisQuestionTags} date={date} handleshowQuestionAnswerPage={handleshowQuestionAnswerPage}
                registeredState = {registeredState}/>)
            });

            setQuestions(questionElements)
            setNumberOfQuestions(questionElements.length)

          }));
        
    },[model,questionFilter,handleshowQuestionAnswerPage,searchString,tagState,registeredState])

    return(
        <table className="main_content" id="main_table_body">
            <tbody>
                <QuestionHeader setFilterHandler={setFilterHandler} numOfQuestions={numOfQuestions} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle} registeredState={registeredState}/>
                {/*Actual questions here */}
                <Listofquestions questions={questions} filter={questionFilter}/>
            </tbody>
        </table>
    )
}

function QuestionHeader({setFilterHandler,numOfQuestions,handleSubmitQuestionPageToggle,registeredState}){
    return(
        <tr className="main_content" id="main_content_tr_header">
          <td id="main_content_header" className="main_content">
            <table className="main_content_header"> 

                <tbody>
                    <QuestionHeaderRowOne handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle} registeredState={registeredState}/>
      
                    <QuestionHeaderRowTwo setFilterHandler={setFilterHandler} numOfQuestions={numOfQuestions}/>
                </tbody>
            </table> 
          </td> 
        </tr>
    )
}

function QuestionHeaderRowOne({handleSubmitQuestionPageToggle,registeredState}){
    /* const [showSubmitQuestion, setShowSubmitQuestion] = useState(false);

    const toggleSubmitQuestion = () => {
        setShowSubmitQuestion(!showSubmitQuestion);
    }; */
    return(
        <tr className="main_content_header">
            <td className="main_content_header">
                <h2 className="main_content_header" id="allOrSearch">All Questions</h2>
            </td>
            <td className="main_content_header">
                {registeredState ? <button id="ask_question_button" onClick={handleSubmitQuestionPageToggle}>Ask Question</button> : null}
            </td>
        </tr>
    )
}

function QuestionHeaderRowTwo({setFilterHandler, numOfQuestions}){
    return(
        <tr className="main_content_header" id="main_content_tr_body">
            <td className="main_content_header">
                <h4 className="main_content_header" id="numQuestions">{numOfQuestions > 1 ? `${numOfQuestions} questions`: `${numOfQuestions} question`}</h4>
            </td>
            <td className="main_content_header">
                <QuestionFilterMenu setFilterHandler={setFilterHandler}/>
            </td>
        </tr>
    )
}

function QuestionFilterMenu( {setFilterHandler} ){

    return(
        <table className="questions_menu">
            <tbody>
                <tr className="questions_menu">
                    <td className="questions_menu" id="sortNewest" onClick={() => setFilterHandler("newest")}>Newest</td>
                    <td className="questions_menu" id="sortActive" onClick={() => setFilterHandler("active")}>Active</td>
                    <td className="questions_menu" id="sortUnanswered" onClick={() => setFilterHandler("unanswered")}>Unanswered</td>
                </tr>
            </tbody>
        </table>
    )
}

function Listofquestions({questions}){
    
    return(
        <tr className="main_content">
            <td id='content_main_body' className='main_content'>
                {questions}
            </td>
        </tr>
    )
}

function TagElement({tag}){
    return( <p className='tags'>{tag}</p>)
}
function QuestionElement({ question, tags, date, handleshowQuestionAnswerPage,registeredState }) {
    const [votes, setVotes] = useState(question.votes);

    const handleUpvote = async () => {
        try {
            const response = await axios.post('http://localhost:8000/incrementVotes', { question });
            if (response.status === 200) {
                // Update the question's votes directly from the server response
                question.votes += 1;
                setVotes(prevVotes => prevVotes + 1);
                //alert('succsess yooohooooooo');
            }
        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };

    const handleDownvote = async () => {
        try {
            const response = await axios.post('http://localhost:8000/decrementVotes', { question });
            if (response.status === 200) {
                // Update the question's votes directly from the server response
                question.votes -= 1;
                setVotes(prevVotes => prevVotes - 1);
            }
        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };

    return (
        <div className="question">
            <div className="questionElement">
                <p className='questionStats'>{question.answers.length} answers</p>
                <p className='questionStats'>{question.views} views</p>
            </div>
            {registeredState && <div id="voteButtons">
                <button onClick={handleUpvote} className="voteButton" aria-label="Upvote">
                    ▲
                </button>
                <br />
                <span>{votes}</span>
                <br />
                <button onClick={handleDownvote} className="voteButton" aria-label="Downvote">
                    ▼
                </button>
            </div>}
            <div className="questionElement">
                <h3 className='questionTitle' onClick={() => handleshowQuestionAnswerPage(question)} key={question._id}>{question.title}</h3>
                <div><p1 className='questionSummary' key={question._id}>{question.summary}</p1></div>
                <div>{tags}</div>
            </div>
            <div className="questionElement">
                <p className='authorInfo'>
                    <span className="questionUsername">{question.asked_by.username}</span> asked {date}
                </p>
            </div>
            {/*
            <div style={{margin: '8px', display: 'block'}}>
                <h3 style={{color: 'red', fontWeight: 'lighter'}}>  comments</h3>
                             
                            <label>Comment</label>
                            <input style={{width: '300px'}}></input>
                            
            </div>
            */}
                
        </div>
    );
}