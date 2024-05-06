import React, { useEffect, useState } from 'react';
import { FakeStackOverflowSidebar } from './globalcomponents';
import axios from 'axios';

export function EditQuestionPage({handleQuestionPageToggle,handleTagsPageToggle,changePageView,subjectQuestion,registeredState}){
    return(
        <div id='main_body' className='main_body'>
            <table className='main_body'>
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle} registeredState={registeredState}/>
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
        const tags = extractTags(questionData.edit_tags);

        const questionInputValidator = {
            questionTitle: questionData.edit_title.trim() !== '',
            questionSummary: questionData.edit_summary.trim() !== '',
            questionText: questionData.edit_text.trim() !== '',
            questionTags: questionData.edit_tags.trim() !== '',
        };

        Object.keys(questionInputValidator).forEach(field => {
            document.getElementById(`${field}Error`).innerHTML = "";
        });

        if (Object.values(questionInputValidator).some(item => !item)) {
            let emptyFields = Object.entries(questionInputValidator).filter(input => !input[1]);

            function fieldToString(emptyField) {
                if (emptyField[0] === "questionTitle") {
                    return "Please give your question a title";
                } else if (emptyField[0] === "questionText") {
                    return "Please enter your question in the question textbox";
                } else if (emptyField[0] === "questionTags") {
                    return "Please include at least one tag";
                }else if(emptyField[0] === "questionSummary"){
                    return "Please enter a summary"
                }
            }

            emptyFields.forEach(emptyField => {
                document.getElementById(`${emptyField[0]}Error`).innerHTML = fieldToString(emptyField);
            });

        } else if (questionData.edit_title.length > 50) {
            document.getElementById('questionTitleError').innerHTML = "Title should be no more than 50 characters";
        }else if(questionData.edit_summary.length > 120){
            document.getElementById('questionSummaryError').innerHTML = "Summary should be no more than 120 characters";
        } else if (tags.length > 5) {
            document.getElementById('questionTagsError').innerHTML = "There should be no more than 5 tags";
        } else if (tags.some(input => input.length > 20)) {
            document.getElementById('questionTagsError').innerHTML = "A tag should no longer than 20 characters";
        }else {
                
            submitEditQuestion(tags).then(()=>{
                handleQuestionPageToggle()
            }).catch((error)=>{
                if(error.message === "Error: Cannot create Tag"){
                    document.getElementById('questionTagsError').innerHTML = "Not enough reputation to create a new tag";
                }else if(error.message === "Error: User not logged in"){
                    alert("User not logged in, returning to homepage")
                    changePageView("welcomePage",null)
                }else if(error.message === "AxiosError: Request failed with status code 500"){
                    document.getElementById('questionTagsError').innerHTML = "Request failed with status code 500"
                }else{
                    document.getElementById('questionTagsError').innerHTML = "Server is down, please try again later";
                }
            })

            // to navigate to the QuestionPage after submitting
            
        }
    }
    function extractTags(text) {
        const regex = /([\w-]+)/g;
        const matches = [];
        let match;
        while ((match = regex.exec(text)) != null) {
            matches.push(match[1]);
        }

        let matchesNoDupes = [...new Set(matches)];
        matchesNoDupes = matchesNoDupes.map((x) => x.toLowerCase());

        return matchesNoDupes;
    }

    const submitEditQuestion = async (tagsArray) => {
        const questionPackage ={
            title: questionData.edit_title,
            summary: questionData.edit_summary,
            text: questionData.edit_text,
            tags: tagsArray,
        }
        try {
            let response = await axios.post('http://localhost:8000/user/editQuestion/'+subjectQuestion._id, questionPackage, {withCredentials: true});

            if (response.data.success) {
                console.log('succsess creating question'); // need to redirect to the questions page
            }else {
                throw new Error(response.data.error)
            }
        } catch(error) {
            console.error('Error creating new question', error);
            throw new Error(error)
        }
    };


    function deleteQuestion(){
        axios.delete('http://localhost:8000/singleQuestion/'+subjectQuestion._id,{withCredentials: true}).then(()=>{
            alert("Question successfully deleted!")
            changePageView("userProfile",[])
        }).catch((err)=>{
            alert(err.message)
        })
        
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
                    <input type='text' id='edit_title' maxLength='100' value={questionData.edit_title} onChange={handleInputChange} required />
                    <p id='questionTitleError' class = 'errorText'></p>
                    <h2>Question Summary</h2>
                    <textarea id='edit_summary' rows="5" cols="80" value={questionData.edit_summary} onChange={handleInputChange}></textarea>
                    <p id='questionSummaryError' class = 'errorText'></p>
                    <h2>Question Text*</h2>
                    <p><i>Add details</i></p>
                    <textarea id='edit_text' rows="5" cols="80" value={questionData.edit_text} onChange={handleInputChange}></textarea>
                    <p id='questionTextError' class = 'errorText'></p>
                    <h2>Tags*</h2>
                    <p><i>Add keywords separated by whitespace</i></p>
                    <input type='text' id='edit_tags' value={questionData.edit_tags} onChange={handleInputChange} required />
                    <p id='questionTagsError' class = 'errorText'></p>
                    <button id='questionPost' onClick={verifyQuestionFields}>Edit Question</button><button id='questionDelete' onClick={deleteQuestion}>Delete Question</button>
                </div>
            </div>
        </td>
    );
}