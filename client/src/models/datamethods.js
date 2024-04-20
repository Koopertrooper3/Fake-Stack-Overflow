

export function dbCountQuestionsPerTag(tagName,questions) {
    
    let questionsWithTag = [];
    
    questions.forEach(tagCounter);

    function tagCounter(value) {
      if (value.tags.some(elem => elem.name === tagName)) {
        questionsWithTag.push(value);
      }
    }

    return questionsWithTag;
  }

export function dbGetAndSearchQuestions(searchString, questions, tags){
    const allQuestions = questions
    const allTags = tags
    const results = new Set()
    const tagsToBeSearched = new Set()
    const stringToBeSearched = new Set()

    searchString.forEach(function(token){
      if(token.includes('[') && token.includes(']')){
        let tag = Object.entries(allTags).find(function(input){
          return input[1].name === token.substring(token.indexOf('[')+1,token.indexOf(']'))
        })
  
        if(tag === undefined){
          tagsToBeSearched.add("tfalse");
        }else{
          tagsToBeSearched.add(tag[1].name);
        }
      }else{
        stringToBeSearched.add(token)
      }
    })

    if(tagsToBeSearched.size > 0){
      tagsToBeSearched.forEach(function(tagname){
        let questionsWithTag = allQuestions.filter(function(question){
          return Object.entries(question.tags).some((input) => input[1].name === tagname)
        })
        
        questionsWithTag.forEach((input) => results.add(input))
      })
    }else{
      allQuestions.forEach((question) => results.add(question))
    }

    stringToBeSearched.forEach(function(searchToken){
      results.forEach(function(possibleResult){
        if(!possibleResult.title.toLowerCase().includes(searchToken) && !possibleResult.text.toLowerCase().includes(searchToken)){
          results.delete(possibleResult)
        }
      })
    })

    return results
}

export function dbGetAndFilterQuestions(sortingMethod,questions){
  if(sortingMethod === "newest"){
    return questions.sort((a,b) => b.askDate - a.askDate);
    
  }else if(sortingMethod === "active"){
    
    return questions.sort(function(a,b){
      if ( a.answers[a.answers.length-1] === undefined){
        return 1;
      }else if( b.answers[b.answers.length - 1] === undefined){
        return -1;
      }else{
        return Date.parse(b.answers[b.answers.length-1].ans_date_time)-Date.parse(a.answers[a.answers.length-1].ans_date_time)
      }
    });

  }else if(sortingMethod === "unanswered"){
    return questions.filter((value) => value.answers.length === 0);
  }else{
    return questions;
  }
}

export function dbCountTagsPerQuestion(question,tags) {

  let tagsWithQuestion = [];
  tags.forEach(tagCount);

  function tagCount(value) {

    if (question.tags.some(elem => elem.name === value.name)) {
      tagsWithQuestion.push(value.name);
    }
  }
  return tagsWithQuestion;
}

export function dbFormatDate(date){
    let currentDate = new Date();
    let questionDate = new Date(date)

    const timeDiff = currentDate-questionDate;
    if (timeDiff < 86400000) {
      const seconds = Math.floor(timeDiff / 1000);
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        }
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes} minutes ago`;
        }
        const hours = Math.floor(minutes / 60);
        return `${hours} hours ago`;
    }

    // If a year has passed
    const oneYearMilliseconds = 31536000000;
    if (timeDiff >= oneYearMilliseconds) {
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return `${questionDate.toLocaleDateString('en-US', options)}`;
    }

    // If it's been 24 hours or more but less than a year
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return `${questionDate.toLocaleDateString('en-US', options)}`;
}
