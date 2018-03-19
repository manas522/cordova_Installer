<template>
<div class="wrapper">
  <v-jumbotron color="grey lighten-2">
    <v-container fill-height class="custom-container">
       <v-list two-line subheader class="pre-list">
          <v-subheader><div class="title mb-3">Checking Pre-requisites Installation</div></v-subheader>
          <v-list-tile avatar v-for="(item, index) in config.preItems" :key="item.title" @click="">
            <v-list-tile-avatar>
              <img :src="item.icon"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <v-progress-circular v-if="item.found === false && index === chkIdx" indeterminate :width="3" color="green"></v-progress-circular>
                 <v-icon v-if="item.found === false" indeterminate color="green darken-2">done</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <div class="footer">
         <v-flex xs7 offset-xs0 offset-md8 offset-lg class="footer-buttons">
            <router-link to="/prerequisites"><v-btn large color="primary" class="mx-0" disabled>Next</v-btn></router-link>
            <v-btn large color="primary" class="mx-0" @click="exitCB">Exit</v-btn>
          </v-flex>        
        </div>
    </v-container>
  </v-jumbotron>  
  <popup  :dialog="dialog" :data="popupData" v-if="dialog" @close="closeWindow" @return="returnWindow"></popup>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import popup from './../common/popup';
export default {
  name: 'prerequisites-page',
  components: { popup },
  mounted() {
    this.startLoading();
  },
  computed: {
    ...mapState({
      config: state => state.config.preInstallConfig,
    }),
  },
  data() {
    return {
      chkIdx: -1,
      dialog: false,
      popupData: {
        heading: 'Exit',
        text: 'Do you want to Exit the Cordova installation?',
      },
    };
  },
  methods: {
    ...mapMutations({
      toggleLoading: 'TOGGLELOADING',
    }),
    ...mapActions([
      'checkjava',
    ]),
    startLoading() {
      console.log(this.checkjava());
      this.checkjava().then(() => {
        console.log('found Java');
      });
    },
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

<style scoped lang="scss">
  .wrapper {
    height: 100%;
    width: 100%;
    .jumbotron {
      background: #fff;
      .custom-container {
        flex-direction: column;
        justify-content: space-between;
        .pre-list {
          width: 100%;
          background: transparent;
        }
        .footer {
          background: transparent;
          width: 100%;
        }
      }
    }
  }
</style>
