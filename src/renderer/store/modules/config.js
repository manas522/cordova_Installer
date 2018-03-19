import shelljs from 'shelljs';
// import childProcess from 'child_process';
import path from 'path';
import os from 'os';
import fs from 'fs';
const state = {
  loading: false,
  preInstallConfig: {
    preItems: [
      {
        icon: '/static/images/java.png',
        iconClass: 'grey lighten-1 white--text',
        title: 'Java',
        found: null,
        subtitle: 'Java JDK/JRE',
      },
      {
        icon: '/static/images/android.png',
        iconClass: 'grey lighten-1 white--text',
        title: 'Android SDK',
        found: null,
        subtitle: 'Jan 17, 2014',
      },
      {
        icon: '/static/images/gradle.png',
        iconClass: 'grey lighten-1 white--text',
        title: 'Gradle',
        found: null,
        subtitle: 'Jan 28, 2014',
      },
    ],
  },
};

const mutations = {
  TOGGLELOADING(state, payload) {
    state.loading = payload;
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
};
const actions = {
  checkjava() {
    const javacPath = forgivingWhichSync('javac');
    const hasJavaHome = !!process.env.JAVA_HOME;
    return new Promise((resolve) => {
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
        console.log(firstJdkDir);
        if (firstJdkDir) {
          // shelljs always uses / in paths.
          firstJdkDir = firstJdkDir.replace(/\//g, path.sep);
          if (!javacPath) {
            process.env.PATH += path.delimiter + path.join(firstJdkDir, 'bin');
          }
          process.env.JAVA_HOME = firstJdkDir;
        }
      }
      resolve();
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
