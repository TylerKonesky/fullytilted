import React, { Component } from 'react';
import './auth.css';

export default class Auth extends Component {
    render() {
        
        return (
                <section className='App'>  
               
                    <div className='home_box'>

                        <a className='login_button' href={ process.env.REACT_APP_LOGIN }>LOGIN</a>

                    </div>
                 </section>
        )
    }
}