// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // for adding session Ids to our database to store user information and etc.
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
const port = 8000; // change this later
//const  QuestionModel = require('./models/questions');
const AnswerModel = require('./models/answers');
const TagsModel = require('./models/tags');
const UserModel = require('./models/users');
const questionsModel = require('./models/questions');
const commentsModel = require('./models/comments');

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

//app.use(cors());


let mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));


// session:
app.use(
    session({
      secret: "supersecret difficult to guess string",
      cookie: {},
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/fake_so' })
    })
  );


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const saltRounds = 10;

const isAdmin = (req, res, next) => {
    if (req.session.user === 'admin') {
        next();
    }
    else {
        res.status(403).json({ error: 'Access Forbidden' });
    }
};

app.get('/admin/dashboard', isAdmin, (req, res) => {
    //Add admin dashboard
});

app.delete('/admin/users/:userId', isAdmin, async (req, res) => {
    const userId = req.params.userId;

    try {
        await UserModel.findByIdAndDelete(userId);
        res.json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/user/submitquestions', async (req, res) => {

    try {
        if(!req.session.user){
            throw new Error("User not logged in")
        }
        const { title, summary ,text, tags } = req.body;

        let authorUser = await UserModel.findOne({email : req.session.user}).exec()
        questionDetails = {
            title: title,
            summary : summary,
            text: text,
            tags: [],
            asked_by: authorUser.id
        }

        let tagsCreated = []
        for (const elem of tags){
            let tag = await TagsModel.find({name: elem}).exec()
            if(tag.length === 0){
                //console.log("Tag does not exist");

                //NEED TO BLOCK TAG CREATION FOR USERS WITH LESS THAN 50 REP
                if(authorUser.reputation >= 50){
                    let newTag = await tagCreate(elem)
                    tagsCreated.push(newTag)
                    questionDetails.tags.push(newTag)
                }else{
                    throw new Error("Cannot create Tag");
                }
            }else{
                //console.log("Tag exists!")
                tag = tag[0]
                tag.refcount += 1
                tag.save()
                questionDetails.tags.push(tag)
            }
        }

        const newQuestion = await new questionsModel(questionDetails);
        const savedQuestion = await newQuestion.save();
        let test = await UserModel.findOneAndUpdate({email : req.session.user}, {$push: { questionsAsked: savedQuestion, tagsCreated : {$each : tagsCreated}} }).exec();
        res.json({success:true});
    } catch(error) {
        console.error(error);
        res.json({success: false , error: error.message})
    }
});

app.post('/questionIncrementView', async (req, res) => {
    try {
        thisQuestion = req.body
        let dbquestion = await questionsModel.findOneAndUpdate({_id: thisQuestion._id}, {$inc: { views: 1 }})
        res.json(dbquestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/submitAnswer', async (req, res) => {
    try {
        if(!req.session.user){
            throw new Error("User not logged in")
        }
        const { questionid, answer_text} = req.body;
        let ansUser = await UserModel.findOne({email: req.session.user})
        let newAnswer = await answerCreate(answer_text, ansUser)
        await questionsModel.findOneAndUpdate({_id: questionid}, {$push: { answers: newAnswer }}).exec();
        let updatedQuestion = await questionsModel.findOne({_id: questionid}).populate({path : 'answers',populate : {path : 'ans_by'}}).populate('tags').populate('asked_by');
        res.json({success: true , updatedQuestion: updatedQuestion})
    } catch(error) {
        console.error(error);
        res.json({success: false , error: error.message})
    }
});

app.get('/questions', async (req, res) => {
    try {
        //Deep popullate the answers as well as their authors
        const questions = await questionsModel.find().populate({path : 'answers',populate : {path : 'ans_by'}}).populate('tags').populate('asked_by');
        res.json(questions);
        console.log("Request 1")
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/tags', async (req, res) => {
    try {
        const tags = await TagsModel.find()
        res.json(tags);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/answers', async (req, res) => {
    try {
        const answers = await AnswerModel.find();
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//Creation functions
function tagCreate(name) {
    let tag = new TagsModel({
        name: name,
        refcount: 1
    });
    return tag.save();
}

function answerCreate(text, ans_by) {
    answerdetail = {text:text};
    if (ans_by != false) answerdetail.ans_by = ans_by;

    let answer = new AnswerModel(answerdetail);
    return answer.save();
}

// LOGIN:

/* app.get('/login', async (req, res) => {
    res.send(`<html><body>
      <h1>Login</h1>
        <form action="/login" method="POST">
          <input type="text" name="name" placeholder="Your name"><br>
          <input type="password" name="pw" placeholder="Enter a password"><br>
          <button>Login</button>
        </form>
      </body></html>`);
}); */

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await UserModel.find({email: email}).exec())[0];
    if (user) {
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("USER:", user);
        const verdict = await bcrypt.compare(password, user.passwordHash);
        console.log("VERDICT:", verdict);
        if (verdict) {
            req.session.user = email.trim(); //This line builds sessions
            res.json({ success: true, message: 'login successful' });
        }
        else {
            return res.json({ success: false, errorMessage: "Wrong password"});
        }
    }
    else {
        return res.json({ success: false, errorMessage: "Unknown email address"});
    }
});

// FOR REGISTERING NEW USER:
app.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds); // random value generated just for that user
        const uid = req.body.username;
        const pwHash = await bcrypt.hash(req.body.password, salt); //digest we are storing
        const newUser = new UserModel({username: uid, email: req.body.email, passwordHash: pwHash}); // storing hashed password
        const savedUser = await newUser.save();
        console.log('Registered email:', req.body.email);
        console.log('Registered password:', req.body.password);
        console.log(pwHash);
        res.json(savedUser);
    }catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already in use by registered user' });
        }
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// LOGOUT:

app.post('/logout', (req, res) => {

    //console.log(req.session.user)
    if(req.session.user){
        req.session.destroy(err => {
            if (err) {
                console.error(err);
                res.status(500).json({ success: false, errorMessage: 'Logout failed' });
            }else {
                res.json({ success: true, message: 'Logout successful' });
                console.log("logout");
            }
        });
    }else{
        res.end()
    }



});

app.get('/users', async (req, res) => {
    try {
        const tags = await UserModel.find()
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// QUESTION VOTES:

app.post('/incrementVotes', async (req, res) => {
    try {
        const { question } = req.body;
        //NEED TO BLOCK USERS WITH LESS THAN 50 REP
        let user = await UserModel.findOne({email: req.session.user}).exec()
        if(user.reputation < 50){
            throw new Error()
        }
        const question1 = await questionsModel.findByIdAndUpdate(question._id, { $inc: { votes: 1 } }, { new: true });
        await UserModel.findByIdAndUpdate(question.asked_by._id, {$inc : {reputation : 5}})
        res.json(question1.votes);
    } catch (error) {
        console.error('Error updating (incrementing) votes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.post('/decrementVotes', async (req, res) => {
try {
    const { question } = req.body;
    //NEED TO BLOCK USERS WITH LESS THAN 50 REP
    let user = await UserModel.findOne({email: req.session.user}).exec()
    if(user.reputation < 50){
        throw new Error()
    }
    const question1 = await questionsModel.findByIdAndUpdate(question._id, { $inc: { votes: -1 } }, { new: true });
    await UserModel.findByIdAndUpdate(question.asked_by._id, {$inc : {reputation : -5}})
    res.json(question1.votes);
} catch (error) {
    console.error('Error updating (decrementing) votes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// ANSWER VOTES:

app.post('/incrementAnswerVotes', async (req, res) => {
try {
    const { answerId} = req.body;
    //NEED TO BLOCK USERS WITH LESS THAN 50 REP
    let user = await UserModel.findOne({email: req.session.user}).exec()
    if(user.reputation < 50){
        throw new Error()
    }
    console.log(answerId)
    const answer1 = await AnswerModel.findByIdAndUpdate(answerId, { $inc: { votes: 1 } }, { new: true });
    await UserModel.findByIdAndUpdate(answer1.ans_by._id, {$inc : {reputation : 5}})

    res.json(answer1.votes);
} catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

app.post('/decrementAnswerVotes', async (req, res) => {
try {
    const { answerId } = req.body;
    //NEED TO BLOCK USERS WITH LESS THAN 50 REP
    let user = await UserModel.findOne({email: req.session.user}).exec()
    if(user.reputation < 50){
        throw new Error()
    }
    const answer1 = await AnswerModel.findByIdAndUpdate(answerId, { $inc: { votes: -1 } }, { new: true });
    await UserModel.findByIdAndUpdate(answer1.ans_by._id, {$inc : {reputation : -5}})
    res.json(answer1.votes);

} catch (error) {
    console.error('Error updating views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

//Cookie probe, check if current cookie is a valid session

app.get('/user/probecookie', async(req, res) => {
    console.log(req.session.user)
    try {
        if(req.session.user){
            res.json({cookie:true})
        }else{
            res.json({cookie:false})
        }
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/user/userinfo', async(req, res) => {
    console.log(req.session.user)
    try {
        let user = await UserModel.findOne({email: req.session.user}).populate("questionsAsked").populate("tagsCreated").exec()
        res.json({user})
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/singlequestion/:questionid', async(req, res) => {
    try {
        let question = await questionsModel.findOne({_id: req.params.questionid}).populate("tags").exec()
        res.json({question})
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.delete('/singlequestion/:questionid', async(req,res) =>{
    try {

        if(!req.session.user){
            throw new Error("User not logged in")
        }
        let question = await questionsModel.findOne({_id: req.params.questionid}).populate("answers").exec()

        for await (const answerElem of question.answers){
            for await (const commentElem of answerElem.comments){
                await commentsModel.deleteOne({_id: commentElem})
            }

            let test = await answerElem.deleteOne({_id: answerElem._id})
        }
        let res = await questionsModel.deleteOne({_id: question._id})
        if(res){
            console.log("Question Deleted")
        }
        res.send()
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.post('/user/editQuestion/:questionid', async (req, res) => {

    try {
        if(!req.session.user){
            throw new Error("User not logged in")
        }
        const { title, summary ,text, tags } = req.body;

        let authorUser = await UserModel.findOne({email : req.session.user}).exec()
        questionDetails = {
            title: title,
            summary : summary,
            text: text,
            tags: [],
            asked_by: authorUser.id
        }

        let tagsCreated = []
        for (const elem of tags){
            let tag = await TagsModel.find({name: elem}).exec()
            if(tag.length === 0){

                if(authorUser.reputation >= 50){
                    let newTag = await tagCreate(elem)
                    tagsCreated.push(newTag)
                    questionDetails.tags.push(newTag)
                }else{
                    throw new Error("Cannot create Tag");
                }
            }else{
                //console.log("Tag exists!")
                tag = tag[0]
                questionDetails.tags.push(tag)
            }
        }

        const newQuestion = await new questionsModel(questionDetails);
        let replacetest = await questionsModel.findOneAndReplace({_id: req.params.questionid}, questionDetails)
        let test = await UserModel.findOneAndUpdate({email : req.session.user}, {$push: {tagsCreated : {$each : tagsCreated}} }).exec();
        res.json({success:true});
    } catch(error) {
        console.error(error);
        res.json({success: false , error: error.message})
    }
});

app.delete('/deleteTag/:tagname', async(req,res) =>{
    try {

        if(!req.session.user){
            throw new Error("User not logged in")
        }
        let tag = await TagsModel.findOne({name: req.params.tagname}).exec()
        let user = await UserModel.findOne({email: req.session.user, tagsCreated : {$in : [tag._id]}}).exec()

        if(user === null){
            throw new Error("Current user is not the author")
        }
        if(tag.refcount > 0){
            throw new Error("Tag still has questions")
        }

        let res = await TagsModel.deleteOne({_id: tag._id})
        if(res){
            console.log("Tags Deleted")
        }
        res.json({success:true})
    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});
