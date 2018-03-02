import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import './register.css'
import {getUser, getFirst, getLast, getEmail, getSummonerName, getPreferredRole, getId} from '../../ducks/reducer';
//const {userData, getFirst, getLast, getEmail, getSummonerName, getPreferredRole, getId} = this.props

class Register extends Component {
    constructor(){
        super();

        this.state = {
            firstName: '',
            lastName: '', 
            email: '', 
            preferredRole: '',
            summonerName: '',
            auth_id: ''
        }
        this.register = this.register.bind(this);
    }

    componentDidMount(){
        this.props.getUser();
                 
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.user){
            this.setState({
                auth_id: nextProps.user.auth_id
            })
        }
    }

    register(){
        console.log("register",this.state);
        getId(this.state);
        
        setTimeout(this.props.history.push('/home'), 1500)
        
    }
    
    newGetFirst(value){
        this.setState({
            firstName: value
        })
        getFirst(value)
    }

    newGetEmail(value){
        this.setState({
            email: value
        })
        getEmail(value)
    }

    newGetLast(value){
        this.setState({
            lastName: value
        })
        getLast(value)
    }

    newGetPreferredRole(value){
        this.setState({
            preferredRole: value
        })
        getPreferredRole(value)
    }

    newGetSummonerName(value){
        this.setState({
            summonerName: value
        })
        getSummonerName(value)
    }

    render() {
        console.log("checkers", this.props)
        console.log("new check", this.state)
        return (
            <div className='register_page'>
                
                {/* <h3> {userData.auth_id ? userData.auth_id : null} </h3> */}
             

                <h3>First Name:   <input onChange={(e)=>this.newGetFirst(e.target.value)}></input> </h3>
                <h3>Last Name:   <input onChange={(e)=>this.newGetLast(e.target.value)}></input> </h3>
                <h3>Email:   <input onChange={(e)=>this.newGetEmail(e.target.value)}></input> </h3>
                <h3>Preferred Role:    
                    <select onChange={(e)=>this.newGetPreferredRole(e.target.value)}>
                        <option value="ADC">ADC</option>
                        <option value="Support">Support</option>
                        <option value="Mid">Mid</option>
                        <option value="Top">Top</option>
                        <option value="Jungle">Jungle</option>
                    </select> 
                </h3>
                <h3>Summoner Name:   <input onChange={(e)=>this.newGetSummonerName(e.target.value)}></input> </h3>        
                {/* <a href={process.env.REACT_APP_LOGIN_HOME}>  */}
                  
                   <button onClick={this.register}>Register</button> 
                {/* </a> */}
            </div> 
      )
    }
}

function mapStateToProps(state){
    const {user, firstName, lastName, email, summonerName, preferredRole} = state;
    return {
       user, 
       firstName, 
       lastName, 
       email, 
       summonerName, 
       preferredRole
    }
}

export default connect (mapStateToProps, {getUser, getFirst, getEmail, getPreferredRole, getSummonerName, getLast})(Register)