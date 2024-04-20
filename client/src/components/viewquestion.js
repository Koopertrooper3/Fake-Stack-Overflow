
import React, { useEffect, useState } from 'react'
import { FakeStackOverflowSidebar } from './globalcomponents';
import { dbFormatDate } from '../models/datamethods';
import axios from 'axios';
//import Question from 'question'



function ViewQuestion({question, handleQuestionPageToggle, handleTagsPageToggle, handleSubmitQuestionPageToggle,handleShowSubmitAnswerPage}) {

    
    const [answers,setAnswers] = useState([])
    
    useEffect( ()=>{

        let answerElems = []
        question.answers.forEach((answer)=>{
            answerElems.push(<AnswerElement answer= {answer} ansDate = {dbFormatDate(answer.ans_date_time)}/>)
        })

        setAnswers(answerElems)
    },[question,setAnswers])
    return(
        <div className='main_body'>
            <table className='main_body'>
                <tbody>
                    <tr className='main_body'>
                        
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle}/>
                        <td id='main_content' className='main_content'>
                            <div>
                                <QuestionElement question={question} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle}/>
                                {answers}
                                <AnswerQuestionButton question={question} handleShowSubmitAnswerPage={handleShowSubmitAnswerPage}/>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function QuestionElement({question,handleSubmitQuestionPageToggle}){

    useEffect( ()=>{
        async function incrementView(){
            try {
                await axios.post('http://localhost:8000/questionIncrementView', question);
            } catch(error) {
                console.error('Error creating new question', error);
            }
        }

        question.view += 1
        incrementView()
    },[question]);
    
    return(
        <div className='innerQuestion'>
            <div className='blockSideContent'>
                <h4>{question.answers.length > 1 ? `${question.answers.length} questions`: `${question.answers.length} question`}</h4>
                <br/>
                <h4>{question.views} views</h4>
            </div>
            <div className='blockCenterContent'>
                <h3 className='innerQuestionTitle'>{question.title}</h3>
                <br/>
                <p>{question.text}</p>
            </div>  
            <div className='blockSideContent'>
                <button id="answer_page_ask_question_button" onClick={handleSubmitQuestionPageToggle}>Ask Question</button>
                <p class="questionUsername">{question.asked_by}</p>
                <p>{dbFormatDate(question.ask_date_time)}</p>
            </div>                       
        </div>
    );
}

function AnswerElement({answer,ansDate}){
    const [votes, setVotes] = useState(answer.votes);
    const handleAnswerUpvote = async (answerId) => {
        try {
            const response = await axios.post('http://localhost:8000/incrementAnswerVotes', { answerId });
    
            const updatedVotes = response.data;
            setVotes(updatedVotes);
/*
            this.setState((prevState) => {
                const updatedAnswers = prevState.answers.map((answer) => {
                    if (answer._id === answerId) {
                        return { ...answer, votes: updatedVotes };
                    }
                    return answer;
                });
                return { answers: updatedAnswers };
            });
            */
        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };
    
    const handleAnswerDownvote = async (answerId) => {
        try {
            const response = await axios.post('http://localhost:8000/decrementAnswerVotes', { answerId });
    
            const updatedVotes = response.data;
            setVotes(updatedVotes);
    /*
            this.setState((prevState) => {
                const updatedAnswers = prevState.answers.map((answer) => {
                    if (answer._id === answerId) {
                        return { ...answer, votes: updatedVotes };
                    }
                    return answer;
                });
                return { answers: updatedAnswers };
            });
*/
        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };

    return(
        <div className='answer' key={answer.aid}>
            <div style={{marginBottom: '20px'}}>
                                <button style={{color: 'rgb(70, 131, 71)'}} onClick={() => handleAnswerUpvote(answer._id)} className="voteButton" aria-label="Upvote" >
                                ▲
                                </button>
                                <br />
                                <span style={{marginLeft: '38%'}}>{votes}</span>
                                <br />
                                <button style={{color: 'rgb(237, 86, 70)'}} onClick={() => handleAnswerDownvote(answer._id)} className="voteButton" aria-label="Downvote">
                                ▼
                                </button>
            </div> 
            <div className='answerElement'>
                <p>{answer.text}</p>
            </div>
            <div className='answerElement'>
                <p><span style={{color: 'green'}}>{answer.ans_by}</span> <br/>
                <span style={{color: 'gray'}}>answered {ansDate}</span></p>
            </div>
        </div>
    );
}

function AnswerQuestionButton({question,handleShowSubmitAnswerPage}){
    return(
        <div>
            <button id="answerQuestion" onClick={()=>handleShowSubmitAnswerPage(question)}>Answer Question</button>
        </div>
    )
}
export default ViewQuestion;
