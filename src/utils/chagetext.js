/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2017-12-14 16:47:51
 * @version $Id$
 */
 const changeText = (data) =>{
    if(data==0){
    	  return "本部门"  
    }
    if(data==1){
    	  return "本部门、下级部门"  
    }
    if(data==2){
    	  return "本部门、同级部门、下级部门"  
    }
    if(data==100){
    	  return "所有"  
    }
	
}


module.exports = {
 changeText,
}
