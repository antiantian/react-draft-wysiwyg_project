import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query,create,remove,update,deleteone,getbyID} from 'services/cms_resourcePublication_api'
import * as column_api from 'services/column_api'
import * as cms_api from 'services/cms_api' 
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
import  * as bronk_author_api  from 'services/bronk_author_api'
//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'cms_resourcePublication',

  state: {
    currentItem: {},
    publishItem: {},
    modalVisible: false,
    modal2Visible:false,
    showParentTree:false,
    modalType: 'create',
    selectedRowKeys: [],
    typelist:[],
    editorContent: null,
    searchlist:null,
    publishId:null,
    change_sitePid:null,
    resUser:[],// author
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/release') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'gettypelist'
           })
          // dispatch({
          //   type: 'getsitelist'
          //  })
          dispatch({
            type: 'query',
            payload,
          })
        }else if(location.pathname === '/bronk/release/detail'){
           var mess=location.state;
           dispatch({
            type: 'gettypelist'
           })
           dispatch({
            type: 'updateState',
            payload : {currentItem:mess.currentItem,modalType:mess.modalType},
          })  
           dispatch({
            type: 'resUser'
           })
          if(mess.currentItem){
            dispatch({
              type: 'getbyID',
              payload : {
                  id:mess.currentItem.id
              },
            })    
          } 
        }
      })
    },
  },
  effects: {
      * resUser ({ payload = {} }, { call, put }) {
      const data = yield call(bronk_author_api.query, payload)
      if (data.code===200) {
        yield put({
          type: 'updateState',
          payload: {
            resUser: data.data,  
          },
        })
      }
    },
    * getbyID ({ payload = {} }, { call, put, select }) {

       const data = yield call(getbyID, payload)
       
       if(data.code===200){
          let sitelist=data.data
          yield put({ type: 'updateState', payload: {currentItem:sitelist} })
       }
     },
    * getsitelist ({ payload = {} }, { call, put, select }) {

       const data = yield call(cms_api.query, payload)
       
       if(data.code===200){
          let sitelist=data.data
          yield put({ type: 'updateState', payload: {sitelist} })
       }
       
        
     },
     * gettypelist ({ payload = {} }, { call, put, select }) {
 
       const data = yield call(column_api.GetColumnList, payload)
    
       if(data.code===200){
          let typelist=data.data     
          yield put({ type: 'updateState', payload: {typelist} })
       }
       
        
     },
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchlist:payload,
            list: data.data.results,
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
      const data = yield call(deleteone,{id:payload})
      const { selectedRowKeys } = yield select(_ => _.cms_resourcePublication)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/bronk/release'
        }))
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
         yield put(routerRedux.push({
          pathname: '/bronk/release'
        }))
      } else {
        throw data
      }
    },

    * create ({ payload }, { select, call, put }) {
      const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload,creator }
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideDetails' })
         yield put(routerRedux.push({
          pathname: '/bronk/release'
        }))
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {

      const data = yield call(update, payload)
      if (data.code===200) {
          yield put({ type: 'hideDetails' })
          yield put(routerRedux.push({
            pathname: '/bronk/release'
          }))
      } else {
         throw data
      }
    },
    * publishSource ({ payload }, { select, call, put }) {
       yield put({ type: 'hidePushlish' })
       alert('publish--')
    },
    * showdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'showModal',payload:payload})
       yield put(routerRedux.push({
          pathname: '/bronk/release/detail',
          state:payload,
        }))
    },
    * hideDetails ({ payload }, { select, call, put }) {
       yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/bronk/release'
        }))
         // yield put({ type: 'query' })
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}}) 
        yield put(routerRedux.push({
          pathname: '/bronk/release',
          state:{...stateOrigin,serchlist},
        }))
    }
  },

  reducers: {
    editorContent (state, { payload }) {
       return { ...state, ...payload}
    },
    showModal (state, { payload }) {
      return { ...state, ...payload}
    },
    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showPushlish (state, { payload }) {
      return { ...state, ...payload, modalVisible: true}
    },
    hidePushlish (state) {
      return { ...state, modalVisible: false }
    },
    showModal2 (state, { payload }) {
      return { ...state, ...payload, modal2Visible: true }
    },
    hideModal2 (state) {
      return { ...state, modal2Visible: false }
    },
    showParentTree (state, { payload }){
      return { ...state, ...payload, showParentTree: true }
    },
    hideParentTree (state, { payload }){
      return { ...state, ...payload, showParentTree: false }
    },
    updateCparentPid (state, { payload }) {
       return { ...state, ...payload}
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
