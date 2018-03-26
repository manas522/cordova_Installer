<template>
<div class="wrapper">
  <v-jumbotron color="grey lighten-2">
    <v-container fill-height class="custom-container">
       <v-list two-line subheader class="pre-list">
          <v-subheader><div class="title mb-3">Checking Pre-requisites Installation</div></v-subheader>
          <v-list-tile avatar v-for="(item, index) in config.items" :key="config[item].title" @click="">
            <v-list-tile-avatar>
              <img :src="config[item].icon"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ config[item].title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ config[item].subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon ripple>
                <loader v-if="config[item].found === null && chkIdx !== index"></loader>
                <v-progress-circular v-else-if="config[item].found === null && chkIdx === index" indeterminate :width="3" color="info"></v-progress-circular>
                <v-icon v-else-if="config[item].found === true" indeterminate color="info darken-2">done</v-icon>
                <div v-else style="z-index:9999">
                  <router-link :to="config[item].installer">
                  <v-icon indeterminate color="info">file_download</v-icon>
                  </router-link>
                </div>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
    </v-container>
  </v-jumbotron>  
  <div class="footer">
    <v-flex xs7 offset-xs0 offset-md8 offset-lg class="footer-buttons">
      <router-link to="/install/cordova">
        <v-btn large color="primary" class="mx-0" v-if="allThere === 3">Next</v-btn>
        <v-btn large color="primary" class="mx-0" v-else disabled>Next</v-btn>
      </router-link>
      <v-btn large color="primary" class="mx-0" @click="exitCB">Exit</v-btn>
    </v-flex>        
  </div>  
  <popup  :dialog="dialog" :data="popupData" v-if="dialog" @close="closeWindow" @return="returnWindow"></popup>
</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import popup from './../common/popup';
import loader from './../common/loader';
export default {
  name: 'prerequisites-page',
  components: { popup, loader },
  mounted() {
    this.$nextTick(() => {
      this.startLoading();
    });
  },
  computed: {
    ...mapState({
      config: state => state.config.preInstallConfig,
    }),
  },
  data() {
    return {
      chkIdx: -1,
      allThere: 0,
      dialog: false,
      popupData: {
        heading: 'Exit',
        text: 'Do you want to Exit the Cordova installation?',
      },
    };
  },
  methods: {
    ...mapMutations({
      install: 'INSTALL',
      isInstalled: 'IS_INSTALL',
    }),
    ...mapActions([
      'checkjava',
      'checkandroid',
      'checkgradle',
    ]),
    startLoading() {
      this.chkIdx = 0;
      this.checkjava().then(() => {
        this.isInstalled('java');
        this.allThere += 1;
        this.chkIdx = 1;
        return this.checkandroid();
      }, () => {
        this.install('java');
        return this.checkandroid();
      }).then(() => {
        this.chkIdx = 2;
        this.isInstalled('android');
        this.allThere += 1;
        return this.checkgradle();
      }, () => {
        this.install('android');
        return this.checkgradle();
      })
        .then(() => {
          this.allThere += 1;
          this.isInstalled('gradle');
        }, () => {
          this.install('gradle');
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
