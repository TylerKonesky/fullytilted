import React, { Component } from 'react';
import './App.css';
import {HashRouter, Route, Switch} from 'react-router-dom';
import Auth from "./components/Auth/auth";
import Register from './components/Register/register';
import Home from "./components/Home/home";
import Search from "./components/Search/search";
import {StripeProvider} from 'react-stripe-elements';


class App extends Component {
  render() {
    return (
      <div className="App">
        
        <HashRouter>
          <Switch>
            <Route exact path="/" component={Auth}/>
            <Route path="/register" component={Register}/>
            <Route path="/home" component={Home}/>
            <Route path='/search' component={Search}/>
          </Switch>
        </HashRouter>
        
      </div>
    );
  }
}

export default App;