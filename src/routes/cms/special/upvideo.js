/**
 * 
 * @authors zcy (1366969408@qq.com)
 * @date    2018-04-26 14:11:32
 * @version $Id$
 */


    var accessKeyId = document.getElementById("accessKeyId").value;
    var accessKeySecret = document.getElementById("accessKeySecret").value;
    var secretToken = document.getElementById("secretToken").value;

    var uploader = new AliyunUpload.Vod({
            // 文件上传失败
            'onUploadFailed': function (uploadInfo, code, message) {
                log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message);
            },
            // 文件上传完成
            'onUploadSucceed': function (uploadInfo) {
                log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            },
            // 文件上传进度
            'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
                log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + (loadedPercent * 100.00).toFixed(2) + "%");
            },
            // STS临时账号会过期，过期时触发函数
            'onUploadTokenExpired': function (uploadInfo) {
                log("onUploadTokenExpired");
                if (isVodMode()) {
                    // 实现时，根据uploadInfo.videoId从新获取UploadAuth
                    //实际环境中调用点播的刷新上传凭证接口，获取凭证
                        //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        //获取上传凭证后，调用setUploadAuthAndAddress
                    // uploader.resumeUploadWithAuth(uploadAuth);
                } else if (isSTSMode()) {
                    // 实现时，从新获取STS临时账号用于恢复上传
                    // uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken, expireTime);
                }
            },
            onUploadCanceled:function(uploadInfo)
            {
                log("onUploadCanceled:file:" + uploadInfo.file.name);
            },
            // 开始上传
            'onUploadstarted': function (uploadInfo) {
                if (isVodMode()) {
                    if(!uploadInfo.videoId)//这个文件没有上传异常
                    {
                        //mock 上传凭证，实际产品中需要通过接口获取
                        var uploadAuth = document.getElementById("uploadAuth").value;
                        var uploadAddress = document.getElementById("uploadAddress").value;
                        var videoId = document.getElementById("videoId").value;
                        //实际环境中调用调用点播的获取上传凭证接口
                        //https://help.aliyun.com/document_detail/55407.html?spm=a2c4g.11186623.6.629.CH7i3X
                        //获取上传凭证后，调用setUploadAuthAndAddress
                        uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId);
                    }
                    else//如果videoId有值，根据videoId刷新上传凭证
                    {
                        //mock 上传凭证 实际产品中需要通过接口获取
                        var uploadAuth = document.getElementById("uploadAuth").value;
                        var uploadAddress = document.getElementById("uploadAddress").value;
                        //实际环境中调用点播的刷新上传凭证接口，获取凭证
                        //https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        //获取上传凭证后，调用setUploadAuthAndAddress
                        uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress);
                    }
                }
                else if (isSTSMode()) {
                    var accessKeyId = document.getElementById("accessKeyId").value;
                    var accessKeySecret = document.getElementById("accessKeySecret").value;
                    var secretToken = document.getElementById("secretToken").value;
                    uploader.setSTSToken(uploadInfo, accessKeyId, accessKeySecret,secretToken, "test");
                }
                log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object);
            }
            ,
            'onUploadEnd':function(uploadInfo){
                log("onUploadEnd: uploaded all the files");
            }
        });

    // 点播上传。每次上传都是独立的鉴权，所以初始化时，不需要设置鉴权
    // 临时账号过期时，在onUploadTokenExpired事件中，用resumeWithToken更新临时账号，上传会续传。
    var selectFile = function (event) {
            var endpoint = document.getElementById("endpoint").value;
            var bucket = document.getElementById("bucket").value;
            var objectPre = document.getElementById("objectPre").value;
            var userData;
            if (isVodMode()) {
                userData = '{"Vod":{"UserData":{"IsShowWaterMark":"false","Priority":"7"}}}';
            } else {
                userData = '{"Vod":{"Title":"this is title.我是标题","Description":"this is desc.我是描述","CateId":"19","Tags":"tag1,tag2,标签3","UserData":"user data"}}';
            }

            for(var i=0; i<event.target.files.length; i++) {
                log("add file: " + event.target.files[i].name);
                if (isVodMode()) {
                    // 点播上传。每次上传都是独立的OSS object，所以添加文件时，不需要设置OSS的属性
                    uploader.addFile(event.target.files[i], null, null, null, userData);
                } else if(isSTSMode()) {
                    // STS的上传方式，需要在userData里指定Title
                    var object = objectPre;
                    // if(objectPre)
                    // {
                    //     object = objectPre +"/"+ event.target.files[i].name;
                    // }
                    uploader.addFile(event.target.files[i], endpoint, bucket, object , userData);
                }
            }
        };

    document.getElementById("files")
        .addEventListener('change', selectFile);

    var textarea=document.getElementById("textarea");

    function start() {
        log("start upload.");
        uploader.startUpload();
    }

    function stop() {
        log("stop upload.");
        uploader.stopUpload();
    }

    function resumeWithToken() {
        log("resume upload with token.");
        var uploadAuth = document.getElementById("uploadAuth").value;

        var accessKeyId = document.getElementById("accessKeyId").value;
        var accessKeySecret = document.getElementById("accessKeySecret").value;
        var secretToken = document.getElementById("secretToken").value;

        if (isVodMode()) {
            uploader.resumeUploadWithAuth(uploadAuth);
        } else if (isSTSMode()) {
            uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, secretToken);
        }
    }

    function clearInputFile()
    {
        var ie = (navigator.appVersion.indexOf("MSIE")!=-1);  
        if( ie ){  
            var file = document.getElementById("files");
            var file2= file.cloneNode(false);  
            file2.addEventListener('change', selectFile);
            file.parentNode.replaceChild(file2,file);  
        }
        else
        {
            document.getElementById("files").value = '';
        }

    }

    function clearList() {
        log("clean upload list.");
        uploader.cleanList();
    }

    function getList() {
        log("get upload list.");
        var list = uploader.listFiles();
        for (var i=0; i<list.length; i++) {
            log("file:" + list[i].file.name + ", status:" + list[i].state + ", endpoint:" + list[i].endpoint + ", bucket:" + list[i].bucket + ", object:" + list[i].object);
        }
    }

    function deleteFile() {
        if (document.getElementById("deleteIndex").value) {
            var index = document.getElementById("deleteIndex").value
            log("delete file index:" + index);
            uploader.deleteFile(index);
        }
    }

    function cancelFile() {
        if (document.getElementById("cancelIndex").value) {
            var index = document.getElementById("cancelIndex").value
            log("cancel file index:" + index);
            uploader.cancelFile(index);
        }
    }

    function resumeFile() {
        if (document.getElementById("resumeIndex").value) {
            var index = document.getElementById("resumeIndex").value
            log("resume file index:" + index);
            uploader.resumeFile(index);
        }
    }

    function clearLog() {
        textarea.options.length = 0;
    }

    function log(value) {
        if (!value) {
            return;
        }

        var len = textarea.options.length;
        if (len > 0 && textarea.options[len-1].value.substring(0, 40) == value.substring(0, 40)) {
            //textarea.remove(len-1);
        } else if (len > 25) {
            textarea.remove(0);
        }

        var option=document.createElement("option");
        option.value=value,option.innerHTML=value;
        textarea.appendChild(option);
    }

    function isVodMode() {
        var uploadAuth = document.getElementById("uploadAuth").value;
        return (uploadAuth && uploadAuth.length > 0);
    }

    function isSTSMode() {
        var secretToken = document.getElementById("secretToken").value;
        if (!isVodMode()) {
            if (secretToken && secretToken.length > 0) {
                return true;
            }
        }
        return false;
    }



module.exports = {}