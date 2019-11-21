<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <a-layout id="components-layout-demo-top" class="layout">
      <a-layout-header>
        <span
          class="title"
        >CPU Scheduling Limit: {{limitProcess}}, Process: {{totalProcess}}, TotalLength: {{totalLength}}</span>
      </a-layout-header>
      <a-layout-content style="padding: 20px 50px">
        <div :style="{ overflow: 'auto', height: '100%', left: 0, padding: '24px'}">
          <a-row :gutter="16">
            <a-col :span="6">
              <InputBox :count.sync="parentCount" @addBackup="addBackup" />
            </a-col>
            <a-col :span="6">
              <BackupQueue v-bind:childBackup="backup" @enter="backupToReady" />
            </a-col>
            <a-col :span="6">
              <EndQueue v-bind:childEnd="end" />
            </a-col>
            <a-col :span="6">
              <PartitionTable v-bind:childPartition="partition" />
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
import PartitionTable from "./components/PartitionTable.vue";
export default {
  name: "app",
  data: function() {
    return {
      parentCount: 1,
      totalProcess: 0,
      limitProcess: 6,
      limitLength: 256,
      totalLength: 0,
      startLocation: 64,
      partition: [
        {
          key: -1,
          PID: -1,
          name: "OS",
          location: 0,
          length: 64,
          empty: false
        }
      ],
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
    partitionIsNotFulled: function() {
      return this.totalLength < this.limitLength;
    },
    sortReady: function() {
      this.ready.sort((a, b) => (a.priority > b.priority ? -1 : 1));
    },
    addPartition: function(values) {
      values["location"] = this.startLocation; // add location
      this.partition.push(values);
      this.startLocation += values.length;
    },
    addBackup: function(values) {
      values["key"] = values.PID; // primary key in Table
      this.backup.push(values);
      this.parentCount++;
    },
    backupToReady: function(PID) {
      if (this.isNotFulled() && this.partitionIsNotFulled()) {
        const element = this.backup.filter(item => item.key == PID)[0];
        this.ready.push(element); // save the current row to ready
        this.backup = this.backup.filter(item => item.key !== PID); // remove from backup queue
        this.totalProcess++;
      }
    },
    waitingToReady: function(PID) {
      this.ready.push(this.waiting.filter(item => item.key == PID)[0]);
      this.waiting = this.waiting.filter(item => item.key !== PID);
    },
    runningToWaiting: function(PID) {
      console.log("PID: " + PID);
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
        const element = this.running.shift();
        this.end.push(element);
        this.updatePartitionStatus(element);
        this.combineEmpty();
        this.totalProcess--;
      }
    },
    updatePartitionStatus: function(process) {
      const index = this.partition.findIndex(e => e.key == process.key);
      console.log(process);
      this.partition[index].empty = true;
    },
    insertProccess: function(process) {
      for (let index = 0; index < this.partition.length; index++) {
        const element = this.partition[index];
        // if length is enough and empty
        if (element.length >= process.length && element.empty) {
          let copy = Object.assign({}, process); // must use assign to copy object
          this.$set(copy, "location", element.location);
          this.$set(copy, "empty", false);
          if (element.length > process.length) {
            const push = {
              key: element.key,
              PID: element.PID,
              name: "自由",
              location: element.location + process.length,
              length: element.length - process.length,
              empty: true
            };
            this.partition.splice(index, 1, copy, push);
          } else {
            this.partition.splice(index, 1, copy);
          }
          break;
        }
      }
    },
    combineEmpty: function() {
      this.partition.pop();
      let length = 0,
        count = 0;
      for (let index = 0; index < this.partition.length; index++) {
        const element = this.partition[index];
        if (element.empty) {
          length += element.length;
          count++;
        } else {
          if (count > 0) {
            const first = this.partition[index - count];
            const push = {
              key: first.key,
              PID: first.PID,
              name: "自由空間",
              location: first.location,
              length: length,
              empty: true
            };
            this.partition.splice(index - count, count, push);
          }

          count = 0;
          length = 0;
        }
        console.log(this.partition);
      }
      this.partition.splice(this.partition.length - count, count);
      this.updatePartition();
    },
    updatePartition: function() {
      let _this = this;
      _this.totalLength = 0;
      this.partition = this.partition.filter(item => item.PID != 0);
      this.partition.forEach((e, index) => {
        _this.totalLength += e.length;
      });
      // for (let index = 0, lengthCount = 0, elementCount = 0; index < this.partition.length; index++) {
      //   const element = this.partition[index];

      //   if (this.partition.length - 1 != index) {
      //     console.log(element.length)
      //     _this.totalLength += element.length;
      //   }
      // if (element.empty && this.partition[index+1].empty) {
      //   lengthCount+=element.length;
      //   elementCount++;
      // } else {
      //   const first = this.partition[index-elementCount+1];
      //   const end = this.partition[index];
      //   const push = {
      //       key: first.key,
      //       PID: end.PID,
      //       name: "自由空間",
      //       location: first.location,
      //       length: lengthCount,
      //       empty: true
      //   };
      //   this.partition.splice(index-elementCount+1, elementCount, push);
      //   lengthCount = 0;
      //   elementCount = 0;
      // }
      // }
      this.partition.push({
        key: 0,
        PID: 0,
        name: "未分配",
        location: _this.totalLength,
        length: _this.limitLength - _this.totalLength,
        empty: true
      });
    }
  },
  updated: function() {
  },
  beforeMount: function() {
    // let _this = this;
    // _this.totalLength = 0;
    // this.partition.forEach((e, index) => {
    //   if (_this.key != 0) {
    //     _this.totalLength += e.length;
    //   }
    // });
    // if (this.totalLength < this.limitLength) {
    //   this.partition.push({
    //     key: 0,
    //     PID: 0,
    //     name: "未分配",
    //     location: _this.totalLength,
    //     length: _this.limitLength - _this.totalLength,
    //     empty: true
    //   });
    // }
    this.updatePartition();
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
      if (
        _this.backup.length > 0 &&
        _this.isNotFulled() &&
        _this.partitionIsNotFulled()
      ) {
        const element = _this.backup.shift();
        _this.ready.push(element); // push first element to ready
        _this.insertProccess(element);
        _this.updatePartition();
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
    EndQueue,
    PartitionTable
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
