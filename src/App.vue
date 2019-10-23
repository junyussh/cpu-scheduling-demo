<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-header>
        <span class="title">CPU Scheduling  Limit: {{limitProcess}}, Process: {{totalProcess}}</span>
      </a-layout-header>
      <a-layout-content style="padding: 20px 50px">
        <div :style="{ overflow: 'auto', height: '100%', left: 0, padding: '24px'}">
          <a-row :gutter="16">
            <a-col :span="6">
              <InputBox :count.sync="parentCount" @addBackup="addBackup" />
            </a-col>
            <a-col :span="9">
              <BackupQueue v-bind:childBackup="backup" @enter="backupToReady" />
            </a-col>
            <a-col :span="9">
              <EndQueue v-bind:childEnd="end" />
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <ReadyQueue v-bind:childReady="ready" />
            </a-col>
            <a-col :span="8">
              <Running v-bind:childRunning="running" @hangOn="runningToWaiting" />
            </a-col>
            <a-col :span="8">
              <WaitingQueue v-bind:childWaiting="waiting" @hangOut="waitingToReady" />
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">Made by Chun Yu</a-layout-footer>
    </a-layout>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import InputBox from "./components/InputBox.vue";
import BackupQueue from "./components/BackupQueue.vue";
import ReadyQueue from "./components/ReadyQueue.vue";
import WaitingQueue from "./components/WaitingQueue.vue";
import Running from "./components/Running.vue";
import EndQueue from "./components/EndQueue.vue";
export default {
  name: "app",
  data: function() {
    return {
      parentCount: 0,
      totalProcess: 0,
      limitProcess: 6,
      backup: [],
      ready: [],
      waiting: [],
      running: [],
      end: []
    };
  },
  watch: {
    parentCount(newV, oldV) {
      // console.log(newV, oldV);
    }
  },
  methods: {
    isNotFulled: function() {
      return this.totalProcess < this.limitProcess;
    },
    sortReady: function() {
      this.ready.sort((a, b) => (a.priority > b.priority ? -1 : 1));
    },
    addBackup: function(values) {
      values["key"] = values.PID; // primary key in Table
      this.backup.push(values);
      this.parentCount++;
    },
    backupToReady: function(PID) {
      if (this.isNotFulled()) {
        this.ready.push(this.backup.filter(item => item.key == PID)[0]); // save the current row to ready
        this.backup = this.backup.filter(item => item.key !== PID); // remove from backup queue
        this.totalProcess++;
      }
    },
    waitingToReady: function(PID) {
      this.ready.push(this.waiting.filter(item => item.key == PID)[0]);
      this.waiting = this.waiting.filter(item => item.key !== PID);
    },
    runningToWaiting: function(PID) {
      console.log("PID: "+PID);
      this.waiting.push(this.running.pop());
    },
    changeReadyPriority: function() {
      this.ready.forEach(element => {
        element.priority++;
      });
    },
    changeRunninngStatus: function() {
      this.running[0].time--;
      this.running[0].priority--;
    },
    checkRunning: function() {
      if (this.running[0].time == 0) {
        this.end.push(this.running.shift());
        this.totalProcess--;
      }
    },
    addToReady: function(PID) {}
  },
  mounted: function() {
    let _this = this;
    setInterval(function() {
      _this.changeReadyPriority();
      if (_this.running.length > 0) {
        _this.changeRunninngStatus();
        _this.checkRunning();
      }
      // move PCB from backup to ready queue
      if (_this.backup.length > 0 && _this.isNotFulled()) {
        _this.ready.push(_this.backup.shift()); // push first element to ready
        _this.totalProcess++;
        _this.sortReady();
      }
      // ready to running
      if (_this.ready.length > 0) {
        if (_this.running.length == 0) {
          _this.running.push(_this.ready.shift());
        } else if (_this.ready[0].priority > _this.running[0].priority) {
          _this.ready.push(_this.running.shift());
          _this.running.push(_this.ready.shift());
          _this.sortReady();
        }
      }
    }, 1500);
  },
  components: {
    // HelloWorld
    InputBox,
    BackupQueue,
    ReadyQueue,
    WaitingQueue,
    Running,
    EndQueue
  }
};
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
html,
body,
#app {
  width: 100%;
  height: 100%;
}
.ant-layout {
  height: 100%;
}
.ant-row {
  margin-bottom: 1em;
}
.title {
  color: #fff;
  font-size: large;
}
</style>
