// Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

const bcrypt = require('bcrypt');
const UserModel = require('./models/users');

const Tag = require('./models/tags')
const Answer = require('./models/answers')
const Question = require('./models/questions')


let mongoose = require('mongoose');
let mongoDB = "mongodb://127.0.0.1:27017/fake_so"
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Start of old code

const createAdminUser = async () => {
    try {
        const [,, adminUsername, adminPassword] = process.argv;
        if (!adminUsername || !adminPassword) {
            console.error('Admin username and password must be provided');
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
        const adminUser = new UserModel({
            username: adminUsername,
            email: `${adminUsername.toLowerCase()}@fake_so.com`,
            passwordHash: hashedPassword,
            role: 'admin',
            reputation: 50
        });
        await adminUser.save();
        console.log('Admin user created successfully.');
    } catch(error) {
        console.error('Error creating admin user:', error);
    }
};

async function createUser(username,password,email,reputation,joinedDate){
  try {
    let testuserpassword = password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testuserpassword, saltRounds);

    let userdetails = {
      username: username,
      email: email,
      passwordHash: hashedPassword,
      role: 'user',
      reputation: reputation
    }


    if(joinedDate != false) userdetails.joinedDate = joinedDate
    const testUser = new UserModel(userdetails);
    console.log('Test user created successfully.');

    return await testUser.save();
} catch(error) {
    console.error('Error creating test user:', error);
}
}

let tags = [];
let answers = [];
function tagCreate(name,ref) {
  let tag = new Tag({ 
    name: name,
    refcount: ref
  });
  return tag.save();
}

async function answerCreate(text, ans_by, ans_date_time) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  answer = await answer.save()
  await ans_by.questionsAnswered.push(answer)
  await ans_by.save()
  return answer
}

function questionCreate(title, summary, text, tags, answers, asked_by, ask_date_time, views) {
  qstndetail = {
    title: title,
    summary: summary, 
    text: text,
    tags: tags,
    asked_by: asked_by
  }
  if (answers != false) qstndetail.answers = answers;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  if (views != false) qstndetail.views = views;

  let qstn = new Question(qstndetail);
  return qstn.save();
}

async function addQuestionToUser(user,question) {

  user.questionsAsked.push(question)
  let newuser = await user.save()
  return newuser
}

async function addTagsToUser(user,tags){
  user.tagsCreated = tags
  let newuser = await user.save()
  return newuser 
}

const populate = async () => {
    await createAdminUser()
    let user1 = await createUser("kooper","veryeasypassword","christian.yu@stonybrook.edu",50,'2012-04-19')
    let user2 = await createUser("looper","somewhatharderpassword","reimu.hakurei@stonybrook.edu",50,'2010-09-14')
    let naughtyuser = await createUser("marisa.kirisame","somewhatharderpassword","marisa.kirisame@stonybrook.edu",30,'2008-11-03')

    let ansuser1 = await createUser("hong.meiling","scarletmansion1","hong meiling@stonybrook.edu",50,'20014-11-17')
    let ansuser2 = await createUser("sakuya.izayoi","scarletmansion2","sakuya.izayoi@stonybrook.edu",50,'2016-03-15')
    let ansuser3 = await createUser("patchouli.knowledge","scarletmansion3","patchouli.knowledge@stonybrook.edu",50,'2011-08-09')
    let ansuser4 = await createUser("lastansuser","decentpassword","lastansuser@gmail.com",50,'2013-07-21')

    let t1 = await tagCreate('react',1);
    let t2 = await tagCreate('javascript',2);
    let t3 = await tagCreate('android-studio',1);
    let t4 = await tagCreate('shared-preferences',1);
    let t5 = await tagCreate('java',0)
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', ansuser1, false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', ansuser1, false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', ansuser2, false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', ansuser3, false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', ansuser4, false);
    let q1 = await questionCreate('Programmatically navigate using React router', "summary1",'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], user1, false, false);
    await addQuestionToUser(user1,q1)
    let q2 = await questionCreate('android studio save string shared preference, start activity and load the saved string', "sumamry2",'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], user1, '2011-09-20', 121);
    await addQuestionToUser(user1,q2)
    await addTagsToUser(user1,[t1,t2,t3,t4,t5])

    if(db) db.close();
    console.log('done');
  }
  
populate()
.catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
});

console.log('processing ...');

//End of old code
