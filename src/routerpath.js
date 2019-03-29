/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-05-23 11:35:00
 * @version $Id$
 */

  const routes = [
    {
      path: '/bronk/homepage',
      component: () => import('./routes/homepage/'),
    },
    {
      path: '/bronk/submission',
      models: () => [import('./models/cms/resourceGather')],
      component: () => import('./routes/cms/resourceGather/'),
    }, {
      path: '/bronk/submission/detail',  
      models: () => [import('./models/cms/resourceGather')],
      component: () => import('./routes/cms/resourceGather/details'),
    } 
  ]



      

  export default  routes