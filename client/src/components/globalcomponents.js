
import React from 'react'
import '../stylesheets/App.css';
import LogoutIcon from './logouticon';

//These are global components, a part of every page, these include the sidebar and the bar on the top
export class FakeStackOverflowTopbar extends React.Component{
  render(){
    return (
    <table style={{ width: '100%' }} className="header" id="page_header">
      <tbody style={{width: '100%' }}>
        <tr style={{ width: '100%' }}className ="header">
          {/*#<div id="main-title" className="header">*/}
            <LogoutIcon id="logouticon" style={{ display: 'block', width: '20%' }} toggleWelcomePage = {this.props.toggleWelcomePage}/>
            <BannerTitle toggleQuestionPage ={this.props.toggleQuestionPage}/>
            <BannerSearchBar handleSearchString = {this.props.handleSearchString} />
          {/*</div/>*/}
        </tr>
      </tbody>
    </table>);
  }
}

class BannerTitle extends React.Component{

  handleclick(){
    //Return to main page;
    this.props.toggleQuestionPage()
  }
  
  render(){
    return (
    <td className="header">
      <h1 id="FakeStackOverflow" className="header_title" onClick={this.handleclick.bind(this)}>Fake Stack Overflow</h1>
    </td>);
  }
}

class BannerSearchBar extends React.Component{

  checkKeyPress(event){
    if(event.key === 'Enter'){
      let text = document.getElementById("search").value.toLowerCase().split(' ');
      this.props.handleSearchString(text);
    }
  }

  render(){
    return (
    <td id="page_header_topnav" className="header">
      {/*<div className="topnav">*/}
        <input type="text" placeholder="Search ..." className="topnav" id="search" onKeyDown={this.checkKeyPress.bind(this)}/>
      {/*</div>*/}
    </td>);
  }
}

export class FakeStackOverflowSidebar extends React.Component{

  handleQuestionClick(){
    //Return to main page;
    this.props.toggleQuestionPage()
  }

  handleTagsClick(){
    this.props.handleTagsPageToggle()
  }
  handleUserProfile(){
    this.props.changePageView("userProfile")
  }
  
  render(){
      return(
        <td id="side_content" className="side_content">
          <div className="side_content"> 
            <ul className="side_content">
              <li className="side_content"> <h2 id="side_questions" onClick={this.handleQuestionClick.bind(this)}>Questions</h2></li>
              <li className="side_content"> <h2 id="side_tags" onClick={this.handleTagsClick.bind(this)}>Tags</h2></li>
              {this.props.registeredState && <li className="side_content"> <h2 id="side_tags" onClick={this.handleUserProfile.bind(this)}>User Profile</h2></li>}
            </ul>
          </div>
        </td>
      )
  }
}
