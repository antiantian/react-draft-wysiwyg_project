import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { query,create,remove,update,deleteone,updateSync} from 'services/cms_resourceGather_api'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'

//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'cms_resourceGather',

  state: {
    currentItem: {},
    publishItem: {},
    modalVisible: false,
    modal2Visible:false,
    modalupdateSync:false,
    modalupdate:false,
    modalType: 'create',
    selectedRowKeys: [],
    typelist:[],//资源类型
    editorContent: null,
    searchlist:null,
    publishId:null,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    videoAuth:{},//视频上传凭证
    resUser:[],// author
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/bronk/submission') {
          const payload =location.state?location.state.serchlist? location.state.serchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
   
        }else if(location.pathname === '/bronk/submission/detail'){
           var mess=location.state;
            
        }
      })
    },
  },
  effects: {
 
  
     * resourceGather ({ payload = {} }, { call, put, select }) {
      yield put( routerRedux.push({
                pathname: '/bronk/submission'
              }))
     },
  
 
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===200) {
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
      const data = yield call(deleteone,{id:payload})
      const { selectedRowKeys } = yield select(_ => _.cms_resourceGather)
      if (data.code===200) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/bronk/submission'
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
          pathname: '/bronk/submission'
        }))
      } else {
        throw data
      }
    },

    * create ({ payload }, { select, call, put }) {
      const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload.datas,creator }
      const data = yield call(create, newUser)
      if (data.code===200) {
        yield put({ type: 'hideDetails',payload:{state:payload.state} }) 
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ cms_resourceGather }) => cms_resourceGather.currentItem.id)
      const changer = yield select(({ app }) => app.user.username)
      const newUser = { ...payload.datas, id,changer }
      const data = yield call(update, newUser)
      if (data.code===200) {
        yield put({ type: 'hideDetails',payload:{state:payload.state} })
        yield put({ type: 'hideModalupdate' })

      } else {
        throw data
      }
    },
    * dialogpublishSource({ payload }, { select, call, put }){
        yield put({ type: 'showModalupdate' })
    },
    * upsync({ payload }, { select, call, put }){
        yield put({ type: 'showModalupdateSync' })
    },
    * updateSync({ payload }, { select, call, put }) { //修改并同步已发布的更新
      const id = yield select(({ cms_resourceGather }) => cms_resourceGather.currentItem.id)
      const newUser = { ...payload.datas, id }
      const data = yield call(updateSync, newUser)
      if (data.code===200) {
        yield put({ type: 'success',payload:'修改成功！' })
        yield put({ type: 'hideDetails',payload:{state:payload.state} })
        yield put({ type: 'hideModalupdateSync' })
 
      } else {
        throw data
      }
    },
 
    * showdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'showModal',payload:payload})
       yield put(routerRedux.push({
          pathname: '/bronk/submission/detail',
          state:payload,
        }))
    },
    * hideDetails ({ payload }, { select, call, put }) {
       yield put({ type: 'hideModal' })
       const {state}=payload
        yield put(routerRedux.push({
          pathname: '/bronk/submission',
          state:state.searchlist
        }))
         // yield put({ type: 'query' })
    },
    * serchlist ({ payload }, { select, call, put }) {
      const stateOrigin = payload.state 
      const serchlist = payload.serchlist 
        yield put({ type: 'updateSearch' , payload :{ serchlist}}) 
        yield put(routerRedux.push({
          pathname: '/bronk/submission',
          state:{...stateOrigin,serchlist},
        }))
    },
    * modalup_hide ({ payload }, { select, call, put }) {
         yield put({ type: 'hideModalupdateSync' })
         yield put({ type: 'hideModalupdate' })
    },
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
    showModalupdateSync (state, { payload }) {
      return { ...state, ...payload, modalupdateSync: true }
    },
    hideModalupdateSync(state) {
      return { ...state, modalupdateSync: false }
    },
    showModalupdate (state, { payload }) {
      return { ...state, ...payload, modalupdate: true }
    },
    hideModalupdate (state, { payload }) {
      return { ...state, ...payload, modalupdate: false }
    },
    showModal2 (state, { payload }) {
      return { ...state, ...payload, modal2Visible: true }
    },
    hideModal2 (state) {
      return { ...state, modal2Visible: false }
    },
    switchIsMotion (state) {
      window.localStorage.setItem(`${prefix}userIsMotion`, !state.isMotion)
      return { ...state, isMotion: !state.isMotion }
    },

  },
})
