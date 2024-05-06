import React, {useState, useEffect} from 'react'
import '../stylesheets/App.css';
import {FakeStackOverflowSidebar } from './globalcomponents.js';
import axios from 'axios';
import {dbCountQuestionsPerTag} from '../models/datamethods.js'
//This is the Tags page,the page that lists all the tags in them model

//This will be used as THE entry point for tags
export function  UserTagsPage({handleQuestionPageToggle,handleTagsPageToggle,handleTagStateChange,tagsCreated,registeredState,changePageView}) {
    return (
        <div id="main_body" class="main_body"> 
            <table className="main_body">
            <tbody>
                <tr className="main_body">
                    <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle} registeredState={registeredState} changePageView={changePageView}/>
                    <TagsMainContent handleTagStateChange={handleTagStateChange} tagsCreated={tagsCreated} changePageView={changePageView}/>
                </tr>
            </tbody>
        </table>
        </div>
    );
}

function TagsMainContent({handleTagStateChange,tagsCreated,changePageView}){

    const [numOfTags, setNumOfTags] = useState(0)
    const [tags,setTags] = useState([]);


    function handleSetTags(tags){
        setTags(tags);
    }

    useEffect(()=>{

        axios.all([
            axios.get(`http://localhost:8000/questions`)
          ]).then(axios.spread((questions) => {

            let tagElements = []

            tagElements = tagsCreated.map((value)=>{
                let questionsOfTag = dbCountQuestionsPerTag(value.name,questions.data);
                return <Tag name ={value.name} questionsOfTag = {questionsOfTag.length} handleTagStateChange={handleTagStateChange} 
                tid={value.tid} changePageView={changePageView} tagsCreated={tagsCreated}/>
            }
            );

            let invisCells = (3 - (tagsCreated.length % 3))
            while(invisCells > 0){
                tagElements.push(<FalseTag />);
                invisCells -= 1;
            }
            handleSetTags(tagElements)
            setNumOfTags(tagsCreated.length)
          }));

    },[handleTagStateChange,tagsCreated,changePageView]);

    return(
        <td>
            <TagsHeader numOfTags={numOfTags}/>
            <div className='tag_container'>
                {tags}
            </div>
        </td>
                
    );
}

function TagsHeader({numOfTags}){

    return(
    <div class='tag_header'>
      <div class='left-aligned'>
        <h2>{numOfTags} Tags</h2>
      </div>
      <div class='center-aligned'>
        <h2>All Tags</h2>
      </div>
      <div class='right-aligned'>
        <button id='tags_page_ask_question'>Ask Question</button>
      </div>
    </div>
    )
}
function Tag({name,questionsOfTag,handleTagStateChange,changePageView}){

    const [editTagMode, setEditTagMode] = useState(false)

    const [tagString, setTagString] = useState(name)

    const handleInputChange = (event) => {
        const {value } = event.target;
        setTagString(value)
    };

    async function executeDelete(tagname){
        try{
            await axios.delete('http://localhost:8000/deleteTag/'+tagname, {withCredentials: true});
            alert("Tag Succesfully Deleted")
            changePageView("userProfile",[])
        }catch(err){
            alert(err.response.data.error)  
        }
    }

    function modifyTag(tagName,tagModifyType){
        if(tagModifyType === "edit"){
            setEditTagMode(true)
        }else if(tagModifyType === "delete"){
            executeDelete(tagName)
        }
    }

    function backoffedit(){
        setEditTagMode(false)
    }

    async function executeEditTag(){
        let newstring = tagString.trim()
        newstring = newstring.toLowerCase()

        if(newstring.length === 0){
            alert("ERROR: Tag field empty")
            return
        }
        if(/\s/.test(newstring)){
            alert("ERROR: String in Space")
            return
        }

        try{
            await axios.post('http://localhost:8000/user/editTag/'+name,{newname : newstring},{withCredentials:true})
        }catch(err){
            alert(err.response.data.error)
            return
        }

        changePageView("userProfile",[])
    }
    if(editTagMode){
        return(
            <div class='tag'>
                <input type='text' id='new_title' maxLength='100' value={tagString} onChange={handleInputChange} required />
                <br/>
                <button onClick={executeEditTag}>Edit Tag</button><button onClick={backoffedit}>Cancel</button>
            </div>
        );
    }else{
        return(
            <div class='tag'>
                <p class='taglink' id= {name} onClick={() => handleTagStateChange(name)}><u>{name}</u></p>
                <p>{questionsOfTag} {questionsOfTag !== 1 ? "questions" : "question"}</p>
                <div className='tagOptions'>
                    <p className='questionTitle' onClick={() => modifyTag(name,"edit")}>Edit Tags</p><p className='questionTitle' onClick={() => modifyTag(name, "delete")}>Delete Tags</p>
                </div>
          </div>
        );
    }
}

function FalseTag(){
    return(
        <div class='paddingtag' >
        </div>
    );
}