import Vue from "vue";
import axios from "axios";
import store from "@/store";
import { Modal, notification, message as msg } from "ant-design-vue";

/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/jeecg-boot'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */
let apiBaseUrl = window._CONFIG["domianURL"];
// 创建 axios 实例
const service = axios.create({
  baseURL: apiBaseUrl, // api base_url
  timeout: 50000, // 请求超时时间
});

const err = (error) => {
  if (error.response) {
    let data = error.response.data;
    // const token = Vue.ls.get("Access-Token");
    const token = Vue.ls.get("Access-Token");
    // console.log("------异常响应------",token)
    // console.log("------异常响应------",error.response.status)
    switch (error.response.status) {
      case 403:
        notification.error({
          message: "系统提示",
          description: "拒绝访问",
          duration: 4,
        });
        break;
      case 500:
        // notification.error({ message: '系统提示', description:'Token失效，请重新登录!',duration: 4})
        if (token && data.message == "Token失效，请重新登录") {
          // update-begin- --- author:scott ------ date:20190225 ---- for:Token失效采用弹框模式，不直接跳转----
          msg.error($it("login.expired.sorry"));
          store.dispatch("Logout").then(() => {
            Vue.ls.remove("Access-Token");
            window.location.reload();
          });
        }
        break;
      case 404:
        notification.error({
          message: "系统提示",
          description: "很抱歉，资源未找到!",
          duration: 4,
        });
        break;
      case 504:
        notification.error({ message: "系统提示", description: "网络超时" });
        break;
      case 401:
        notification.error({
          message: "系统提示",
          description: "未授权，请重新登录",
          duration: 4,
        });
        if (token) {
          store.dispatch("Logout").then(() => {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          });
        }
        break;
      default:
        notification.error({
          message: "系统提示",
          description: data.message,
          duration: 4,
        });
        break;
    }
  }
  return Promise.reject(error);
};

// request interceptor
service.interceptors.request.use(
  (config) => {
    // const token = Vue.ls.get("Access-Token");
    // if (token) {
    //   // config.headers["X-Access-Token"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    //   config.headers["X-Access-Token"] = "123";
    // }
    config.headers["X-Access-Token"] = "123";
    if (config.method == "get") {
      if (config.url.indexOf("sys/dict/getDictItems") < 0) {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params,
        };
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use((response) => {
  return response.data;
}, err);

export { service as axios };
