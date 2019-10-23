<template>
  <a-card title="End" :bordered="false">
    <a-table :columns="columns" :dataSource="childEnd">
      <a slot="PID" slot-scope="text" href="javascript:;">{{text}}</a>
      <span slot="customTitle">
        PID
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
  }
];
export default {
    props: {
        childEnd: Array
    },
    data: function() {
        return {
            columns,
        }
    },
    methods: {
        hangOnAction: function(PID){
            this.$emit("goToReady", PID);
        }
    }
};
</script>