import {
  getAction,
  deleteAction,
  putAction,
  postAction,
  httpAction,
} from '@/api/common'

// 接口
export const login = (params) => postAction('/sys/login', params)
export const phoneLogin = (params) => postAction('/sys/phoneLogin', params)
export const getSmsCaptcha = (params) => postAction('/account/sms', params)
export const logout = (params) => postAction('/sys/logout', params)
