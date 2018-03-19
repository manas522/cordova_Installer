<template>
  <div id="app">
    <v-app>
      <div class="header">
         <v-toolbar color="primary">
           <v-btn icon>
            <v-icon color="white">arrow_back</v-icon>
          </v-btn>
          <v-btn icon>
            <img src="/static/images/cordova_icon.png" height="48px"/>
          </v-btn>
          <v-toolbar-title style='color:white'>Cordova Installer</v-toolbar-title>
        </v-toolbar>
      </div>    
     <v-content class="custom-content">
      <v-container class="custom-container"> 
        <router-view></router-view>
      </v-container>
     </v-content>
     </v-app>
  </div>
</template>

<script>
  export default {
    name: 'electron-installer',
  };
</script>

<style lang="scss" scoped>
 #app {
   position: relative;
   height: 100%;
   width: 100%;
   min-width: 960px;
   min-height: 540px;
   overflow: hidden;
   .custom-content {
     position: relative;
     width: 100%;
     width: 100%;
     display: flex;
     align-items: center;
     justify-content: center;
   }
    .header {
      position: absolute;
      width: 100%;
      color: white!important;
      background: #26A69A;
    }   
   .custom-container {
     position: relative;
   }
 }
  /* CSS */
</style>
