import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query,create,getbyID,remove,update} from 'services/bronk_agency_api'
import * as column_api  from 'services/column_api' 
import * as bronk_enterprise_api  from 'services/bronk_enterprise_api' 
import { pageModel } from '../common'
import {message} from 'antd'

//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'bronk_organization',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    enterprise:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/database/organization') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNumber: 1, pageSize: 10 }:{ pageNumber: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'enterprise_query',
          })
        }
      })
    },
  },
  effects: {
    * aliupload ({ payload = {} }, { call, put, select }) {
      const {clientOss,aliExpiration} = yield select(_ => _.bronk_organization)
      const timeNOW =  (new Date()).getTime();  //当前时间
    if(!clientOss || aliExpiration&&timeNOW>aliExpiration  || !aliExpiration){
          const data = yield call(column_api.UploadFileAuth, payload)
        if(data.code===200){
              const creds2= data.data;
              const client =  new OSS.Wrapper({
                  region: creds2.region,
                  secure: true,//https
                  endpoint: creds2.endpoint,
                  accessKeyId: creds2.AccessKeyId,
                  /*accessKeyId,accessKeySecret两者到阿里云控制台获得*/
                  accessKeySecret:creds2.AccessKeySecret,
                  stsToken: creds2.SecurityToken,
                  bucket: creds2.bucket /*装图片的桶名*/
              });

              yield put({
                  type: 'updateState',payload:{clientOss:client,keyOss:creds2.targetDir,aliExpiration:creds2.Expiration}
              })
        }
    }

      
    },
    *enterprise_query ({ payload = {} }, { call, put }) {
      const data = yield call(bronk_enterprise_api.query, payload)
      if (data.code===200) {

        yield put({
          type: 'updateState',
          payload: {
            enterprise: data.data.content, 
          },
        })
      }
    },
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.content,
            serchlist:payload, 
            pagination: {
              current: Number(payload.pageNumber) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalElements,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },
     * getbyID({ payload = {} }, { call, put }) {
      const data = yield call(getbyID, payload)
      if (data.code===200) {
        yield put({
          type: 'updateState',
          payload: {
            currentItem: data.data, 
          },
        })
      }
    },
   * delete ({ payload }, { call, put, select }) {
     const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_organization)
      const data = yield call(remove,{id:payload})
 
      if (data.code===200) {
 
        yield put(routerRedux.push({
          pathname: '/database/organization',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },

    * create ({ payload }, { select, call, put }) {
 const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_organization)
      //const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/database/organization',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },

    * update ({ payload }, { select, call, put }) {
       const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_organization)
      const id = yield select(({ bronk_organization }) => bronk_organization.currentItem.id)
 
      const newUser = { ...payload, id}
      const data = yield call(update, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/database/organization',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } else {
        //throw data
        message.error(data.info)
      }
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}})
         yield put({ type: 'query' , payload :{ ...serchlist}})  
        // yield put(routerRedux.push({
        //   pathname: '/bronk/cms/resourceType',
        //   state:{...stateOrigin,serchlist},
        // }))
    },
    * showItem ({ payload }, { select, call, put }) {
         yield put({ type: 'aliupload'})
         console.log(payload)
         yield put({ 
           type: 'updateState' , 
           payload :{
               ...payload,
               modalVisible: true 
           }
         })
 
         if(payload.currentItem){
           yield put({ 
              type: 'getbyID' ,
              payload :{ 
                id:payload.currentItem.id
              }
          })  
         }
    }
  },

  reducers: {

    showModal (state, { payload }) {

      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
