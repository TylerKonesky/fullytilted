require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const massive = require('massive');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


const  {
    SERVER_PORT,
    SESSION_SECRET, 
    DOMAIN, 
    CLIENT_ID, 
    CLIENT_SECRET, 
    CALLBACK_URL,
    CONNECTION_STRING

} = process.env;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: false, 
    saveUninitialized: true
}))

app.use(passport.initialize() );
app.use(passport.session() );

massive(CONNECTION_STRING).then(db => {
    app.set('db', db);
})

passport.use(new Auth0Strategy({
    domain: DOMAIN, 
    clientID: CLIENT_ID,  
    clientSecret: CLIENT_SECRET, 
    callbackURL: CALLBACK_URL, 
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done){
    const db = app.get('db');
    const { sub } = profile._json;
    db.find_user([sub]).then( response => {
        if(response[0]){
            done(null, response[0].id)
        }else{
            db.create_user([ sub ]).then( response => {
                done(null, response[0].id)
            })
        }
    })

}))

passport.serializeUser( (id, done)=> {
    done(null, id);
})

passport.deserializeUser( (id, done) =>{
    const db = app.get('db');
    db.find_logged_in_user([id]).then( response => {
        done(null, response[0])
    })
})

app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3005/checkuser'
}))

app.get('/checkuser', (req, res) => {
    if (req.user.summoner_name){
            res.redirect('http://localhost:3000/#/home')
        }else{
            res.redirect('http://localhost:3000/#/register')
        }
   })

app.get('/getId', (req, res) =>{
    res.status(200).send({account_id : req.user.account_id, summoner_name: req.user.summoner_name})
})

app.get('/auth/me', (req, res) => {
    if(!req.user){
        res.status(404).send('Not logged in!');
    }else{
        res.status(200).send(req.user);
    }
})

app.get('/logout', (req,res) => {
    req.logout(); 
    res.redirect('http://localhost:3000')
})

app.put('/register', (req, res)=> {
    const db = app.get('db');
    const {firstName, lastName, summonerName, email, preferredRole, summonerId, accountId, auth_id} = req.body;
    db.update_user([firstName, lastName, summonerName, email, preferredRole, summonerId, accountId, auth_id ])
    .then(response => {
        res.status(200).send(console.log('update successful'))
    })
})

app.post('/addfriend', (req, res)=>{
    console.log(req.body, req.user)
    const db = app.get('db');
    db.add_friend([req.body.summoner_name, req.body.accountId, req.user.id]).then(response => {
        res.status(200).send(console.log('friend added!'))
    
    }).catch((err)=>{
        console.log(err)
    })
})

app.put('/updatefriend', (req, res)=>{
    const db = app.get('db');
    db.update_friend([req.body.accountId, req.body.kills, req.body.assists, req.body.deaths, req.user.id]).then(response =>{
        res.status(200).send(response)
    })
})

app.delete('/remove/:id', (req, res)=>{
    const db = app.get('db');
    console.log('remove friend', req.params.id)
    db.remove_friend([req.params.id]).then(response =>{
        res.status(200).send(console.log('friend removed'))
    })
})

app.get('/getfriends', (req, res)=>{
    const db = app.get('db');
    db.load_friends([req.user.id]).then(response=>{
        res.status(200).send(response)
    })
})

app.post('/donate', (req, res)=>{
    const amount = req.body.amount; 
    const charge = stripe.charges.create({
        amount: amount,
        currency: 'usd', 
        source: req.body.token.id,
        description: "Donation Amount"
    },
    function(err, charge){
        if(err) return res.sendStatus(500);
        else return res.sendStatus(200);
    }
)
})

app.listen(SERVER_PORT, ()=> console.log(`The server is under attack at port ${SERVER_PORT}`))


