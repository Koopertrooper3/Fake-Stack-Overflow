import React, {useState, useEffect} from 'react'
import '../stylesheets/App.css';
import {FakeStackOverflowSidebar } from './globalcomponents.js';
import axios from 'axios';

export function UserProfile({handleQuestionPageToggle,handleTagsPageToggle}) {
    return (
        <div id ="main_body" className="main_body">
            <table className="main_body">
                <tbody>
                    <tr className='main_body'>
                        <FakeStackOverflowSidebar toggleQuestionPage = {handleQuestionPageToggle} handleTagsPageToggle = {handleTagsPageToggle}/>
                        <td>
                            <div className='userDetails'></div>
                            <div className='userQuestions'></div>
                            <div className='userTags'></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}