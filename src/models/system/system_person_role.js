/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-15 17:44:46
 * @version $Id$
 */

import modelExtend from 'dva-model-extend'
import { config} from 'utils'
import pathToRegexp from 'path-to-regexp'
import {query,queryList,getbyID,create,deleteone,update,personhad_role,role_add_p,
  role_Resource,deleteonePerson,queryGetPerson,queryGetAhtority} from 'services/system_role_api'
 
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
//const { query } = usersService
const { prefix } = config
export default modelExtend(pageModel, {


  namespace: 'system_person_role',

  state: {
    currentPersonItem: {},  
    searchlist:{pageNo: 1, pageSize: 10 },
    change_sitePid:null,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    RoleLIST_list: [],
    RoleLIST_all:[],
    List_Person:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
       if(location.pathname === '/bronk/role/personlist'){ 
           const payload ={ pageNo: 1, pageSize: 10 };
           const currentPersonItem=location.state?location.state.currentPersonItem:{};
           const editPerson_id=currentPersonItem.userAccessId;
           const currentItemRole=location.state?location.state.currentItem:{};
           if(editPerson_id){
             payload.userAccessId=editPerson_id
           }
           console.log(currentPersonItem)
           dispatch({
            type: 'updateState',
            payload : {
              editPerson_id,
              currentPersonItem,
              currentItemRole,
              searchlist:{...payload},
            },
          })  
           dispatch({  //获取所有 userAccessId
              type: 'guestuRoleLIST',
              payload
            })
           dispatch({  //获取所有 userAccessId
              type: 'query'
            }) 
           dispatch({  //获取所有 userAccessId
              type: 'queryGetPerson',
              payload:{
                roleAccessId:currentItemRole.roleAccessId
              }
            }) 
             
        }
      })
    },
  },
  effects: {
     * query ({ payload = {} }, { call, put }) {

        const data = yield call(queryList, payload)
        if (data.code===200) {
               yield put({ type: 'updateState' , payload :{ 
                   RoleLIST_all: data.data.page.results, 
               }}) 
        }
      },
    * guestuRoleLIST ({ payload = {} }, { call, put }) {

        const data = yield call(query, payload)
        if (data.code===200) {
              yield put({
                type: 'querySuccessRoleLIST',
                payload: {
                  searchlist:payload, 
                  RoleLIST_list: data.data.page.results, 
                  RoleLISTpagination: {
                    current: Number(payload.pageNo) || 1,
                    pageSize: Number(payload.pageSize) || 10,
                    total: data.data.page.totalRecord,
                    showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
                  },
                },
              })
  
        }else{
            yield put({ type: 'querySuccessRoleLIST' , payload :{
              searchlist:payload, 
              RoleLIST_list: [], 
              RoleLISTpagination: {
                current: Number(payload.pageNo) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: 0,
                showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
              },
           }})   
        }
      },
    * queryGetPerson ({ payload = {} }, { call, put, select }) {
          const data = yield call(queryGetPerson, payload)
          
          if (data.code===200) {
            yield put({
              type: 'querySuccessPerson',
              payload: {
                searchlistPerson:payload,
                List_Person: data.data.page.results, 
                Personpagination: {
                  current: Number(payload.pageNo) || 1,
                  pageSize: Number(payload.pageSize) || 10,
                  total: data.data.page.totalRecord,
                  showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
                },
              },
            })
          }else{
            yield put({
              type: 'error',payload:data.info
            })
          }
    }, 
    *BatchAddRole ({ payload = {} }, { call, put, select }) {
       
       const data = yield call(personhad_role,payload)
       if(data.code===200){
            yield put({
              type: 'success',payload:'批量添加成功'
            })
            yield put({
             type: 'system_person_role/modalPersonComHide',
           })
           const {searchlist} = yield select(_ => _.system_person_role)
           yield put({ type: 'guestuRoleLIST' , payload :{...searchlist}}) 
       }else{
           throw data
       }
    },
    * serchlist ({ payload }, { select, call, put }) {
        const searchlist = payload.searchlist    //personhad_role
        yield put({ type: 'updateSearch' , payload :{ searchlist}}) 
        yield put({ type: 'guestuRoleLIST' , payload :{...searchlist}}) 
    },
    * searchLeftlist ({ payload }, { select, call, put }) {
        const searchLeftlist = payload.searchLeftlist    //personhad_role
        yield put({ type: 'updateSearch' , payload :{ searchLeftlist}}) 
        yield put({ type: 'queryGetPerson' , payload :{...searchLeftlist}}) 
    },
  },   

  reducers: {
  	getdatasource (state, { payload }) {
  		return { ...state, ...payload}
  	},
    editorContent (state, { payload }) {
       return { ...state, ...payload}
    },
    editmode (state, { payload }) {
       return { ...state, ...payload,modalVisible:true}
    },
    hidemode (state, { payload }) {
       return { ...state, ...payload,modalVisible:false}
    },
    modalPersonVisible(state, { payload }) {
       return { ...state, ...payload,modalPersonVisible:true}
    },
    modalPersonHide (state, { payload }) {
       return { ...state, ...payload,modalPersonVisible:false}
    },
  },
})  
