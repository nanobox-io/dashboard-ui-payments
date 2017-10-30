<script type="text/babel">
import paypal     from './assets/svg/paypal.svg'
import creditCard from './assets/svg/credit-card.svg'
import {radio}    from 'lexi'
export default {
  name: 'mini-nav',
  components:{paypal, creditCard, radio},
  data() {
    return {
      state:"card"
    }
  },
  watch:{
    state(newState){
      this.$emit( 'change', newState )
    }
  }
}
</script>

<!--
  **** H T M L ****
-->

<template lang="pug">
  .mini-nav
    .item.card(v-bind:class="{ active: state == 'card' }" @click="state = 'card'")
      credit-card
      radio(v-model="state" val="card") Credit Card
    .item.paypal(v-bind:class="{ active: state == 'paypal' }" @click="state = 'paypal'")
      paypal
      radio(v-model="state" val="paypal") Paypal
</template>

<!--
  ***** C S S *****
-->

<style lang="scss" scoped>
  .mini-nav        {display: flex;
    .item          {display: flex; flex-direction: column; align-items: center; width:160px; background: white; margin-right:40px; padding:20px 0 15px; border-radius: 5px; cursor: pointer;
      border:solid 1px #EBEBEB;
      &.active     {border:none; box-shadow: 0 2px 5px rgba(black, 0.2); }
      .line        {display: flex; justify-content: center; margin-top:10px; width:80%;
        .radio-btn {margin-right:10px; }
      }
      svg          {height:50px; }
      &.paypal svg {width:25px; }
      &.card svg   {width:43px; }

    }
  }
</style>
