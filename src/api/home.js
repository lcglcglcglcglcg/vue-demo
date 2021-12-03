import {
  getAction,
  deleteAction,
  putAction,
  postAction,
  httpAction,
} from '@/api/common'
import Qs from 'qs'

// 接口
export const addRole = (params) => postAction('/sys/role/add', params)
export const editRole = (params) => putAction('/sys/role/edit', params)
export const checkRoleCode = (params) =>
  getAction('/sys/role/checkRoleCode', params)

// 获取所有信息
export const cover = (level = 0, id = null) =>
  getAction('cors/cover/list', {
    level,
    id,
  })
// 获取 所有基站
export const GetStations = () => postAction('public/openAPI/cover/station_list')
export const location = (l, b) =>
  postAction('cors/cover/location', Qs.stringify({ l, b }))
