<script type="text/babel">

import braintree from 'braintree-web'
import paypal from './paypal'
export default {
  name  : 'payments',
  props : ['model', 'callbacks'],
  components : {paypal},
  data() {
    console.log( this.model )
    return {};},
  methods    : {},
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .payments
    paypal(:model="model")
</template>

<!--
  **** C S S ****
-->

<style lang="scss" scoped>
  .payments{}
</style>
