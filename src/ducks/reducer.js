import axios from 'axios';

const initialState = {
    user: {},
    firstName: '', 
    lastName: '',
    summonerName: '',
    email: '', 
    preferredRole: '',
    summoner_id: '', 
    account_id: '',
    
    

}

console.log(initialState.user);

const GET_USER = 'GET_USER';
const GET_FIRST_NAME = 'GET_FIRST_NAME';
const GET_LAST_NAME = "GET_LAST_NAME";
const GET_SUMMONER_NAME = 'GET_SUMMONER_NAME';
const GET_EMAIL = "GET_EMAIL";
const GET_PREFERRED_ROLE = 'GET_PREFERRED_ROLE';
const GET_ID = "GET_ID";
const GET_AUTH_ID = "GET_AUTH_ID";

export default function reducer(state = initialState, action){
    switch(action.type){
        case GET_USER + '_FULFILLED':
            return Object.assign({}, state, {user: action.payload})
        case GET_FIRST_NAME + '_FULFILLED':
            return Object.assign({}, state, {firstName: action.payload})
        case GET_LAST_NAME + '_FULFILLED':
            return Object.assign({}, state, {lastName: action.payload})
        case GET_SUMMONER_NAME + '_FULFILLED':
            return Object.assign({}, state, {summonerName: action.payload})
        case GET_EMAIL+ '_FULFILLED':
            return Object.assign({}, state, {email: action.payload})
        case GET_PREFERRED_ROLE + '_FULFILLED':
            return Object.assign({}, state, {preferredRole: action.payload})
        case GET_ID + '_FULFILLED':
            return Object.assign({}, state, {summoner_id: action.payload.summonerId, account_id: action.payload.accountId})
        // case GET_ACCOUNT_ID + '_FULFILLED':
        //     return Object.assign({}, state, {account_id: action.payload})
        case GET_AUTH_ID + '_FULFILLED':
            return Object.assign({}, state, {auth_id: action.payload})
        default: 
            return state; 
    }
    
}

export function getUser(){
    return {
        type: GET_USER,
        payload: axios.get('/auth/me').then(response => {
            console.log('RAWRRR', response.data)
            return response.data;
        })
    }
}

export function getFirst(firstName){
    console.log(firstName)
    return {
        type: GET_FIRST_NAME,
        payload: firstName
    }
}
export function getLast(lastName){
    return {
        type: GET_LAST_NAME,
        payload: lastName
    }
}
export function getEmail(email){
    return {
        type: GET_EMAIL,
        payload: email
    }
}
export function getSummonerName(summonerName){
    
    return {
        type: GET_SUMMONER_NAME,
        payload: summonerName
    }
}
export function getPreferredRole(preferredRole){
    return {
        type: GET_PREFERRED_ROLE,
        payload: preferredRole
    }
}
export function getId(state){
    console.log('test', state.summonerName)
   
    axios.get(`https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${state.summonerName}?api_key=${process.env.REACT_APP_API_KEY}`).then(response =>{
        console.log('response', response)
        axios.put('/register', Object.assign({}, state, {summonerId : response.data.id}, {accountId: response.data.accountId} ))
        return response.data
    })
    // return{
       
    //     type: GET_ID,
    //     payload: {summoner_id : response.data.summonerId, account_id : response.data.accountId}
    // }
    
}