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

async function createUser(username,password,email){
  try {
    let testuserpassword = password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testuserpassword, saltRounds);
    const testUser = new UserModel({
        username: username,
        email: email,
        passwordHash: hashedPassword,
        role: 'user',
        reputation: 50
    });
    console.log('Test user created successfully.');
    return await testUser.save();
} catch(error) {
    console.error('Error creating test user:', error);
}
}

let tags = [];
let answers = [];
function tagCreate(name) {
  let tag = new Tag({ name: name });
  return tag.save();
}

function answerCreate(text, ans_by, ans_date_time) {
  answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;

  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
  qstndetail = {
    title: title,
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

const populate = async () => {
    await createAdminUser()
    let user1 = await createUser("kooper","veryeasypassword","christian.yu@stonybrook.edu")
    let user2 = await createUser("looper","somewhatharderpassword","reimu.hakurei@stonybrook.edu")
    let user3 = await createUser("gooper","somewhatharderpassword","marisa.kirisame@stonybrook.edu")

    let t1 = await tagCreate('react');
    let t2 = await tagCreate('javascript');
    let t3 = await tagCreate('android-studio');
    let t4 = await tagCreate('shared-preferences');
    let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', 'hamkalo', false);
    let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', 'azad', false);
    let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', 'abaya', false);
    let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', 'alia', false);
    let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', 'sana', false);
    await questionCreate('Programmatically navigate using React router', 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', [t1, t2], [a1, a2], user1, false, false);
    await questionCreate('android studio save string shared preference, start activity and load the saved string', 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', [t3, t4, t2], [a3, a4, a5], user2, false, 121);
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
