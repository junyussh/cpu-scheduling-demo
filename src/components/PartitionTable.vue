<template>
  <a-card title="分區表" :bordered="false">
    <a-table :columns="columns" :dataSource="childPartition">
      <a slot="PID" slot-scope="text" href="javascript:;">{{text}}</a>
      <span slot="customTitle">
        PID
      </span>
      <span slot="empty" slot-scope="empty">
        {{empty ? "空": "佔用"}}
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
    title: "起始位址",
    dataIndex: "location",
    key: "location"
  },
  {
    title: "長度",
    dataIndex: "length",
    key: "length"
  },
  {
    title: "狀態",
    dataIndex: "empty",
    key: "empty",
    scopedSlots: { customRender: "empty" }
  },
];
export default {
    props: {
        childPartition: Array
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