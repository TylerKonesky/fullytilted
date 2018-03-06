import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Auth from "./components/Auth/auth";
import Register from './components/Register/register';
import Home from "./components/Home/home";
import Search from "./components/Search/search";
import Riot from "./components/Riot/riot"



class App extends Component {
  render() {
    return (
      <div className="App">
        
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Auth}/>
            <Route path="/register" component={Register}/>
            <Route path="/home" component={Home}/>
            <Route path='/search' component={Search}/>
            <Route path='/riot.txt' component={Riot}/>
            
          </Switch>
        </BrowserRouter>
        
      </div>
    );
  }
}

export default App;