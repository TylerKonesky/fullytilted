import React, { Component } from 'react';
import './home.css'
import axios from 'axios';
import {connect} from 'react-redux';
import {getUser} from '../../ducks/reducer';



class Home extends Component {
    constructor(){
        super();

        this.state = {
            
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
    console.log(account)
    let accountId = account.data.account_id;
        axios.get(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
        console.log('MATCHES', response)    
            for(let i = 0; i < 20; i++){
                matches.push(response.data.matches[i].gameId)
            }
                this.setState({
                    account_id : accountId,
                    matches: matches
            }, 
                () => this.userStats())
    })
}

async friendsStats(id){
    
    let kills = 0;
    let assists = 0;
    let deaths = 0;
    await axios.get(`https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${id}?api_key=${process.env.REACT_APP_API_KEY}`).then(response=>{
        for(let i = 0; i < 20; i++){
            console.log("friendly",response.data.matches[15].gameId, kills, assists)
            axios.get(`https://na1.api.riotgames.com/lol/match/v3/matches/${response.data.matches[i].gameId}?api_key=${process.env.REACT_APP_API_KEY}`).then(response=>{
                for(let j = 0; j < 10; j++){
                    console.log("my ID's",id)
                    if(response.data.participantIdentities[j].player.accountId == id){
                        kills += response.data.participants[j].stats.kills;
                        assists += response.data.participants[j].stats.assists;
                        deaths += response.data.participants[j].stats.deaths;
                }} 
        })
        } this.setState({
            friendsStats: Object.assign(this.state.friendsStats, {account_id: id, kills: kills, assists : assists, deaths: deaths})
        })
        
        
        
    })
}


userStats(){
    let kills = [];
    let deaths = [];
    let assists = [];
    let damageTaken = [];
    let damageDealt = [];
    
    console.log('length',this.state.matches.length)
    if(this.state.matches.length){
               
        for(let i = 0; i < 20; i++){
            axios.get(`https://na1.api.riotgames.com/lol/match/v3/matches/${this.state.matches[i]}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
                let accountId = this.state.account_id;
                for(let j = 0; j < 10; j++){
                    if(response.data.participantIdentities[j].player.accountId == accountId){
                        kills.push(response.data.participants[j].stats.kills);
                        assists.push(response.data.participants[j].stats.assists);
                        deaths.push(response.data.participants[j].stats.deaths);
                        damageDealt.push(response.data.participants[j].stats.totalDamageDealtToChampions);
                        damageTaken.push(response.data.participants[j].stats.totalDamageTaken);
                        
                    }
                }
         
                this.setState({
                    kills: kills,
                    deaths: deaths,
                    assists: assists,
                    damageDealt : damageDealt,
                    damageTaken : damageTaken
                })
        })            
    }
            
    }               
}



    render() {
        let friends = this.state.friends.map((friend)=>{
            return( <div key ={friend.id} >

                        <div> {friend.summoner_name} Kills: {this.state.friendsStats[friend.id] ? this.state.friendStats[friend.id-1].kills : 0 }Deaths: Assists: K/D: <button onClick={ () => this.friendsStats(friend.account_id)}>Update Stats</button> <button>Remove Friend</button> </div>

                    </div>

            )
        })

        const {userData} = this.props
        console.log('final', this.state);
        return (
        <div>    
            <div>
                <a href="http://localhost:3000/#/search">
                <button> Find Friends </button>
                </a>
            </div>
            <div className='stats_page'>
                { this.state.kills.length ? 
                <div>
                    <h3>Kills {this.state.kills.reduce((a,c)=> a + c)} </h3>
                    <h3>Assists {this.state.assists.reduce((a,c)=> a + c)} </h3>
                    <h3>Deaths {this.state.deaths.reduce((a,c)=> a + c)} </h3>
                    <h3>Total Damage Dealt {this.state.damageDealt.reduce((a,c)=> a + c)} </h3>
                    <h3>Total Damage Taken {this.state.damageTaken.reduce((a,c)=> a + c)} </h3>
                    <h3>Damage Per Kill {(this.state.damageDealt.reduce((a,c)=> a + c))/(this.state.kills.reduce((a,c)=> a + c))} </h3>
                    <h3>Damage Taken Per Death {(this.state.damageTaken.reduce((a,c)=> a + c))/(this.state.deaths.reduce((a,c)=> a + c))} </h3>
                    <h3>K/D Ratio {(this.state.kills.reduce((a,c)=> a + c))/(this.state.deaths.reduce((a,c)=> a + c))} </h3>
                    {friends}
                </div>
                :
                <img src="https://media.giphy.com/media/3o7aDcjrXva7DqzZni/giphy.gif" />

                }
               
                <a href='http://localhost:3005/logout'> 
                   <button>LOGOUT</button> 
                </a>
            </div> 
        </div>    
        )
    }
}

function mapStateToProps(state){
    return {
        userData: state.user
    }
}

export default connect (mapStateToProps, {getUser})(Home)