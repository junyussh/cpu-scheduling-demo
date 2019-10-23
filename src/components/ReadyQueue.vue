<template>
  <a-card title="Ready" :bordered="false">
    <a-table :columns="columns" :dataSource="childReady">
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
  },
];
export default {
    props: {
        childReady: Array
    },
    data: function() {
        return {
            columns,
        }
    },
    methods: {
        test: function(PID){
            console.log(PID)
        }
    }
};
</script>