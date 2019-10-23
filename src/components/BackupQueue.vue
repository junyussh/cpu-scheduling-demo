<template>
  <a-card title="後備隊列" :bordered="false">
    <a-table :columns="columns" :dataSource="childBackup">
      <a slot="PID" slot-scope="text" href="javascript:;">{{text}}</a>
      <span slot="customTitle">
        PID
      </span>
      <span slot="action" slot-scope="text">
        <a @click="Enter(text.PID)" href="javascript:;">進入</a>
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
        childBackup: Array
    },
    data: function() {
        return {
            columns,
        }
    },
    methods: {
        Enter: function(PID){
          console.log("go to ready");
            this.$emit("enter", PID);
        }
    }
};
</script>