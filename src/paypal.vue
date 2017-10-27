<script type="text/babel">
import braintree from 'braintree-web'
export default {
  name: 'paypal',
  props: ['token'],
  mounted(){
    this.createBrainTreeClient()
  },
  methods:{
    createBrainTreeClient(){
      braintree.client.create( {authorization: this.token}, (clientErr, clientInstance)=>{
        if (clientErr){
          console.log("client error")
          return;
        }
        this.createDataCollector(clientInstance)
        this.createPaypal(clientInstance)
      })
    },
    createDataCollector(clientInstance) {
      // Create device data collector
      braintree.dataCollector.create( {client: clientInstance, paypal: true}, (err, dataCollectorInstance)=>{
        if (err){
          console.log("data collector error")
          return;
        }
        // -- At this point, you should access the dataCollectorInstance.deviceData value
        // example : deviceData : "{"correlation_id":"c1bd6f958643fd53d0a0599f90a4cbac"}"
        this.deviceData = dataCollectorInstance.deviceData
      })
    },
    createPaypal(clientInstance) {
      // Create PayPal component
      braintree.paypal.create( {client: clientInstance}, (paypalErr, paypalInstance)=>{
          // TODO : We need real error handling in here
          if(paypalErr){
            console.log("paypal error")
            return
          }
          this.paypalInstance = paypalInstance
      });
    },
    tokenizePaypal() {
      this.paypalInstance.tokenize( {
        flow: 'vault', // This enables the Vault flow
        billingAgreementDescription: 'Any apps you add to this paypal account will be billed once monthly.',
        locale: 'en_US',
      },
        (err, tokenizationPayload)=> {
          if(tokenizationPayload != undefined)
            this.$emit( "complete", err, tokenizationPayload.nonce, this.deviceData )
        }
      )
    },
  }
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .paypal
    button(@click="tokenizePaypal") Do it!
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" scoped>
  .paypal {}
</style>
