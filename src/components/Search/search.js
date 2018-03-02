import axios from 'axios';
import {connect} from 'react-redux';
import React, { Component } from 'react';
import './search.css';

export default class Search extends Component {
    constructor(){
        super();
        this.state = {
            summonerFound: false,
            summoner: '',
            name: '',
            level: 0,
            accountId: 0,
            summonerInput: '',


        }
        this.enterUser= this.enterUser.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.addFriend = this.addFriend.bind(this);
        
    }

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
        } console.log('test', this.state.accountId);
    }).catch( (err)=> {
        console.log(err)
        this.setState({
            summoner: "USER NOT FOUND",
            })
        })
    }

addFriend(){
    axios.post('/addfriend', {summoner_name: this.state.summoner, accountId: this.state.accountId}).then(response => {
        console.log("test" , response)    
        })
    }

    render() {
        return (
            
                <section className='App'>  
                    <div>
                        <div className="search_page_buttons">
                            <a href={process.env.REACT_APP_LOGIN_HOME}>
                                <button> Go Back </button>
                            </a>

                            <a href={process.env.REACT_APP_LOGOUT}> 
                                <button>LOGOUT </button> 
                            </a>
                        </div>    
                        <div className="search_box">
                            <h2 > Welcome to the SEARCH PAGE!! </h2>

                            <h3> Find your feeder Friends:<input onChange={(e)=>this.enterUser(e.target.value)}></input> </h3>
                            <button onClick={this.searchUser}>Search</button>
                            <h3> Summoner: {this.state.summoner} <div>{this.state.accountId > 0 ? <button onClick={this.addFriend}>Add Friend </button> : <div></div>}</div> </h3>
                        </div>
                    </div>
                 </section> 
            
        )
    }
}