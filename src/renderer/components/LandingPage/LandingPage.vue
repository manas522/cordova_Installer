<template>
  <div class="wrapper">
  <v-jumbotron color="grey lighten-2">
    <v-container fill-height>
      <v-layout align-center>
        <v-flex>
          <h3 class="display-3">Welcome to the Cordova Installer</h3>
          <span class="subheading">Installer will guide you through to fully setup cordova in your machine system</span>
          <v-divider class="my-3"></v-divider>
          <div class="title mb-3">Click Install to begin...</div>
          <v-flex xs7 offset-xs0 offset-md8 offset-lg class="footer-buttons">
            <router-link to="/prerequisites"><v-btn large color="primary" class="mx-0">Install</v-btn></router-link>
            <v-btn large color="primary" class="mx-0" @click="exitCB">Exit</v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-container>
  </v-jumbotron>
  <popup  :dialog="dialog" :data="popupData" v-if="dialog" @close="closeWindow" @return="returnWindow"></popup>
  </div>
</template>

<script>
  import popup from './../common/popup';
  export default {
    name: 'landing-page',
    components: { popup },
    data() {
      return {
        dialog: false,
        popupData: {
          heading: 'Exit',
          text: 'Do you want to Exit the Cordova installation?',
        },
      };
    },
    methods: {
      exitCB() {
        this.dialog = true;
      },
      closeWindow() {
        this.$electron.remote.getCurrentWindow().close();
      },
      returnWindow() {
        this.dialog = false;
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
