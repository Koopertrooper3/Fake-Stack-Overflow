import React, { useEffect, useState } from 'react';
import { FakeStackOverflowSidebar } from './globalcomponents';
import axios from 'axios';

export function EditQuestionPage({handleQuestionPageToggle,handleTagsPageToggle,changePageView,subjectQuestion}){
    return(
        <div id='main_body' className='main_body'>
            <table className='main_body'>
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle}/>
                        <EditQuestionForm subjectQuestion = {subjectQuestion} handleQuestionPageToggle={handleQuestionPageToggle} changePageView={changePageView}/>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

function EditQuestionForm({subjectQuestion,handleQuestionPageToggle,changePageView}){

    const [questionData, setQuestionData] = useState({
        edit_title: subjectQuestion.title,
        edit_summary: subjectQuestion.summary,
        edit_text: subjectQuestion.text,
        edit_tags: '',
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setQuestionData((prevData) => {
            const newData = { ...prevData, [id]: value };
            return newData;
        });
    };

    function verifyQuestionFields(){

    }

    async function deleteQuestion(){
        let response = await axios.delete('http://localhost:8000/singleQuestion/'+subjectQuestion._id)
        changePageView("userProfile",[])
    }

    useEffect(()=>{
        //Unroll the tag string
        async function unrollTagString(){

            let response = await axios.get('http://localhost:8000/singleQuestion/'+subjectQuestion._id)
            let question = response.data.question
            let finalTagString = question.tags.reduce((tagstring, elem)=>{
    
                return tagstring += elem.name + " "
    
            },"")

            setQuestionData((prevData) => {
                const newData = { ...prevData, edit_tags: finalTagString };
                return newData;
            });
        }

        unrollTagString()
    },[subjectQuestion._id])


    return (
        <td id='main_content' className='main_content'>
            <div className='newQuestion'>
                <div className='newQuestionContents'>
                    <h2>Question Title*</h2>
                    <p><i>Limit title to 100 characters or less</i></p>
                    <input type='text' id='new_title' maxLength='100' value={questionData.edit_title} onChange={handleInputChange} required />
                    <p id='questionTitleError' class = 'errorText'></p>
                    <h2>Question Summary</h2>
                    <textarea id='new_summary' rows="5" cols="80" value={questionData.edit_summary} onChange={handleInputChange}></textarea>
                    <p id='questionSummaryError' class = 'errorText'></p>
                    <h2>Question Text*</h2>
                    <p><i>Add details</i></p>
                    <textarea id='new_text' rows="5" cols="80" value={questionData.edit_text} onChange={handleInputChange}></textarea>
                    <p id='questionTextError' class = 'errorText'></p>
                    <h2>Tags*</h2>
                    <p><i>Add keywords separated by whitespace</i></p>
                    <input type='text' id='new_tags' value={questionData.edit_tags} onChange={handleInputChange} required />
                    <p id='questionTagsError' class = 'errorText'></p>
                    <button id='questionPost' onClick={verifyQuestionFields}>Edit Question</button><button id='questionDelete' onClick={deleteQuestion}>Delete Question</button>
                </div>
            </div>
        </td>
    );
}