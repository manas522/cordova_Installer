<template>
  <div class="popup">
    <v-dialog 
      v-model="show" 
      max-width="290"
      transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="headline">{{data.heading}}</v-card-title>
        <v-card-text>{{data.text}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="returnCB()">Disagree</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="exitCB()">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>
<script>
  export default {
    mounted() {
      this.show = this.dialog;
    },
    name: 'pop-up',
    props: ['dialog', 'data'],
    data() {
      return {
        show: false,
      };
    },
    methods: {
      exitCB() {
        this.$emit('close');
      },
      returnCB() {
        this.$emit('return');
      },
    },
    watch: {
      show(newVal) {
        if (newVal === false) this.$emit('return');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    height: 100%;
    width: 100%;
    background: red;
    .footer-buttons {
      margin-top: 75px;
    }
  }
  
</style>