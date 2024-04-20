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
//const TagModel = require('./models/tags');
app.use(cors());

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

app.post('/questions', async (req, res) => {
    try {
        const { title, text, tags, asked_by } = req.body;

        questionDetails = {
            title: title,
            text: text,
            tags: [],
            asked_by: asked_by
        }


        for (const elem of tags){
            let tag = await TagsModel.find({name: elem}).exec()
            if(tag.length === 0){
                //console.log("Tag does not exist");
                questionDetails.tags.push( await tagCreate(elem))
            }else{
                //console.log("Tag exists!")
                questionDetails.tags.push(tag[0])
            }
        }
        
        const newQuestion = await new questionsModel(questionDetails);
        const savedQuestion = await newQuestion.save();
        const questions = await questionsModel.find().populate('answers').populate('tags');

        res.json(questions);
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        const { questionid, answer_text, answer_username } = req.body;
        let newAnswer = await answerCreate(answer_text, answer_username)
        let dbquestion = await questionsModel.findOneAndUpdate({_id: questionid}, {$push: { answers: newAnswer }})
        res.json(newAnswer)
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/questions', async (req, res) => {
    try {
        const questions = await questionsModel.find().populate('answers').populate('tags');
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
    let tag = new TagsModel({ name: name });
    return tag.save();
}

function answerCreate(text, ans_by) {
    answerdetail = {text:text};
    if (ans_by != false) answerdetail.ans_by = ans_by;
  
    let answer = new AnswerModel(answerdetail);
    return answer.save();
}

// LOGIN: 

app.get('/login', async (req, res) => {
    res.send(`<html><body>
      <h1>Login</h1>
        <form action="/login" method="POST">
          <input type="text" name="name" placeholder="Your name"><br>
          <input type="password" name="pw" placeholder="Enter a password"><br>
          <button>Login</button>
        </form>
      </body></html>`);
});

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
            req.session.user = email.trim();
            res.json({ success: true, message: 'login successful' });
        }
        else {
            return res.status(401).json({ success: false, errorMessage: "Wrong email address or password"});
        }
    }
    else {
        return res.status(401).json({ sucess: false, errorMessage: "Wrong email address or password"});
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
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// LOGOUT: 

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, errorMessage: 'Logout failed' });
        }
        else {
            res.json({ success: true, message: 'Logout successful' });
            console.log("logout");
        }
    });
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
        const question1 = await questionsModel.findByIdAndUpdate(question._id, { $inc: { votes: 1 } }, { new: true });
        res.json(question1.votes);
    } catch (error) {
        console.error('Error updating (incrementing) votes:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/decrementVotes', async (req, res) => {
    try {
        const { question } = req.body;
        const question1 = await questionsModel.findByIdAndUpdate(question._id, { $inc: { votes: -1 } }, { new: true });
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
        console.log(answerId)
        const answer1 = await AnswerModel.findByIdAndUpdate(answerId, { $inc: { votes: 1 } }, { new: true });
        res.json(answer1.votes);
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/decrementAnswerVotes', async (req, res) => {
    try {
        const { answerId } = req.body;
        const answer1 = await AnswerModel.findByIdAndUpdate(answerId, { $inc: { votes: -1 } }, { new: true });
        res.json(answer1.votes);

    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});

