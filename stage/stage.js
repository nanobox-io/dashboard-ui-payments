require('nanobox-core-styles/scss/_base.scss')

import Shim from './shim'
import {paypal, creditCard, miniNav} from '../src/main.js'
import Vue from 'vue'

Vue.config.productionTip = false;

window.shim = new Shim()

let callbacks = {
  paypalComplete(err, nonce, deviceData){
    console.log( 'paypal complete' )
    console.log( 'err :' );        console.log( err )
    console.log( 'nonce :' );      console.log( nonce )
    console.log( 'deviceData :' ); console.log( deviceData )
  },
  ccInvalidField(){
    console.log('Braintree says that something the user has entered is invalid')
  },
  ccReadyForSubmit() {
    console.log( 'CC fields are formatted correctly and ready for submission' )
  },
  ccSubmitComplete() {
    console.log( 'credit card add complete' )
  },
  ccError(err) {
    console.log( `Error creating credit card : ${err}` )
  },
}

new Vue({
  template : `<div>
                <mini-nav @change="selectedItem = arguments[0]"/>
                <paypal :token="token" @complete="callbacks.paypalComplete" v-if="selectedItem == 'paypal'" />
                <credit-card v-once :token="token" @complete="callbacks.ccSubmitComplete" @error="callbacks.ccError" @ready="callbacks.ccReadyForSubmit" @invalid="callbacks.ccInvalidField" ref="card" v-if="selectedItem == 'card'" />
                <button @click="submitCard">Submit</button>
              </div>
             `,
  el       : '#app',
  data     : {
    selectedItem : 'card',
    token        : shim.data.clientToken,
    callbacks    : callbacks
  },
  components:{ paypal, creditCard, miniNav },
  methods:{
    submitCard(){
      this.$refs.card.submit()
    }
  },
})
