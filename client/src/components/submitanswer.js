
import React from 'react';
import { FakeStackOverflowSidebar } from './globalcomponents';
import '../stylesheets/App.css';
import axios from 'axios';

class SubmitAnswer extends React.Component {
  render() {
    return (
      <div id='main_body' className='main_body'>
        <table className='main_body'>
          <tbody>
            <tr className='main_body'>
              <FakeStackOverflowSidebar toggleQuestionPage={this.props.toggleQuestionPage} handleTagsPageToggle={this.props.handleTagsPageToggle} />
              <SubmitAnswerForm question={this.props.question} toggleQuestionPage={this.props.toggleQuestionPage} />
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function SubmitAnswerForm({ question, toggleQuestionPage }) {



  const [answerInputValidator, setAnswerInputValidator] = React.useState({
    answerUsername : false,
    answerText : false,
  })
  const [answerUsername, setAnswerUsername] = React.useState('');
  const [answerText, setAnswerText] = React.useState('');

  const handleUsernameInputChange = (event) => {
    setAnswerUsername(event.target.value);
    if(event.target.value.length > 0){
      const {id} = event.target
      setAnswerInputValidator((prevData)=>{
        const newData = { ...prevData, [id]: true}
        return newData
      })
    }else{
      const {id} = event.target
      setAnswerInputValidator((prevData)=>{
        const newData = { ...prevData, [id]: false}
        return newData
      })
    }
  };

  const handleAnswerTextInputChange = (event) => {
    setAnswerText(event.target.value);
    if(event.target.value.length > 0){
      const {id} = event.target
      setAnswerInputValidator((prevData)=>{
        const newData = { ...prevData, [id]: true}
        return newData
      })
    }else{
      const {id} = event.target
      setAnswerInputValidator((prevData)=>{
        const newData = { ...prevData, [id]: false}
        return newData
      })
    }
  };

  const submitAnswer = async () => {
    try {
      await axios.post('http://localhost:8000/submitAnswer', { questionid: question._id, answer_text: answerText, answer_username: answerUsername });
      toggleQuestionPage();
    } catch (error) {
      console.error('Error creating new answer', error);
    }
  };

  const validateAnswer = ()=>{


    Object.keys(answerInputValidator).forEach(function(field){
      document.getElementById(`${field}Error`).innerHTML = ""
    })

    if((Object.values(answerInputValidator).some(item => !item))){
      let validatorEntires = Object.entries(answerInputValidator);
      let emptyAnsFields = validatorEntires.filter(input => input[1] === false);

      function fieldToString(emptyField){
        if(emptyField[0] === "answerUsername"){
          return "Please enter your username."
        }else if(emptyField[0] === "answerText"){
          return "Please fill in an answer in the answer text"
        }
      }


      emptyAnsFields.forEach(function(emptyField){
        document.getElementById(`${emptyField[0]}Error`).innerHTML = fieldToString(emptyField)
      })
    }else{
      submitAnswer(question)
    }

  }

  return (
    <td id="main_content" className="main_content">
      <div className="newAnswer">
        <h2>Username*</h2>
        <input type="text" id="answerUsername" value={answerUsername} onChange={handleUsernameInputChange} />
        <p id="answerUsernameError" className="errorText"></p>
        <h2>Answer Text*</h2>
        <textarea id="answerText" rows="10" cols="100" value={answerText} onChange={handleAnswerTextInputChange}></textarea>
        <p id="answerTextError" className="errorText"></p>
        <button id="answerPost" onClick={validateAnswer}>Post Answer</button>
      </div>
    </td>
  );
}

export default SubmitAnswer;
