import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query,create,getbyID,remove,update, reset, modify,info} from 'services/bronk_manager_api'
import * as column_api  from 'services/column_api' 
import { pageModel } from '../common'
import {message} from 'antd'

//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'bronk_manager',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    chapter:[{name:(new Date()).getTime()}],  //小节数组  
    chapterMember:[{name:(new Date()).getTime()+1000}],  //小节数组  
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/manager') {
         
          console.log(location)
          const payload =location.state?location.state.searchlist? location.state.searchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'query',
            payload,
          })
        }else if(location.pathname === '/bronk/manager/detail'){
           var mess=location.state;
           dispatch({
              type: 'updateState',
              payload : {currentItem:mess.currentItem,modalType:mess.modalType},
            })   
             if(mess.currentItem){
                 dispatch({ 
                    type: 'getbyID' ,
                    payload :{ 
                      id:mess.currentItem.id,
                      appId:mess.currentItem.appId,
                    }
                })  
       
               }   
        }
      })
    },
  },
  effects: {  
    * aliupload ({ payload = {} }, { call, put, select }) {
      const {clientOss,aliExpiration} = yield select(_ => _.bronk_manager)
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
    * reset({ payload = {} }, { call, put }) {

      const data = yield call(reset, payload)
      if (data.code===200) {
            yield put({ type: 'success',payload:'操作成功！' })   
      }
    },
    * modify({ payload = {} }, { call, put , select }) {
      
      const data = yield call(modify, payload)
      if (data.code===200) {
          yield put({ type: 'success',payload:'操作成功！' }) 
          const {searchlist} = yield select(_ => _.bronk_manager)
          yield put({
            type: 'query',
            payload:{
              ...searchlist
            }
          }) 
      }
    },
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchlist:payload,
            list: data.data.page.results, 
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.data.page.totalRecord,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },
   * delete ({ payload = {}}, { call, put, select }) {
      const data = yield call(remove,payload)
      const {contorlLimit,searchlist}  =   yield select(_ => _.bronk_manager)
      if (data.code===200) {
 
        yield put(routerRedux.push({
          pathname: '/bronk/manager',
           state:{
            searchlist,
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
  
       const {contorlLimit,searchlist}  =   yield select(_ => _.bronk_manager)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/manager',
          state:{
            searchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
        yield put({ 
            type: 'updateState',
            payload:{
                modalVisibleKey:true,
                 accessKey:data.appId ,
                 accessSecret:data.appSecret,
            } 
       })
        
      } else {
        //throw data
        message.error(data.info)
      }
    },

    * update ({ payload }, { select, call, put }) {
      const {contorlLimit,searchlist}  =   yield select(_ => _.bronk_manager)
      const data = yield call(update, payload)
      if (data.code===200) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/manager',
          state:{
            searchlist,
            controlState:{
               buttonState:contorlLimit
            }
          }
        }))
      } 
    },

    * searchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const searchlist = payload.searchlist 
        yield put({ type: 'updateSearch' , payload :{ searchlist}})
         yield put({ type: 'query' , payload :{ ...searchlist}})  
        // yield put(routerRedux.push({
        //   pathname: '/bronk/cms/resourceType',
        //   state:{...stateOrigin,searchlist},
        // }))
    },
    * showItem ({ payload }, { select, call, put }) {
         console.log(payload)
         yield put({ 
           type: 'updateState' , 
           payload :{
               ...payload
           }
         })
         yield put(routerRedux.push({
            pathname: '/bronk/manager/detail',
            state:payload,
          }))
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
