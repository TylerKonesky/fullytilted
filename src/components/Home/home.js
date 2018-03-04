import React, { Component } from 'react';
import './home.css'
import axios from 'axios';
import {connect} from 'react-redux';
import {getUser} from '../../ducks/reducer';
import StripeCheckout from 'react-stripe-checkout';
import FlipMove from 'react-flip-move';
import PopoutWindow from 'react-popout';
import Modal from 'react-modal';
import Payment from '../Payment/payment'

class Home extends Component {
    constructor(){
        super();

        this.state = {
            
            modalIsOpen: false,
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

            summonerFound: false,
            summoner: '',
            name: '',
            level: 0,
            accountId: 0,
            summonerInput: '',
        } 

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.enterUser= this.enterUser.bind(this);
    this.searchUser = this.searchUser.bind(this);
    this.addFriend = this.addFriend.bind(this);

    }
// ** SEARCH MODAL FUNCTIONS

enterUser(value){
    this.setState({
        summonerInput : value
    })
}

searchUser(){
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${this.state.summonerInput}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
        if(!response){
            this.setState({    
            })
        }else{
            this.setState({
                summoner: response.data.name,
                level: response.data.summonerLevel,
                accountId: response.data.accountId
            })           
        }
    }).catch( (err)=> {
        console.log(err)
        this.setState({
            summoner: "USER NOT FOUND",
        })
    })
}

addFriend(){
    if(axios.get('/checkfriends').then(response=>{
        console.log(response.data)
        for(let i = 0; i<response.data.length; i++){
            if(response.data[i].leaguefriends === this.state.summonerInput){
                alert(`${this.state.summonerInput} is already your friend!`)
            }
            
        }
    }))
    axios.post('/addfriend', {summoner_name: this.state.summoner, accountId: this.state.accountId}).then(response => {
        axios.get('/getfriends').then(response=>{
            this.setState({
                friends : response.data
            }, alert("Friend Added!"))  
        })
    })
}
// ** MODAL Functions

openModal() {
        this.setState({modalIsOpen: true});
      }
    
afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.subtitle.style.color = '#f00';
      }
    
closeModal() {
        this.setState({modalIsOpen: false});
      }

      // **MAIN PAGE FUNCTIONS

componentDidMount(){
     axios.get('/getfriends').then(response=>{
         console.log("getfriends", response)
        this.setState({
            friends : response.data
        })
    }, this.matches())   
}

async matches(){
    let matches = [];
    let account = await axios.get('/getid')
    let accountId = account.data.account_id;
        axios.get(`/getmatches/` + accountId).then(response =>{
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
    await axios.get(`/friendmatches/` + id).then( async response=>{
        console.log('friendmatches', response)
        for(let i = 0; i < 20; i++){
            let gameId = response.data.matches[i].gameId;
            await axios.get(`/friendstats/`+ gameId).then(response=>{
               console.log("friendstats", response)
                for(let j = 0; j < 10; j++){
                    if(response.data.participantIdentities[j].player.accountId == accountId){
                        kills = kills + response.data.participants[j].stats.kills;
                        assists = assists + response.data.participants[j].stats.assists;
                        deaths = deaths + response.data.participants[j].stats.deaths;
                }} 
        })
    }
        axios.put('/updatefriend', {accountId: id, kills : kills, deaths : deaths, assists : assists}).then(response=>{
            console.log("check friends", response)
            this.setState({
                friends : response.data
            })
        })
    })   
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
            let matches = this.state.matches[i];
            console.log("user matches",matches)
            axios.get(`/usermatches/`+ matches).then(response =>{
                let accountId = this.state.account_id;
                console.log("user account id", this.state.account_id)
                console.log("user info", this.state)
                for(let j = 0; j < 10; j++){
                    if(response.data.participantIdentities[j].player.accountId == accountId){
                        kills += response.data.participants[j].stats.kills;
                        assists += response.data.participants[j].stats.assists;
                        deaths += response.data.participants[j].stats.deaths;  
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

    //** STRIPE TOKEN
onToken = token => {
    console.log('token', token);
    token.card = void 0;
    const {amount} = this.state
    axios.post('/donate', {token, amount}).then(charge => {(console.log('charge response', charge.data))})
}
    render() {
        let friends = this.state.friends.map((friend)=>{
            console.log("friend check", this.state.friends)
            return( 
                <FlipMove duration={500} easing="ease-out">
                    <div className ="friend_stats" key ={friend.id} style={{backgroundColor:  ((friend.kills+friend.assists)/friend.deaths) > ((this.state.kills + this.state.assists)/this.state.deaths) ? '#258039' : '#CF3721' }} >    
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
                </FlipMove>
            )
        })
const {userData} = this.props
const customStyles = {
        content : {
          top                   : 'auto',
          left                  : 'auto',
          right                 : 'auto',
          bottom                : 'auto',         
            }
          };
        return (
        <div>
            <div className="home_header">
            <div>
                <Payment/>

                <a href="javascript:location.reload(true)">
                    <button> Refresh Stats </button>
                </a>

                <button onClick={this.openModal}>Find Friends</button>

                <Modal
                    className="modal_box"
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Friend Search"
        >   
                    <h2 ref={subtitle => this.subtitle = subtitle}></h2>
                    <button onClick={this.closeModal}>close</button>
                    <div className="search_box">
                        <h3> Find your feeder Friends:<input onChange={(e)=>this.enterUser(e.target.value)}></input> </h3>
                        <button onClick={this.searchUser}>Search</button>
                        <h3> Summoner: {this.state.summoner} <div>{this.state.accountId > 0 ? <button onClick={this.addFriend}>Add Friend </button> : <div></div>}</div> </h3>
                    </div>
            
                </Modal>
                   
                    <a href={process.env.REACT_APP_LOGOUT}> 
                        <button>LOGOUT</button> 
                    </a>
                </div>
            </div>
            <div className='stats_page'>
                { this.state.kills > 0 ? 
                <div>
                    <h1> Welcome, {this.state.summoner_name} </h1>
                    <h3>Kills - {this.state.kills} </h3>
                    <h3>Assists - {this.state.assists} </h3>
                    <h3>Deaths  - {this.state.deaths} </h3>
                    <h3>KDA Ratio {((this.state.kills+this.state.assists)/this.state.deaths).toFixed(2)} </h3>
                    {friends}
                </div>
                :
                <img className="image" src="https://media.giphy.com/media/l2SpY4SJZy8b3BMHK/giphy.gif" width="200" height="200" />
                }   
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