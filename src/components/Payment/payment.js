import React, { Component } from 'react';
import axios from 'axios';


const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

class Payment extends Component {

  constructor(props) {
    super(props)
    this.state = { token: null }
    
    this.stripeHandler = window.StripeCheckout.configure({
      key: stripePublicKey,
      token: this.onToken,
      amount: 100,
      currency: 'usd',
      locale: 'auto',
      zipCode: true,
      name: 'Donate',
      description: 'Please Donate me MONEY',
      
    });
  }

  componentWillUnmount() {
    this.stripeHandler.close();
  }

  onToken = token => {
    token.card = void 0;
    this.setState({token});
    const amount = 100;
    axios.post('/donate', {token, amount})
    .then(response => { console.log('payment response', response) });
  } 

  onClickPay(e) {
    e.preventDefault();
    this.stripeHandler.open({});
  }

  render() {
    let buttonText = this.state.token ? 'Thank you!' : 'Donate $1.00';

    return (
      
       
        <button
          className={this.state.token ? "stripeButton disabled" : "stripeButton"} 
          onClick={this.state.token ? null : this.onClickPay.bind(this)}>
          {buttonText}
        </button>
      
    );
  }
}

export default Payment;