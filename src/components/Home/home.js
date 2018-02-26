import React, { Component } from 'react';
import './home.css'
import axios from 'axios';
import {connect} from 'react-redux';
import {getUser} from '../../ducks/reducer';
import StripeCheckout from 'react-stripe-checkout';


class Home extends Component {
    constructor(){
        super();

        this.state = {
            
            amount: 100,
            summoner_name: '',
            account_id: 0,
            matches: [],
            kills: [],
            deaths: [],
            assists: [],
            damageTaken: [],
            damageDealt: [],
            friends: [],
            friendsStats: [],
        } 
    }

componentDidMount(){
     axios.get('/getfriends').then(response=>{
        console.log('Test Response',response)
        this.setState({
            friends : response.data
        })
    }, this.matches())
    
}

async matches(){
    let matches = [];
    let account = await axios.get('/getId')
    console.log("check", account)
    let accountId = account.data.account_id;
        axios.get(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
        console.log('MATCHES', response)    
            for(let i = 0; i < 20; i++){
                matches.push(response.data.matches[i].gameId)
            }
                this.setState({
                    summoner_name: account.data.summoner_name,
                    account_id : accountId,
                    matches: matches
            }, 
                () => this.userStats())
    })
}

async friendsStats(id){
    console.log("friend id",id)
    let accountId = id;
    let kills = 0;
    let assists = 0;
    let deaths = 0;
    await axios.get(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then( async response=>{
        for(let i = 0; i < 20; i++){
           await axios.get(`https://na1.api.riotgames.com/lol/match/v3/matches/${response.data.matches[i].gameId}?api_key=${process.env.REACT_APP_API_KEY}`).then(response=>{
                for(let j = 0; j < 10; j++){
                    if(response.data.participantIdentities[j].player.accountId == accountId){
                        kills = kills + response.data.participants[j].stats.kills;
                        assists = assists + response.data.participants[j].stats.assists;
                        deaths = deaths + response.data.participants[j].stats.deaths;
                }} 
        })
        }
        axios.put('/updatefriend', {accountId: id, kills : kills, deaths : deaths, assists : assists}).then(response=>{
            console.log("user updated")
        })
        
        //  this.setState({
        //     friendsStats: Object.assign([], ...this.state.friendsStats, {account_id: id, kills: kills, assists : assists, deaths: deaths})
        })   
}

onToken = token => {
    console.log('token', token);
    token.card = void 0;
    const {amount} = this.state
    axios.post('/donate', {token, amount}).then(charge => {(console.log('charge response', charge.data))})
}

removeFriend(id){
    axios.delete(`/remove/` + id).then(response => {
        axios.get('/getfriends').then(response=>{
            this.setState({
                friends : response.data
            })
        })
    })
}

userStats(){
    let kills = 0;
    let deaths = 0;
    let assists = 0;
    let damageTaken = [];
    let damageDealt = [];
    
    if(this.state.matches.length){       
        for(let i = 0; i < 20; i++){
            axios.get(`https://na1.api.riotgames.com/lol/match/v3/matches/${this.state.matches[i]}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
                let accountId = this.state.account_id;
                for(let j = 0; j < 10; j++){
                    if(response.data.participantIdentities[j].player.accountId == accountId){
                        kills += response.data.participants[j].stats.kills;
                        assists += response.data.participants[j].stats.assists;
                        deaths += response.data.participants[j].stats.deaths;
                        // damageDealt.push(response.data.participants[j].stats.totalDamageDealtToChampions);
                        // damageTaken.push(response.data.participants[j].stats.totalDamageTaken);   
                    }
                }

                
                this.setState({
                    kills: kills,
                    deaths: deaths,
                    assists: assists,
                    // damageDealt : damageDealt,
                    // damageTaken : damageTaken
                })
            })            
        }
    }               
}

    render() {
        let friends = this.state.friends.map((friend)=>{

            return( <div className ="friend_stats" key ={friend.id} style={{backgroundColor:  ((friend.kills+friend.assists)/friend.deaths) > ((this.state.kills + this.state.assists)/this.state.deaths) ? '#258039' : '#CF3721' }} >    
                        <span>{friend.summoner_name}</span> 
                        <span>Kills: {friend.kills} </span> 
                        <span>Deaths: {friend.deaths} </span> 
                        <span>Assists: {friend.assists}</span>
                        <span>KDA: {(((friend.kills)+(friend.assists))/(friend.deaths)).toFixed(2)} </span> 
                        <span className="button_span">
                            <button onClick={ () => this.friendsStats(friend.account_id)}>Update </button> 
                            <button onClick={ () => this.removeFriend(friend.id)}> Remove</button> 
                        </span>
                    </div>
            )
        })
        const {userData} = this.props
        return (
        <div>
            
            <div className="home_header">

                <StripeCheckout
                    token={this.onToken}
                    stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
                    amount={this.state.amount}/>
                <a href="javascript:location.reload(true)">
                <button> Refresh Stats </button>
                </a>
               
                <a href="http://localhost:3000/#/search">
                <button> Find Friends </button>
                </a>
                
                <a href='http://localhost:3005/logout'> 
                   <button>LOGOUT</button> 
                </a>
            </div>
            <div className='stats_page'>
                { this.state.kills ? 
                <div>
                    <h1> Welcome, {this.state.summoner_name} </h1>
                    <h3>Kills - {this.state.kills} </h3>
                    <h3>Assists - {this.state.assists} </h3>
                    <h3>Deaths  - {this.state.deaths} </h3>
                    {/* <h3>Total Damage Dealt {this.state.damageDealt.reduce((a,c)=> a + c)} </h3>
                    <h3>Total Damage Taken {this.state.damageTaken.reduce((a,c)=> a + c)} </h3>
                    <h3>Damage Per Kill {(this.state.damageDealt.reduce((a,c)=> a + c))/(this.state.kills.reduce((a,c)=> a + c))} </h3>
                    <h3>Damage Taken Per Death {(this.state.damageTaken.reduce((a,c)=> a + c))/(this.state.deaths.reduce((a,c)=> a + c))} </h3> */}
                    <h3>KDA Ratio {((this.state.kills+this.state.assists)/this.state.deaths).toFixed(2)} </h3>
                    {friends}
                </div>
                :
                <img src="https://media.giphy.com/media/3o7aDcjrXva7DqzZni/giphy.gif" />

                }   
            </div> 
        </div>    
        )
    }
}

function mapStateToProps(state){
    console.log("test", state)
    return {
        
        userData: state.user
    }
}

export default connect (mapStateToProps, {getUser})(Home)