/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-13 14:58:17
 * @version $Id$
 */

import modelExtend from 'dva-model-extend'
import { config} from 'utils'
import pathToRegexp from 'path-to-regexp'
import {query,queryList,getbyID,create,deleteone,update,personhad_role,role_add_p,
  role_Resource,deleteonePerson,queryGetPerson,queryGetAhtority,UpdateOneAhtority,DelOneAhtority} from 'services/system_role_api'
import * as system_resource from 'services/system_resource'
import * as bronk_manager_api from 'services/bronk_manager_api'
import {batchBigUserOrgApi} from 'services/move_api'
import { pageModel } from '../common'
import { routerRedux } from 'dva/router'
import queryString from 'query-string'
//const { query } = usersService
const { prefix } = config
// 定义promise   
const delay = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve,timeout)
    })
}


export default modelExtend(pageModel, {


  namespace: 'system_role',

  state: {
    currentItem: {},
    currentAuthorityEItem:{}, 
    department_menu:[],
    group_menu:[],
    position_menu:[],
    searchlist:{pageNo: 1, pageSize: 10 },
    change_sitePid:null,
    isMotion: window.localStorage.getItem(`${prefix}userIsMotion`) === 'true',
    list: [],
    menu:[],
    getAll:true,
    modalType: 'create',
    modalVisible:false,
    edit_id:null,
    retryEdit_loding:false,
    modalAuthorityVisible:false,
    department_treeData:[],
    searchlistAhtority:{pageNo: 1, pageSize: 10 },
    searchlistPerson:{pageNo: 1, pageSize: 10 },
    searchlistRoleLIST:{pageNo: 1, pageSize: 10 },
    List_Ahtority:[],
    List_Person:[],
    RoleLIST_list:[], 
    modalAuthorityEditVisible:false,
    roleChild:'a',
    source_all:[],
    EditOneSource:[],
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {

        if (location.pathname === '/bronk/role') {        
          const payload =location.state?location.state.searchlist? location.state.searchlist:{ pageNo: 1, pageSize: 10 }:{ pageNo: 1, pageSize: 10 };
          const department_menu=location.state?location.state.department_menu?location.state.department_menu:[]:[];
          const group_menu=location.state?location.state.group_menu?location.state.group_menu:[]:[];
          const position_menu=location.state?location.state.position_menu?location.state.position_menu:[]:[];
          if(!payload.pageSize){
             payload.pageNo=1
             payload.pageSize=10
          }   
           dispatch({
              type: 'queryALLsource'
           }) 
          dispatch({
            type: 'updateState',
            payload : {
              serchlist:{...payload},
              department_menu,
              group_menu,
              position_menu,
            },
          })  
     

          dispatch({  //获取分页数据
            type: 'query',
            payload,
          })
          dispatch({  //获取所有人
            type: 'admin_queryPerson',
          })
         
          // dispatch({
          //   type: 'startDetail',
          //   payload : {change_sitePid:payload.id},
          // })
          
        }else if(location.pathname === '/bronk/role/detail'){ 

           var mess=location.state;
           // dispatch({
           //  type: 'getmenulist'
           // })
   
           dispatch({
            type: 'updateState',
            payload : {
                currentItem:mess.currentItem,
                change_sitePid:mess.change_sitePid,
                edit_id:mess.currentItem.id,
                modalType:mess.modalType,
                department_menu:mess.department_menu,
                group_menu:mess.group_menu, 
                position_menu:mess.position_menu,
                department_treeData:mess.department_treeData,
             },
           })  
 
           dispatch({  //获取所有
              type: 'queryGetPerson',  //queryGetPerson   admin_queryPerson
              payload:{ roleAccessId:mess.currentItem.roleAccessId,pageNo: 1, pageSize: 10 }  
            })
            dispatch({  //获取所有
              type: 'queryGetAhtority',
              payload:{ roleAccessId:mess.currentItem.roleAccessId,pageNo: 1, pageSize: 10 }  
            })
           // if(mess.modalType&&mess.modalType!=='create'&&mess.change_sitePid){
           //       dispatch({
           //          type: 'getIdetail',
           //          payload:{
           //            id:mess.change_sitePid
           //          }
           //       }) 
           // }
          
        }
      })
    },
  },
  effects: {
    *admin_queryPerson({ payload = {} }, { call, put }){
      
        const data = yield call(bronk_manager_api.query, payload)

        if (data.code===200) {
               const list=data.data.page.results;
              
                yield put({
                    type: 'updateState',
                    payload:{
                       person_menu:list||[]
                    },
                })
        }else{
           throw data
        }
    },
    * GetOneSource ({ payload = {} }, { call, put }){
       //
        const data = yield call(system_resource.query, payload)

        if (data.code===200) {
               const list=data.data.page.results;
               
                yield put({
                    type: 'updateState',
                    payload:{
                       EditOneSource: list[0]?list[0].authList:{}
                    },
                })
        }else{
           throw data
        }
    },
    * DelOneAhtority ({ payload = {} }, { call, put,select }) {
        const data = yield call(DelOneAhtority, payload)
        if (data.code===200) {
                yield put({
                    type: 'success',
                    payload: '删除成功',
                })
                const { searchlistAhtority } = yield select(_ => _.system_role)
                console.log(searchlistAhtority)
                yield put({ type: 'queryGetAhtority' , payload :{...searchlistAhtority}})
        }

    },
    * UpdateOneAhtority ({ payload = {} }, { call, put }) {
        const data = yield call(UpdateOneAhtority, payload) 
        if (data.code===200) {
                yield put({
                    type: 'updateState',
                    payload:{
                       EditOneSource:{},
                       currentAuthorityEItem:{}
                    },
                })
                yield put({
                    type: 'success',
                    payload: '修改成功',
                })
        }else{
             yield put({
                type: 'error',
                payload: '失败',
            })
        }

    },
    * queryALLsource  ({ payload = {} }, { call, put }) {
        const data = yield call(system_resource.queryALL, payload)
        if (data.code===200) {
                yield put({
                    type: 'updateState',
                    payload: {
                      source_all:data.data.authList.list||[]
                    },
                })
        }

    },
    
    * showPersonlist ({ payload = {} }, { call, put }) {
        yield put(routerRedux.push({
           pathname: '/bronk/role/personlist',
           state:payload, 
        }))
    },
    * guestuRoleLIST ({ payload = {} }, { call, put }) {

        const data = yield call(query, payload)
        if (data.code===200) {
          yield put({
            type: 'querySuccessRoleLIST',
            payload: {
              searchlistRoleLIST:payload, 
              RoleLIST_list: data.data.page.results, 
              RoleLISTpagination: {
                current: Number(payload.pageNo) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.data.page.totalRecord,
                showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
              },
            },
          })
        }
      },
    * queryGetPerson ({ payload = {} }, { call, put, select }) {
          const data = yield call(queryGetPerson, payload)  //queryGetPerson
          if (data.code===200) {
             if(!payload.pageNo){
                  let nop=[];
                  data.data.page.results.forEach((item)=>{
                     if(item.userAccessId){
                         nop.push(item.userAccessId)
                     } 
                  })
                  yield put({ type: 'updateState',payload:{Nooperate:nop} })
              }else{
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
              }    
          }
    }, 
   * queryGetAhtority ({ payload = {} }, { call, put, select }) {
          const data = yield call(queryGetAhtority, payload)
          if (data.code===200) {
            if(!payload.pageNo){
                  let nop=[];
                  data.data.page.results.forEach((item)=>{
                     if(item.id){
                         nop.push(item.id)
                     } 
                  })
                  yield put({ type: 'updateState',payload:{hadSelectedids:nop,hadSelectedData:data.data.page.results} })
              }else{

                  yield put({
                    type: 'updateState',//querySuccessAhtory
                    payload: {
                      searchlistAhtority:payload, 
                      List_Ahtority: data.data.page.results, 
                      Ahtoritypagination: {
                        current: Number(payload.pageNo) || 1,
                        pageSize: Number(payload.pageSize) || 10,
                        total: data.data.page.totalRecord,
                        showTotal: (total, range) => `共 ${total}条,当前是${range}条`,
                      },
                    },
                  })
              }    
          }
    },
    * exportUserOrgs ({ payload = {} }, { call, put, select }) {
       //const menu = yield select(({ app }) => app.menu)
        const data = yield call(exportUserOrgs,payload)
         if(data.code===200){
             yield put({
                  type: 'success',payload:'操作成功!'
            })
        }
     },
     * getmenulist ({ payload = {} }, { call, put, select }) {
       //const menu = yield select(({ app }) => app.menu)
         const data = yield call(query,payload)
         if(data.code===200){
            let sitelist=data.data.list; 
            yield put({
              type: 'getdatasource',payload:{menu:sitelist}
           })
        }
     },
 
 
     * query ({ payload = {} }, { call, put }) {

        const data = yield call(queryList, payload)
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
     * getIdetail ({ payload = {} }, { call, put, select }) { 
       //const menu = yield select(({ app }) => app.menu)
       const {change_sitePid} = yield select(_ => _.system_role)

       const data = yield call(getbyID,{id:change_sitePid})
       if(data.code===200){
          let sitelist=data.data.user; 
         // console.log(sitelist)
          yield put({
            type: 'getdatasource',payload:{currentItem:sitelist}
         })
      }
     },
     * startDetail ({ payload = {} }, { call, put, select }) { 
       //const menu = yield select(({ app }) => app.menu)
       const {change_sitePid} = payload;
       const data = yield call(getbyID,{id:change_sitePid})
       if(data.code===200){
          let sitelist=data.data.user; 
         // console.log(sitelist)
          yield put({
            type: 'getdatasource',payload:{currentItem:sitelist}
         })
      }
     },
     * updateCparentPid ({ payload = {} }, { call, put, select }) { //列表页更新搜索条件
        const {change_sitePid} = payload;
        // const { serchlist } = yield select(_ => _.system_role)
        yield put({ type: 'updateSearch' , payload :{...payload,serchlist:{id:change_sitePid,pageNo:1,pageSize:10}}}) 
         
        // yield put({ type: 'query' , payload :{id:change_sitePid,pageNo:1,pageSize:10}}) 
        
         const data = yield call(getbyID,{id:change_sitePid})
         if(data.code===200){
            let sitelist=data.data.user; 
           // console.log(sitelist)
            yield put({
              type: 'getdatasource',payload:{currentItem:sitelist}
           })
        }
          
    },
    * updateSeeDetail ({ payload = {} }, { call, put, select }) {
         const ids = payload.change_sitePid;
        const { menu } = yield select(_ => _.system_role)
        const datas = menu.filter((item)=>{
               return item.id==ids|| item.organizationSuper==ids
        })
          yield put({
             type: 'getdatasource',payload:{...payload,list:datas}
          })
          yield put({
             type: 'getIdetail'
          })
    },
    * getAllMenu ({ payload = {} }, { call, put, select }) {
       const {getAll} = payload;
       if(getAll){
        yield put({ type: 'getmenulist' })

        const { menu } = yield select(_ => _.system_role)
           yield put({
            type: 'getdatasource',payload:{list:menu,getAll:getAll}
           })
       }
     },
     * delete ({ payload = {} }, { call, put, select }) {
       const data = yield call(deleteone,payload)
       if(data.code===200){
            const { searchlist } = yield select(_ => _.system_role) 
            yield put({ type: 'query' , payload :{...searchlist}}) 
       }
       
     },
     * deletePerson ({ payload = {} }, { call, put, select }) {
       const data = yield call(deleteonePerson,payload)
       if(data.code===200){
          yield put({
                  type: 'success',payload:'删除成功!'
            })
          const { searchlistPerson } = yield select(_ => _.system_role)
          yield put({ type: 'queryGetPerson' , payload :{...searchlistPerson}}) 
       }
       
     },
     * batchBigUserOrg({ payload }, { select, call, put }) {
          
           const data = yield call(batchBigUserOrgApi, payload)
           if (data.code===200) {
                   yield put({ type: 'modalPersonHide'})
                   yield put({ type: 'success',payload:'移动成功'})
                   const { searchlist } = yield select(_ => _.system_role)
                   yield put({ type: 'query' , payload :{...searchlist}}) 
            } else { 
              throw data
            }
          
     },

     * role_add_p({ payload }, { select, call, put }) {
          
           const data = yield call(role_add_p, payload)
           if (data.code===200) {
                   yield put({ type: 'modalPersonComHide'})
                   yield put({ type: 'success',payload:'批量添加成员成功'})
                   const { searchlist } = yield select(_ => _.system_role)
                   yield put({ type: 'query' , payload :{...searchlist}}) 
            } else { 
              throw data
            }
          
     },
     * role_add_Resource({ payload }, { select, call, put }) {

           const data = yield call(role_Resource, payload)
           if (data.code===200) {
                   yield put({ type: 'updateState',payload:{modalAuthorityVisible:false} })
                   yield put({ type: 'success',payload:'批量添加权限成功'})
            } else { 
               throw data
            }
          
     },
     * updateBind({ payload }, { select, call, put }) {
 
           const {roleAccessId} = payload.currentItem;
           //获取当前角色全部权限
           yield put({ type: 'updateState',payload})
           // const data = yield call(role_Resource, payload)
           // if (data.code===200) {
           //        const datalist =data.data.list;
           //        const ids=[];
           //        datalist.forEach((item)=>{ids.push(item.id) })
           //         yield put({ type: 'updateState',payload:{hadSelectedData:,hadSelectedids:ids}}) 
           //  } else { 
           //     throw data
           //  }
          
     },
     * updateOneAuthority ({ payload }, { select, call, put }) {

        const data = yield call(UpdateOneAhtority, payload)
        if (data.code===200) {
            yield put({ type: 'success',payload:"修改成功"})
            yield put({ type: 'updateState',payload:{modalAuthorityEditVisible:false,currentAuthorityEItem:{}}})
            const { searchlistAhtority } = yield select(_ => _.system_role)
            yield put({ type: 'queryGetAhtority' , payload :{...searchlistAhtority}})
        } else { 
          throw data
        }
     },
     * create ({ payload }, { select, call, put }) {
        const data = yield call(create, payload)
        if (data.code===200) {
             yield put({ type: 'hideDetails',payload:payload})

    
        } else { 
          throw data
        }
    },

    * update ({ payload }, { select, call, put }) {
      const newUser = { ...payload.datas}
      const data = yield call(update, newUser)
      if (data.code===200) {
         yield put({ type: 'success',payload:"修改成功"})
         yield put({ type: 'updateState',payload:{currentItem:newUser,modalType:'preview'} })

      } else {
        throw data
      }
    },
    * hideDetails ({ payload }, { select, call, put }) {
       yield put({ type: 'hidemode' })
       const {state}=payload
       const searchlist = state?state.searchlist:{};
       const controlState = state?state.controlState:{};

          yield put(
              routerRedux.push({
                      pathname: '/bronk/role',
                      state:{
                        ...searchlist,
                        ...controlState
                      }
                    })
            )
      
         // yield put({ type: 'query' })
    },
     * showdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'editmode',payload:payload})
    },
     * showEditdetail ({ payload }, { select, call, put }) {
       yield put({ type: 'updateSearch',payload:payload})
       yield put(routerRedux.push({
          pathname: '/bronk/role/detail',
          state:payload, 
        }))
    },
    * serchlist ({ payload }, { select, call, put }) {
        const searchlist = payload.searchlist  
        yield put({ type: 'updateSearch' , payload :{ searchlist}}) 
        yield put({ type: 'query' , payload :{...searchlist}}) 
    },
    * serchlist_Person ({ payload }, { select, call, put }) {
        const searchlistPerson = payload.searchlistPerson  
        yield put({ type: 'updateSearch' , payload :{ searchlistPerson}}) 
        yield put({ type: 'queryGetPerson' , payload :{...searchlistPerson}}) 
    },
    * serchlist_Ahtority ({ payload }, { select, call, put }) {
        const searchlistAhtority = payload.searchlistAhtority  

        yield put({ type: 'updateSearch' , payload :{ searchlistAhtority}}) 
        yield put({ type: 'queryGetAhtority' , payload :{...searchlistAhtority}}) 
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
  },
})  
