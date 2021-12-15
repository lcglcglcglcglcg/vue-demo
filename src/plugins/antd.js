import Vue from 'vue'

import {
  Descriptions,
  Mentions,
  Row,
  Col,
  Input,
  Form,
  Icon,
  Button,
  Layout,
  Menu,
  message,
  Modal,
  Pagination,
  InputNumber,
  notification,
  Table,
  DatePicker,
  Radio,
  Tag,
  Checkbox,
  Timeline,
  Switch,
  Select,
  Divider,
  Spin,
  Card,
  Result,
  Statistic,
  ConfigProvider,
  LocaleProvider,
  Dropdown,
  Drawer,
  Avatar,
  Badge,
  List,
  Tabs,
  Rate,
  Alert,
  Popover,
  Calendar,
  Steps,
  TimePicker,
  Empty,
  Breadcrumb,
  AutoComplete,
  Upload,
  TreeSelect,
  Tooltip,
  Collapse,
  FormModel,
  Skeleton,
  Popconfirm
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

Vue.use(FormModel)
Vue.use(Mentions)
Vue.use(Tooltip)
Vue.use(Breadcrumb)
Vue.use(Divider)
Vue.use(Switch)
Vue.use(Steps)
Vue.use(Timeline)
Vue.use(Checkbox)
Vue.use(Skeleton)
Vue.use(Select)
Vue.use(TreeSelect)
Vue.use(Upload)
Vue.use(ConfigProvider)
Vue.use(LocaleProvider)
Vue.use(Row)
Vue.use(Tag)
Vue.use(Popover)
Vue.use(Result)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Form)
Vue.use(Col)
Vue.use(Icon)
Vue.use(Button)
Vue.use(Layout)
Vue.use(Menu)
Vue.use(Modal)
Vue.use(Table)
Vue.use(Radio)
Vue.use(DatePicker)
Vue.use(Spin)
Vue.use(Card)
Vue.use(Pagination)
Vue.use(Statistic)
Vue.use(Dropdown)
Vue.use(Drawer)
Vue.use(Avatar)
Vue.use(Badge)
Vue.use(List)
Vue.use(Tabs)
Vue.use(Rate)
Vue.use(Alert)
Vue.use(Calendar)
Vue.use(TimePicker)
Vue.use(Empty)
Vue.use(AutoComplete)
Vue.use(Descriptions)
Vue.use(Collapse)
Vue.use(Popconfirm)

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$info = Modal.info
Vue.prototype.$success = Modal.success
Vue.prototype.$error = Modal.error
Vue.prototype.$warning = Modal.warning
Vue.prototype.$confirm = Modal.confirm
