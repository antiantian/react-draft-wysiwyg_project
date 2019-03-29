import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query,create,getbyID,remove,update,deleteone} from 'services/bronk_author_api'
import * as column_api  from 'services/column_api' 
import { pageModel } from '../common'
import {message} from 'antd'
import  * as bronk_user_api  from 'services/bronk_user_api'
//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'bronk_author',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    userpagination:{
 
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
    }
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/author') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * aliupload ({ payload = {} }, { call, put, select }) {
      const {clientOss,aliExpiration} = yield select(_ => _.bronk_author)
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
    *userlist({ payload = {} }, { call, put }) {
      const data = yield call(bronk_user_api.query, payload)
      if (data.code===200) {
        yield put({
          type: 'updateState',
          payload: {
            userlist:data.data.page.results, 
            userserchlist:payload,
            userpagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 5,
              total:data.data.page.totalRecord,
 
              showTotal: (total, range) => `共 ${total}条`,
            },
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
            list: data.data.results, 
            serchlist:payload,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.totalRecord,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },
   * delete ({ payload }, { call, put, select }) {
      const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_author)
      const data = yield call(remove,{id:payload})
 
      if (data.code===200) {
 
        yield put(routerRedux.push({
          pathname: '/bronk/author',
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
 const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_author)
      //const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/author',
          state:{
            serchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } 
    },

    * update ({ payload }, { select, call, put }) {
       const {contorlLimit,serchlist}  =   yield select(_ => _.bronk_author)
      const id = yield select(({ bronk_author }) => bronk_author.currentItem.id)
 
      const newUser = { ...payload, id}
      const data = yield call(update, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/author',
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
    *showModal ({ payload }, { select, call, put }) {
         yield put({
          type: 'updateState',
          payload: {
            ...payload,
            modalVisible: true,
            userserchlist:{},
            selectedRowKeys:null,
          }
        })

          yield put({
          type: 'userlist',
          payload: {
            pageNo: 1, pageSize: 5
          }
        })
    }
  },

  reducers: {

 
    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
