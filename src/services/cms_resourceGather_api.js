/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-11-02 16:37:47
 * @version $Id$
 */

import { request, config } from 'utils'

const { api } = config
const {resourceGet,resourceAdd,resourceUpdate,resourceDel,resourceGetById,resourceupdateSync} = api

export async function query (params) {
  return request({
    url: resourceGet,
    method: 'post',
    data: params,
  })
}
   
export async function create (params) {
  return request({
    url: resourceAdd,
    method: 'post',
    data: params,
  })
}
export async function getbyID (params) {
  return request({
    url: resourceGetById,
    method: 'post',
    data: params,
  })
}
export async function remove (params) {
  return request({
    url:cms_resourceGather.replace('/:id', ''),
    method: 'post',
    data: params,
  })
}
export async function deleteone (params) {
  return request({
    url: resourceDel,
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: resourceUpdate,
    method: 'post',
    data: params,
  })
}
export async function updateSync (params) {
  return request({
    url: resourceupdateSync,
    method: 'post',
    data: params,
  })
}

