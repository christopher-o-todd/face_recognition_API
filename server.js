const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const knex = require('knex')

//connect server to db using knex npm package
const db = knex({
    client: 'pg', //postgres
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres', //default username for windows
      password : 'MyPassword2021', //confirm this is right
      database : 'smart_brain'
    }
});

db.select('*').from('users').then(data => {
    //console.log(data);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    bcrypt.compare("apples", '$2a$10$BTaG1j27VZSPiOBB04W0w.DTsEsKfL578HMQ8e5J0mUu.MGZNtJUG', function(err, res) {
        //console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$BTaG1j27VZSPiOBB04W0w.DTsEsKfL578HMQ8e5J0mUu.MGZNtJUG', function(err, res) {
        //console.log('second guess', res)
    });
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        } else {
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    db('users')
    .returning('*') //knex returns all users
        .insert({
            email: email,
            name: name,
            joined: new Date()
    })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('unable to register'))
})

app.get('/profile/:id', (req, res) => { //loop through to display the logged in user
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({
        id: id
    })
    .then(user => {
        console.log(user);
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++ //increment number of entries
            return res.json(user.entries); //if the user is found return it
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

//Password encryption using bcrypt node package




app.listen(3000, () => {
    console.log('app is running on port 3000');
})

