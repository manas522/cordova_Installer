import shelljs from 'shelljs';
// import childProcess from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
const state = {
  loading: false,
  TIMEOUT: 1500,
  androidURL: 'https://dl.google.com/android/repository/sdk-tools-windows-3859397.zip',
  preInstallConfig: {
    items: ['java', 'android', 'gradle'],
    java: {
      icon: '/static/images/java.png',
      iconClass: 'grey lighten-1 white--text',
      installer: '/install/java',
      title: 'Java',
      found: null,
      subtitle: 'Java JDK/JRE',
    },
    android: {
      icon: '/static/images/android.png',
      iconClass: 'grey lighten-1 white--text',
      title: 'Android SDK',
      installer: '/install/android',
      found: null,
      subtitle: 'Jan 17, 2014',
    },
    gradle: {
      icon: '/static/images/gradle.png',
      iconClass: 'grey lighten-1 white--text',
      title: 'Gradle',
      installer: '/install/gradle',
      found: null,
      subtitle: 'Jan 28, 2014',
    },
  },
};

const mutations = {
  INSTALL(state, payload) {
    const index = state.preInstallConfig.items.indexOf(payload);
    if (index !== -1) {
      state.preInstallConfig[payload].found = false;
    }
  },
  IS_INSTALL(state, payload) {
    const index = state.preInstallConfig.items.indexOf(payload);
    if (index !== -1) {
      state.preInstallConfig[payload].found = true;
    }
  },
};
function forgivingWhichSync(cmd) {
  try {
    return fs.realpathSync(shelljs.which(cmd));
  } catch (e) {
    return '';
  }
}
function isWindows() {
  return (os.platform() === 'win32');
}
const actions = {
  checkgradle() {
    console.log('check _gradle');
    let androidStudioPath = '';
    let i = 0;
    let foundStudio = false;
    let programDir = [];
    return new Promise((resolve, reject) => {
      if (isWindows()) {
        // const result = childProcess.spawnSync(path.join(__dirname, 'getASPath.bat'));
        if (true) {
          const androidPath = `${path.join(process.env.ProgramFiles, 'Android')}/`;
          if (fs.existsSync(androidPath)) {
            programDir = fs.readdirSync(androidPath);
            while (i < programDir.length && !foundStudio) {
              if (programDir[i].startsWith('Android Studio')) {
                console.log('Foind :::::::::::::::');
                foundStudio = true;
                androidStudioPath = path.join(process.env.ProgramFiles, 'Android', programDir[i], 'gradle');
              } else {
                i += 1;
              }
            }
          }
        } else {
          // androidStudioPath = path.join(result.stdout.toString().split('\r\n')[0], 'gradle');
        }
      }
      console.log(androidStudioPath);
      if (androidStudioPath !== null && fs.existsSync(androidStudioPath)) {
        const dirs = fs.readdirSync(androidStudioPath);
        if (dirs[0].split('-')[0] === 'gradle') {
          setTimeout(() => {
            resolve(path.join(androidStudioPath, dirs[0], 'bin', 'gradle'));
          }, state.TIMEOUT);
        } else {
          setTimeout(() => {
            reject();
          }, state.TIMEOUT);
        }
      } else {
        // OK, let's try to check for Gradle!
        const gradlePath = forgivingWhichSync('gradle');
        if (gradlePath) {
          setTimeout(() => {
            resolve(gradlePath);
          }, state.TIMEOUT);
        } else {
          setTimeout(() => {
            reject();
          }, state.TIMEOUT);
        }
      }
    });
  },
  checkjava() {
    console.log('check _JAVA');
    const javacPath = forgivingWhichSync('javac');
    const hasJavaHome = !!process.env.JAVA_HOME;
    return new Promise((resolve, reject) => {
      if (hasJavaHome) {
        // Windows java installer doesn't add javac to PATH, nor set JAVA_HOME (ugh).
        if (!javacPath) {
          process.env.PATH += path.delimiter + path.join(process.env.JAVA_HOME, 'bin');
        }
      } else if (isWindows()) {
        const oldSilent = shelljs.config.silent;
        shelljs.config.silent = true;
        let firstJdkDir =
              shelljs.ls(`${process.env.ProgramFiles}\\java\\jdk*`)[0] ||
              shelljs.ls('C:\\Program Files\\java\\jdk*')[0] ||
              shelljs.ls('C:\\Program Files (x86)\\java\\jdk*')[0];
        shelljs.config.silent = oldSilent;
        // console.log(firstJdkDir);
        if (firstJdkDir) {
          // shelljs always uses / in paths.
          firstJdkDir = firstJdkDir.replace(/\//g, path.sep);
          if (!javacPath) {
            process.env.PATH += path.delimiter + path.join(firstJdkDir, 'bin');
          }
          process.env.JAVA_HOME = firstJdkDir;
          setTimeout(() => {
            resolve(firstJdkDir);
          }, state.TIMEOUT);
        } else {
          setTimeout(() => {
            reject();
          }, state.TIMEOUT);
        }
      }
    });
  },
  checkandroid() {
    console.log('check _ANDROID');
    return new Promise((resolve, reject) => {
      let androidCmdPath = forgivingWhichSync('android');
      let adbInPath = forgivingWhichSync('adb');
      let avdmanagerInPath = forgivingWhichSync('avdmanager');
      adbInPath = (adbInPath && adbInPath.includes('node_modules\\.bin') ? null : adbInPath);
      avdmanagerInPath = (avdmanagerInPath && adbInPath.includes('node_modules\\.bin') ? null : avdmanagerInPath);
      androidCmdPath = (androidCmdPath && androidCmdPath.includes('node_modules\\.bin') ? null : androidCmdPath);
      let hasAndroidHome = !!process.env.ANDROID_HOME && fs.existsSync(process.env.ANDROID_HOME);
      function maybeSetAndroidHome(value) {
        if (!hasAndroidHome && fs.existsSync(value)) {
          hasAndroidHome = true;
          console.log('Found:::::');
          console.log(value);
          process.env.ANDROID_HOME = value;
        }
      }
      console.log(hasAndroidHome, androidCmdPath, adbInPath, avdmanagerInPath);
      if (!hasAndroidHome && !androidCmdPath && !adbInPath && !avdmanagerInPath) {
        if (isWindows()) {
          // Android Studio 1.0 installer
          maybeSetAndroidHome(path.join(process.env.LOCALAPPDATA, 'Android', 'sdk'));
          maybeSetAndroidHome(path.join(process.env.ProgramFiles, 'Android', 'sdk'));
          // Android Studio pre-1.0 installer
          maybeSetAndroidHome(path.join(process.env.LOCALAPPDATA, 'Android', 'android-studio', 'sdk'));
          maybeSetAndroidHome(path.join(process.env.ProgramFiles, 'Android', 'android-studio', 'sdk'));
          // Stand-alone installer
          maybeSetAndroidHome(path.join(process.env.LOCALAPPDATA, 'Android', 'android-sdk'));
          maybeSetAndroidHome(path.join(process.env.ProgramFiles, 'Android', 'android-sdk'));
        }
      }
      if (hasAndroidHome) {
        setTimeout(() => {
          resolve(hasAndroidHome);
        }, state.TIMEOUT);
      } else {
        setTimeout(() => {
          reject();
        }, state.TIMEOUT);
      }
    });
  },
};

// function tryCommand(cmd, errMsg, catchStderr) {
//   const d = new Promise();
//   child_process.exec(cmd, (err, stdout, stderr) => {
//     if (err) d.reject(errMsg);
//     // Sometimes it is necessary to return an stderr instead of stdout in case of success, since
//     // some commands prints theirs output to stderr instead of stdout. 'javac' is the example
//     else d.resolve((catchStderr ? stderr : stdout).trim());
//   });
//   return d.promise;
// }

export default {
  state,
  mutations,
  actions,
};
