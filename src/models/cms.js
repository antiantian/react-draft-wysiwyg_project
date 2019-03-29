/* global window */
import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import { create, remove, update,query,deleteone,updatePId,aliupload,aliuploadVideo} from 'services/cms_api'  //cms_api
import { pageModel } from './common'
import { routerRedux } from 'dva/router'

//const { query } = usersService
const { prefix } = config

export default modelExtend(pageModel, {
  namespace: 'cms',

  state: {
    currentItem: {},
    modalVisible: false,
    showParentTree:false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    serchlist:{
    	pageNo: 1,
    	pageSize: 10 
    },
    change_sitePid:null,
    clientOss:null,
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/cms/webManage') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          dispatch({
            type: 'query',   // 与 getsitelist合并成一个 不传参数时查所有 
            payload,
          })
          dispatch({
            type: 'getsitelist'
          })
        }
      })
    },
  },

  effects: {
    * getsitelist ({ payload = {} }, { call, put, select }) {
       const data = yield call(query, payload)
       if(data.code===0){
          let sitelist=data.data 
          yield put({ type: 'updateState', payload: {sitelist} })
       }
       
        
     }, 
    * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      yield put({type: 'gettypelist'})
      if (data.code===0) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchlist:payload,
            list:data.data.results,
            pagination: {
              current: Number(payload.pageNo) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total:data.data.totalRecord,
              showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
            },
          },
        })
      }
    },

    * delete ({ payload }, { call, put, select }) {
      const data = yield call(deleteone, { id: payload })
      const { selectedRowKeys } = yield select(_ => _.cms)
      if (data.code===0) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/cms/webManage'
        }))
      } else {
        throw data
      }
    },

    * multiDelete ({ payload }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * create ({ payload }, { select, call, put }) {
      //const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===0) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/cms/webManage'
        }))
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ cms }) => cms.currentItem.id)
   //   const changer = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(update, newUser)
      if (data.code===0) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/cms/webManage'
        }))
      } else {
        throw data
      }
    },
    * serchlist ({ payload }, { select, call, put }) {
    	const stateOrigin = payload.state 
    	const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}}) 
        yield put(routerRedux.push({
          pathname: '/cms/webManage',
          state:{...stateOrigin,serchlist},
        }))
    },
    * updatePId ({ payload }, { select, call, put }) {
      const data = yield call(updatePId, payload)
      if (data.code===0) {
         yield put({ type: 'hideParentTree' })
         yield put(routerRedux.push({
          pathname: '/cms/webManage'
        }))
      } else {
        throw data
      }  
    },
  },

  reducers: {
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },
    showParentTree (state, { payload }){
      return { ...state, ...payload, showParentTree: true }
    },
    updateCparentPid (state, { payload }) {
       return { ...state, ...payload}
    },
    hideParentTree (state, { payload }){
      return { ...state, ...payload, showParentTree: false }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
