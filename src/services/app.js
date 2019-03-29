import { request, config } from 'utils'

const { api } = config
const { user, userLogout, userLogin,refreshToken,userReset } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'post',
    data: params,
  })
}

export async function query (params) {
  return request({
    url: user.replace('/:id', ''),
    method: 'get',
    data: params,
  })
}
export async function refreshT (params) {
  return request({
    url: refreshToken,
    method: 'post',
    data: params,
  })
}
export async function reset (params) {
  return request({
    url: userReset,
    method: 'post',
    data: params,
  })
}
