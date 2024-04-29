import React, { useState } from 'react';
import { FakeStackOverflowSidebar } from './globalcomponents';
import axios from 'axios';

function NewQuestionPage({handleQuestionPageToggle,handleTagsPageToggle}){
    return(
        <div id='main_body' className='main_body'>
            <table className='main_body'>
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle}/>
                        <NewQuestionForm handleQuestionPageToggle={handleQuestionPageToggle}/>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
const NewQuestionForm = ({handleQuestionPageToggle}) => {
    const [questionData, setQuestionData] = useState({
        new_title: '',
        new_text: '',
        new_tags: '',
    });

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setQuestionData((prevData) => {
            const newData = { ...prevData, [id]: value };
            return newData;
        });
    };

    const submitQuestion = async (tagsArray) => {
        const questionPackage ={
            title: questionData.new_title,
            text: questionData.new_text,
            tags: tagsArray,
        }
        try {
            await axios.post('http://localhost:8000/questions', questionPackage, {withCredentials: true});
            handleQuestionPageToggle()
        } catch(error) {
            console.error('Error creating new question', error);
        }
    };

    function verifyQuestionFields() {
        const tags = extractTags(questionData.new_tags);

        const questionInputValidator = {
            questionTitle: questionData.new_title.trim() !== '',
            questionText: questionData.new_text.trim() !== '',
            questionTags: questionData.new_tags.trim() !== '',
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
                }
            }

            emptyFields.forEach(emptyField => {
                document.getElementById(`${emptyField[0]}Error`).innerHTML = fieldToString(emptyField);
            });

        } else if (questionData.new_title.length > 100) {
            document.getElementById('questionTitleError').innerHTML = "Title should be no more than 100 characters";
        } else if (tags.length > 5) {
            document.getElementById('questionTagsError').innerHTML = "There should be no more than 5 tags";
        } else if (tags.some(input => input.length > 20)) {
            document.getElementById('questionTagsError').innerHTML = "A tag should no longer than 20 characters";
        }else {
            try {
                
                submitQuestion(tags)

                // to navigate to the QuestionPage after submitting
            } catch (error) {
                console.error('Error creating new question', error);
                handleQuestionPageToggle()

            }
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


    return (
        <td id='main_content' className='main_content'>
            <div className='newQuestion'>
                <div className='newQuestionContents'>
                    <h2>Question Title*</h2>
                    <p><i>Limit title to 100 characters or less</i></p>
                    <input type='text' id='new_title' maxLength='100' value={questionData.new_title} onChange={handleInputChange} required />
                    <p id='questionTitleError' class = 'errorText'></p>
                    <h2>Question Text*</h2>
                    <p><i>Add details</i></p>
                    <textarea id='new_text' rows="10" cols="100" value={questionData.new_text} onChange={handleInputChange}></textarea>
                    <p id='questionTextError' class = 'errorText'></p>
                    <h2>Tags*</h2>
                    <p><i>Add keywords separated by whitespace</i></p>
                    <input type='text' id='new_tags' value={questionData.new_tags} onChange={handleInputChange} required />
                    <p id='questionTagsError' class = 'errorText'></p>
                    <button id='questionPost' onClick={verifyQuestionFields}>Post Question</button>
                </div>
            </div>
        </td>
    );

}

export default NewQuestionPage;