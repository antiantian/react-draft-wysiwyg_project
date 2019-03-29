import { request, config } from 'utils'

const { api } = config
const { userCode,userSignIn } = api

export async function login (params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}



export async function SAASsignIn (params) { 
  return request({
    url: userSignIn,
    method: 'post',
    data: params,
  })
}
 
 export async function SAAScode(params) { 
  return request({
    url: userCode,
    method: 'post',
    data: params,
  })
}
