import Vue from 'vue'
import App from './App.vue'
import { Button, Layout, Menu, Row, Col, Card, Form, Input, Select, InputNumber, Table } from 'ant-design-vue';

Vue.use(Button);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(InputNumber);
Vue.use(Table);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
