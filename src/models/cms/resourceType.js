import modelExtend from 'dva-model-extend'
import { config } from 'utils'
import pathToRegexp from 'path-to-regexp'
import { routerRedux } from 'dva/router'
import { query,create,getbyID,remove,update,deleteone} from 'services/cms_resourceType_api'
import { pageModel } from '../common'

//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'cms_resourceType',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/cms/resourceType') {
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
     * query ({ payload = {} }, { call, put }) {
      const data = yield call(query, payload)
      if (data.code===0) {
        yield put({
          type: 'querySuccess',
          payload: {
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
      const { selectedRowKeys } = yield select(_ => _.cms_resourceType)
      if (data.code===0) {
        yield put({ type: 'updateState', payload: { selectedRowKeys: selectedRowKeys.filter(_ => _ !== payload) } })
        yield put(routerRedux.push({
          pathname: '/cms/resourceType'
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
      console.log(payload )
      //const creator = yield select(({ app }) => app.user.username)
      const newUser = { ...payload}
      const data = yield call(create, newUser)
      if (data.code===0) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/cms/resourceType'
        }))
      } else {
        throw data
      }
    },

    * update ({ payload }, { select, call, put }) {
      const id = yield select(({ cms_resourceType }) => cms_resourceType.currentItem.id)
      const changer = yield select(({ app }) => app.user.username)
      const newUser = { ...payload, id,changer }
      const data = yield call(update, newUser)
      if (data.code===0) {
        yield put({ type: 'hideModal' })
        yield put(routerRedux.push({
          pathname: '/cms/resourceType'
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
          pathname: '/cms/resourceType',
          state:{...stateOrigin,serchlist},
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
