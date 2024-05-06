
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
              <SubmitAnswerForm question={this.props.question} toggleQuestionPage={this.props.toggleQuestionPage} changePageView={this.props.changePageView}
              registeredState={this.props.registeredState}/>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function SubmitAnswerForm({ question, toggleQuestionPage,changePageView }) {

  const [answerInputValidator, setAnswerInputValidator] = React.useState({
    answerText : false,
  })
  const [answerText, setAnswerText] = React.useState('');

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
      let response = await axios.post('http://localhost:8000/submitAnswer', { questionid: question._id, answer_text: answerText},{withCredentials: true});

      if(response.data.success){
        changePageView("returnToQuestion",[response.data.updatedQuestion])
      }else{
        throw new Error(response.data.error)
      }
    } catch (error) {
      console.error('Error creating new answer', error);

      if(error.message === "Network Error"){
        document.getElementById("answerTextError").innerHTML = "Error in trying to connect with the server, please try again later."
      }else if(error.message === "User not logged in"){
        alert("User not logged in, please log in again.")
        changePageView("welcomePage",null)
      }else{
        document.getElementById("answerTextError").innerHTML = error.message
      }
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
        if(emptyField[0] === "answerText"){
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
        <h2>Answer Text*</h2>
        <textarea id="answerText" rows="10" cols="100" value={answerText} onChange={handleAnswerTextInputChange}></textarea>
        <p id="answerTextError" className="errorText"></p>
        <button id="answerPost" onClick={validateAnswer}>Post Answer</button>
      </div>
    </td>
  );
}

export default SubmitAnswer;
