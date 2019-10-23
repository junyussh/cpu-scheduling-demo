<template>
  <a-card title="Running" :bordered="false">
    <a-table :columns="columns" :dataSource="childRunning">
      <a slot="PID" slot-scope="text" href="javascript:;">{{text}}</a>
      <span slot="customTitle">
        PID
      </span>
      <span slot="action" slot-scope="text">
        <a @click="hangOnAction(text.PID)" href="javascript:;">掛起</a>
      </span>
    </a-table>
  </a-card>
</template>
<script>
const columns = [
  {
    dataIndex: "PID",
    key: "PID",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "PID" }
  },
  {
    title: "名稱",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "時間",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "優先權",
    key: "priority",
    dataIndex: "priority",
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: 'action' },
  }
];
export default {
    props: {
        childRunning: Array
    },
    data: function() {
        return {
            columns,
        }
    },
    methods: {
        hangOnAction: function(PID){
            this.$emit("hangOn", PID);
        }
    }
};
</script>