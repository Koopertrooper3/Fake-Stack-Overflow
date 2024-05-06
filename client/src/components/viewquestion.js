
import React, { useEffect, useState } from 'react';
import { FakeStackOverflowSidebar } from './globalcomponents';
import { dbFormatDate } from '../models/datamethods';
import axios from 'axios';

function ViewQuestion({ question, handleQuestionPageToggle, handleTagsPageToggle, handleSubmitQuestionPageToggle, handleShowSubmitAnswerPage, registeredState,changePageView }) {

    const [answers, setAnswers] = useState([]);
    const [comments, setComments] = useState([]);
    const [newCommentText, setNewCommentText] = useState('');
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(3);
    const [startAIndex, setStartAIndex] = useState(0);
    const [endAIndex, setEndAIndex] = useState(2);
    
    useEffect(() => {
        let answerElems = [];
        question.answers.slice(startAIndex, endAIndex).forEach((answer) => {
            answerElems.push(<AnswerElement key={answer._id} answer={answer} ansDate={dbFormatDate(answer.ans_date_time)} registeredState={registeredState} />);
        });
        setAnswers(answerElems);

        // Fetch comments for the question
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/comments/${question._id}`, { withCredentials: true });
                setComments(response.data.comments);
                
            } catch (error) {
                //alert('smt is here!');
                console.error('Error fetching comments:', error);
            }
        };
        fetchComments();
    }, [question, registeredState, startAIndex, endAIndex]);

    const handleNewCommentChange = (event) => {
        setNewCommentText(event.target.value);
    };

    const handleNewCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            //alert('here!');
            await axios.post('http://localhost:8000/addComment', {
                questionId: question._id,
                text: newCommentText,

            }, { withCredentials: true });
            // Refresh comments
            const response = await axios.get(`http://localhost:8000/comments/${question._id}`, { withCredentials: true });
            setComments(response.data.comments);
            // Clear the input field
            setNewCommentText('');
            //alert('here success!');
        } catch (error) {
            //alert('here error!')
            console.error('Error adding comment:', error);
        }
    };

    const handleNext = () => {
        setStartIndex(startIndex + 3);
        setEndIndex(endIndex + 3);
    };

    const handlePrev = () => {
        setStartIndex(startIndex - 3);
        setEndIndex(endIndex - 3);
    };

    const handleNextAnswers = () => {
        setStartAIndex(startAIndex + 2);
        setEndAIndex(endAIndex + 2);
    };

    const handlePrevAnswers = () => {
        setStartAIndex(startAIndex - 2);
        setEndAIndex(endAIndex - 2);
    };


    return (
        <div className='main_body'>
            <table className='main_body'>
                <tbody>
                    <tr className='main_body'>                   
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle} registeredState={registeredState}
                        changePageView={changePageView}/>
                        <td id='main_content' className='main_content'>
                            <div>
                                <QuestionElement question={question} handleSubmitQuestionPageToggle={handleSubmitQuestionPageToggle} registeredState={registeredState} />
                                {answers}
                                {question.answers.length > 2 && (
                                    <div>
                                        <button onClick={handlePrevAnswers} disabled={startAIndex === 0}>Prev Answers</button>
                                        <button onClick={handleNextAnswers} disabled={endAIndex >= question.answers.length}>Next Answers</button>
                                    </div>
                                )}
                                <div style={{marginTop: '1px'}}>
                                    <h4>Comments</h4>
                                    <ul>
                                        {comments.slice(startIndex, endIndex).map(comment => (
                                            <li style={{display: 'flex', alignItems: 'left', justifyContent: 'space-between', width: '100%', height: '20px', borderStyle: 'dotted'}} key={comment._id}>
                                                <span  style={{ color: 'red', marginLeft: '40px' }}>{comment.comment_by.username} : </span> <span style={{ marginRight: '80%', alignItems: 'left', textAlign: 'left' }}>{comment.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {comments.length > 3 &&
                                        <div>
                                            <button onClick={handlePrev} disabled={startIndex === 0}>Prev</button>
                                            <button onClick={handleNext} disabled={endIndex >= comments.length}>Next</button>
                                        </div>
                                    }
                                </div>
                                <br></br>
                                {registeredState && <NewCommentForm
                                   
                                    newCommentText={newCommentText}
                                    handleNewCommentChange={handleNewCommentChange}
                                    handleNewCommentSubmit={handleNewCommentSubmit}
                                />}
                                
                                {registeredState && <AnswerQuestionButton question={question} handleShowSubmitAnswerPage={handleShowSubmitAnswerPage} />}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function QuestionElement({ question, handleSubmitQuestionPageToggle, registeredState }) {

    useEffect(() => {
        async function incrementView() {
            try {
                await axios.post('http://localhost:8000/questionIncrementView', question);
            } catch (error) {
                console.error('Error creating new question', error);
            }
        }

        question.views += 1
        incrementView()
    }, [question]);

    return (
        <div className='innerQuestion'>
            <div className='blockSideContent'>
                <h4>{question.answers.length > 1 ? `${question.answers.length} answers` : `${question.answers.length} answer`}</h4>
                <br />
                <h4>{question.views} views</h4>
            </div>
            <div className='blockCenterContent'>
                <h3 className='innerQuestionTitle'>{question.title}</h3>
                <br />
                <p>{question.text}</p>
            </div>
            <div className='blockSideContent'>
                {registeredState && <button id="answer_page_ask_question_button" onClick={handleSubmitQuestionPageToggle}>Ask Question</button>}
                <p className="questionUsername">{question.asked_by.username}</p>
                <p>{dbFormatDate(question.ask_date_time)}</p>
            </div>
        </div>
    );
}

function AnswerElement({ answer, ansDate, registeredState }) {
    const [votes, setVotes] = useState(answer.votes);
    
    


    const handleAnswerUpvote = async (answerId) => {
        try {
            const response = await axios.post('http://localhost:8000/incrementAnswerVotes', { answerId }, {withCredentials: true});

            const updatedVotes = response.data;
            setVotes(updatedVotes);

        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };

    const handleAnswerDownvote = async (answerId) => {
        try {
            const response = await axios.post('http://localhost:8000/decrementAnswerVotes', { answerId },{withCredentials: true});

            const updatedVotes = response.data;
            setVotes(updatedVotes);

        } catch (error) {
            console.error('Error updating votes:', error);
        }
    };

    return (
        <div className='answer' key={answer.aid}>
            {registeredState && <div style={{ marginBottom: '20px' }}>
                <button style={{ color: 'rgb(70, 131, 71)' }} onClick={() => handleAnswerUpvote(answer._id)} className="voteButton" aria-label="Upvote" >
                    ▲
                                </button>
                <br />
                <span style={{ marginLeft: '38%' }}>{votes}</span>
                <br />
                <button style={{ color: 'rgb(237, 86, 70)' }} onClick={() => handleAnswerDownvote(answer._id)} className="voteButton" aria-label="Downvote">
                    ▼
                                </button>
            </div>}
            <div className='answerElement'>
                <p>{answer.text}</p>
            </div>
            <div className='answerElement'>
                <p><span style={{ color: 'green' }}>{answer.ans_by.username}</span> <br />
                    <span style={{ color: 'gray' }}>answered {ansDate}</span></p>
            </div>
        </div>
    );
}


function AnswerQuestionButton({ question, handleShowSubmitAnswerPage }) {
    return (
        <div>
            <button id="answerQuestion" onClick={() => handleShowSubmitAnswerPage(question)}>Answer Question</button>
        </div>
    )
}

function NewCommentForm({ newCommentText, handleNewCommentChange, handleNewCommentSubmit }) {
    return (
        <form onSubmit={handleNewCommentSubmit}>
            <label>
                Add a comment:
                <input type="text" value={newCommentText} onChange={handleNewCommentChange} />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}

export default ViewQuestion;
