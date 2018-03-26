<template>
<div class="wrapper">
  <v-jumbotron color="grey lighten-2 custom-jumbo">
    <v-container fill-height class="custom-container">
    <v-tabs color="primary" dark>
      <v-tab>
        Gradle Installation
      </v-tab>
    </v-tabs>
      <v-layout v-if="step === 'install'">
        <v-flex>
          <div class="pre-text">Installing Gradle please wait....</div>
          <div class="installer-progress">
            <v-progress-linear :indeterminate="true" class="progress-bar"></v-progress-linear>
            <v-btn icon ripple>
              <v-icon indeterminate color="info" @click="cancelInstall" style="z-index:9999">close</v-icon>
            </v-btn>
          </div>
        </v-flex>
      </v-layout>    
        <v-layout v-if="step === 'begin'">
        <v-flex>
          <v-btn
              color="primary"
              large
              :loading="loading"
              @click.native="startInstall"
              :disabled="loading"
            >
             <v-icon indeterminate color="info" dark>play_for_work</v-icon>
              Install Gradle
            </v-btn>

        </v-flex>
      </v-layout>    
    </v-container>
  </v-jumbotron>
    <div class="footer">
        <v-flex xs7 offset-xs0 offset-md8 offset-lg class="footer-buttons">
        <router-link to="/prerequisites">
            <v-btn large color="primary" class="mx-0" v-if="enable">Next</v-btn>
            <v-btn large color="primary" class="mx-0" v-else >Next</v-btn>
        </router-link>
        <v-btn large color="primary" class="mx-0" @click="exitCB">Exit</v-btn>
        </v-flex>        
    </div>  
</div>
</template>
<script>
import { mapActions } from 'vuex';
export default {
  name: 'install-gradle-page',
  destroy() {
    this.cancelGradleInstall();
  },
  data() {
    return {
      enable: false,
      loading: false,
      step: 'begin',
    };
  },
  methods: {
    ...mapActions([
      'installGradle',
      'extractGradle',
      'cancelGradleInstall',
    ]),
    startInstall() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.step = 'install';
        this.installGradle().then(() => {
          console.log('Dowloaded Gradle Successfully');
          return this.extractGradle();
        }, (error) => {
          console.log('Dowloaded Gradle Successfully:: ERROR');
          console.log(error);
          this.step = 'begin';
        })
          .then(() => {
            console.log('Extracted Gradle Successfully');
            this.step = 'begin';
          }, () => {
            console.log('Extracted Gradle Successfully:: ERROR');
            this.step = 'begin';
          });
      }, 3000);
      this.loader = null;
    },
    cancelInstall() {
      this.cancelGradleInstall();
      this.step = 'begin';
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
<style lang="scss" scoped>
    .jumbotron {
      background: #fff;
      display: block;
      .custom-container {
        display: block;
      }
      .pre-text {
        margin-top: 10px;
        padding: 5px;
      }
      .installer-progress {
        position: relative;
        margin: 10px 0;
        padding: 6px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .progress-bar {
          width: 95%;
        }

      }
    }
</style>