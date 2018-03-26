import shelljs from 'shelljs';
// import childProcess from 'child_process';
import path from 'path';
// import os from 'os';
import fs from 'fs';
import request from 'request';
// import ProgressBar from 'progress';
import extract from 'extract-zip';

const state = {
  loading: false,
  TIMEOUT: 1500,
  java: {
    downloadURL: 'https://dl.google.com/android/repository/sdk-tools-windows-3859397.zip',
    icon: '/static/images/java.png',
    shell: null,
    name: 'java-tools',
    installer: './install/java',
    title: 'Java',
    found: null,
    subtitle: 'Java JDK/JRE',
  },
  android: {
    downloadURL: 'https://dl.google.com/android/repository/sdk-tools-windows-3859397.zip',
    icon: '/static/images/android.png',
    iconClass: 'grey lighten-1 white--text',
    platformToolURL: 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip',
    title: 'Android SDK',
    localAndroidPath: `${path.join(process.env.ProgramFiles, 'Android')}/android-sdk`,
    loadSDKZip: path.join(__dirname, 'android-sdk.zip'),
    localToolZip: path.join(__dirname, 'android-tool.zip'),
    installer: './install/androidsdk',
    found: null,
    subtitle: 'Jan 17, 2014',
  },
  gradle: {
    icon: '/static/images/gradle.png',
    downloadURL: 'https://downloads.gradle.org/distributions/gradle-4.6-all.zip',
    localGradlePath: `${path.join(process.env.ProgramFiles, 'Android')}/Android Studio/gradle`,
    loadGradleZip: path.join(__dirname, 'gradle.zip'),
    iconClass: 'grey lighten-1 white--text',
    title: 'Gradle',
    installer: './install/gradle',
    found: null,
    subtitle: 'Jan 28, 2014',
  },
  cordova: {
    icon: '/static/images/gradle.png',
    downloadURL: '',
    installer: './install/cordova',
    found: null,
    shell: null,
    subtitle: 'Jan 28, 2014',
  },
};

const mutations = {
  setJAVAShell(state, payload) {
    console.log(state, payload);
    state.java.shell = payload;
    shelljs.cd('../../../');
  },
  setCordovaShell(state, payload) {
    console.log(state, payload);
    state.cordova.shell = payload;
  },
};
// function isWindows() {
//   return (os.platform() === 'win32');
// }
const actions = {
  cancelJavaInstall({ state }) {
    console.log(state.java.shell);
    if (!state.java.shell) {
      console.log('kill');
      state.shell.kill();
    }
  },
  installJavaWeb({ commit }) {
    return new Promise((resolve, reject) => {
      const abs = '/sdk.exe /s';
      console.log(abs);
      shelljs.cd('static/zip/java');
      console.log('start');
      const javashell = shelljs.exec('jdk.exe /s', { async: true }, (ee, stdout, stderr) => {
        shelljs.cd('../../../');
        shelljs.exec('setx JAVA_HOME');
        if (stderr || stdout.includes('Access is denied') || ee !== 0) {
          console.log('Denied');
          reject();
        } else {
          resolve();
        }
      });
      try {
        commit('setJAVAShell', javashell);
      } catch (e) {
        console.warn(e);
      }
    });
  },
  downloadAndroidTools({ state }) {
    return new Promise((resolve, reject) => {
      console.log(state.android.localAndroidPath);
      const req = request(state.android.platformToolURL);
      req.on('error', (error) => {
        console.log(error);
        reject(error);
      });
      req.on('response', (response) => {
        const len = parseInt(response.headers['content-length'], 10);
        console.log(len);
        response.on('end', () => {
          resolve();
        });
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
      });
      req.pipe(fs.createWriteStream(state.android.localToolZip));
      req.on('finish', () => {
        console.log('Finishe:::::d');
        resolve();
      });
    });
  },
  extractTools({ state }) {
    return new Promise((resolve, reject) => {
      console.log('Finishe:::::d');
      extract(state.android.localToolZip, { dir: state.android.localAndroidPath }, (error) => {
        if (error) {
          console.log(`Extraction failed: ${error}`);
          reject(error);
        } else {
          console.log('Extraction complete');
          console.log('downloadSDK complete');
          resolve();
        }
      });
    });
  },
  extractAndroidSDk({ state }) {
    return new Promise((resolve, reject) => {
      console.log('Finishe:::::d');
      extract(state.android.loadSDKZip, { dir: state.android.localAndroidPath }, (error) => {
        if (error) {
          console.log(`Extraction failed: ${error}`);
          reject(error);
        } else {
          console.log('Extraction complete');
          console.log('downloadSDK complete');
          shelljs.exec(`setx ANDROID_HOME "${path.resolve(state.android.localAndroidPath)}"`, { async: true }, () => {
            console.log(path.resolve(state.android.localAndroidPath));
            console.log(path.normalize(state.android.localAndroidPath));
            console.log('SETTING ENCIROMNET ');
            resolve();
          });
        }
      });
    });
  },
  installAndroid({ state }) {
    return new Promise((resolve, reject) => {
      const req = request(state.android.downloadURL);
      req.on('error', (error) => {
        console.log(error);
        reject(error);
      });
      req.on('response', (response) => {
        const len = parseInt(response.headers['content-length'], 10);
        console.log(len);
        response.on('end', () => {
          resolve();
        });
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
      });
      req.pipe(fs.createWriteStream(state.android.loadSDKZip));
      req.on('finish', () => {
        console.log('Finishe:::::d');
        resolve();
      });
    });
  },
  extractGradle({ state }) {
    return new Promise((resolve, reject) => {
      console.log('Finishe:::::d');
      extract(state.gradle.loadGradleZip, { dir: state.gradle.localGradlePath }, (error) => {
        if (error) {
          console.log(`Extraction failed: ${error}`);
          reject(error);
        } else {
          console.log('Extraction complete');
          console.log('downloadSDK complete');
          resolve();
        }
      });
    });
  },
  cancelGradleInstall() {
    console.log();
  },
  installGradle({ state }) {
    return new Promise((resolve, reject) => {
      const req = request(state.gradle.downloadURL);
      req.on('error', (error) => {
        console.log(error);
        reject(error);
      });
      req.on('response', (response) => {
        const len = parseInt(response.headers['content-length'], 10);
        console.log(len);
        response.on('end', () => {
          resolve();
        });
        console.log(response.statusCode);
        console.log(response.headers['content-type']);
      });
      req.pipe(fs.createWriteStream(state.gradle.loadGradleZip));
      req.on('finish', () => {
        console.log('Finishe:::::d');
        resolve();
      });
    });
  },
  installCordova({ commit }) {
    return new Promise((resolve, reject) => {
      const shell = shelljs.exec('npm install -g cordova', { async: true }, (ee, stdout, stderr) => {
        if (!stderr) {
          resolve();
        } else {
          reject();
        }
      });
      commit('setCordovaShell', shell);
    });
  },
  cancelCordovaInstall({ state }) {
    if (state.cordova.shell) {
      state.cordova.shell.kill();
    }
  },
  cancelAndroidInstall() {
    console.log('KILL ANDRIOD');
  },
};

export default {
  state,
  mutations,
  actions,
};
