<script type="text/babel">
import braintree from 'braintree-web'

export default {
  name: 'credit-card',
  props:['token'],
  data(){return{
    hostedFieldsInstance:''
  }},
  mounted(){this.createBraintreeClient()},
  methods : {
    createBraintreeClient(){

      braintree.client.create( {authorization: this.token}, (err, clientInstance)=>{
        if(err != null) {
          console.log("errored : " + err)
          return
        }
        let options = {
          client: clientInstance,
          styles: {
            input : {"font-size":"20px", color:"#375C74", "font-family":'monospace'}, height:"50px",  '::-webkit-input-placeholder' : {'color': '#8FACBE'}, ':-moz-placeholder' : {'color': '#b3b3b3'}, '::-moz-placeholder' : {'color': '#b3b3b3'}, ':-ms-input-placeholder' : {'color': '#b3b3b3'}
          },
          fields: {
            number         : {selector: '#card-number'},
            cvv            : {selector: '#cvv',},
            expirationDate : {placeholder: "mm / yy", selector: '#expiration-date'}
          }
        }

        // TODO: fix this?
        // No current Values, we're creating from scratch
        // if( !this.creatingFromScratch ){
        //   delete options.fields.number
        // }

        // Create the braintree iframe fields
        braintree.hostedFields.create( options, (hostedFieldsErr, hostedFieldsInstance)=> {
          this.hostedFieldsInstance = hostedFieldsInstance
          console.log( this.hostedFieldsInstance )
          if (hostedFieldsErr){
            console.log( 'error with hosted fields' )
            return
          }

          // As users edits fields, make sure the fields are filled with potentiall valid vals
          this.hostedFieldsInstance.on( 'validityChange', this.checkFormSubmissionReadiness)
          this.hostedFieldsInstance.on( 'notEmpty', this.checkFormSubmissionReadiness)

          this.$el.classList.remove('loading')
        })
      })
    },
    checkFormSubmissionReadiness() {
      let fields = this.hostedFieldsInstance.getState().fields
      for ( let key in fields ) {
        if( !fields[key].isPotentiallyValid || fields[key].isEmpty ){
          // If any field is invalid..
          this.$emit('invalid');
          return
        }
      }
      // All fields passed validity check, form is valid
      this.$emit('ready')
    },
    submit() {
      // Tokenize the fields
      this.hostedFieldsInstance.tokenize( {vault: true}, (tokenizeErr, payload)=>{
        if( tokenizeErr!=null){
          switch (tokenizeErr.code){
            case 'HOSTED_FIELDS_FIELDS_EMPTY':
              console.log( "should fire..." )
              this.$emit('error', 'All fields are empty! Please fill out the form.')
              break;

            case 'HOSTED_FIELDS_FIELDS_INVALID':
              this.$emit('error', 'Some fields are invalid') //, tokenizeErr.details.invalidFieldKeys)
              break;

            case 'HOSTED_FIELDS_FAILED_TOKENIZATION':
              this.$emit('error', 'Tokenization failed server side. Is the card valid?')
              break;

            case 'HOSTED_FIELDS_TOKENIZATION_NETWORK_ERROR':
              this.$emit('error', 'Network error occurred when tokenizing.')
              break;

            default:
              this.$emit('error', "Something bad happened! #{tokenizeErr}")
          }
        }else
          this.$emit('complete', payload.nonce)
      })
    }
  }
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .credit-card.loading
    .form.lexi-on-white
      .field-bg
        label
          | Card Number
          .field#card-number
      .field-bg.exp
        label
          | Exp. Date
          .field#expiration-date
      .field-bg.cvv
        label
          | CVV
          .field#cvv
</template>

<!--
  ***** C S S *****
-->
<style lang="scss" scoped>
  .credit-card      {background: white;
    &.loading       {position: relative;
      &:before      {content:"Establishing Secure Connection.."; position:absolute; top:6px; color:#09AEF7;  width:100%; text-align: center; }
      .form *       {opacity:0;}
    }
    .form           {display: flex;
      #submit       {margin-top:30px; }
      .card         {display: flex; }
      .field-bg     {display: flex; align-items: center; padding-right:10px;
        .field {background:#EDF4F7; flex-grow: 2; transition: border-bottom 300ms ease;; padding:0 0 2px 9px;  color:$azul2; height:50px;
          &.braintree-hosted-fields-focused {border-bottom-color:white; }
          &.braintree-hosted-fields-invalid {outline:solid 2px #fba5a5; background:#F9B4B4; }
        }
        &.exp       {.field{max-width:150px;} }
        &.cvv       {.field{max-width:55px;} }
        label       {white-space: nowrap; padding-right:10px; @include caps(#93ABB9, 12px);  }
      }
    }
  }
</style>
