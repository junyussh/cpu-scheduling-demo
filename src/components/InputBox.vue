<template>
  <a-card title="新增進程" :bordered="false">
    <a-form :form="form" @submit="handleSubmit">
      <a-form-item label="PID">
        <a-input disabled v-decorator="['PID', { initialValue: count }]" />
      </a-form-item>
      <a-form-item label="進程名稱">
        <a-input
          v-decorator="[
         'name',
          { rules: [{ required: true, message: '請輸入進程名稱' }] },
         ]"
        />
      </a-form-item>
      <a-form-item label="執行時間">
        <a-input-number
          :min="1"
          :max="10"
          v-decorator="[
         'time',
         {
           initialValue: 5,
           rules: [
              { required: true, message: '請輸入執行時間', type: 'number' },
            ]},
         ]"
          placeholder="1"
        />
      </a-form-item>
      <a-form-item label="優先權">
        <a-input-number
          :min="1"
          :max="10"
          v-decorator="['priority', { initialValue: 3,
        rules: [
              { required: true, message: '請輸入優先權', type: 'number' },
            ] }]"
        />
      </a-form-item>
      <a-form-item>
        <a-button class="add-form" type="primary" html-type="submit">加入進程</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>
<style>
.add-form {
  width: 100%;
}
</style>
<script>
export default {
  props: {
    count: Number
  },
  name: "InputBox",
  data() {
    return {
      formLayout: "vertical",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      // console.log(this.count);
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit("addBackup", values);
          // this.$emit("update:count", this.count + 1);
          // console.log("Received values of form: ", values);
        }
      });
    }
  }
};
</script>
