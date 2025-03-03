// 1
// 享元模式改造上传
// 文件特别多时候
var Upload = function( uploadType){
    this.uploadType = uploadType;
};
Upload.prototype.delFile = function( id ){
    uploadManager.setExternalState( id, this ); // (1)
    if ( this.fileSize < 3000 ){
        return this.dom.parentNode.removeChild( this.dom );
    }
    if ( window.confirm( '确定要删除该文件吗? ' + this.fileName ) ){
        return this.dom.parentNode.removeChild( this.dom );
    }
}
// 创建Upload对象的工厂
var UploadFactory = (function(){
    var createdFlyWeightObjs = {};
    return {
        create: function( uploadType){
            // 内部状态 （上传类型）存储于内部             
            if ( createdFlyWeightObjs [ uploadType] ){
                return createdFlyWeightObjs[uploadType];
            }
            return createdFlyWeightObjs [ uploadType] = new Upload( uploadType);
        }
    }
})();
// 外部管理器
var uploadManager = (function () {
    // 保存所有的外部状态
    var uploadDatabase = {};
    return {
        // id fileName fileSize
        // 外部状态
        add: function (id, uploadType, fileName, fileSize) {
            // 向UploadFactory提交创建对象的请求
            var flyWeightObj = UploadFactory.create(uploadType);
            // div
            var dom = document.createElement( 'div' );
            dom.innerHTML =
                '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
                '<button class="delFile">删除</button>';
            dom.querySelector( '.delFile' ).onclick = function(){
                flyWeightObj.delFile( id );
            }
            document.body.appendChild( dom );
            // 存储外部状态
            uploadDatabase[ id ] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            };
            return flyWeightObj ;
        },
        setExternalState: function( id, flyWeightObj ){
            var uploadData = uploadDatabase[ id ];
            for ( var i in uploadData ){
                flyWeightObj[ i ] = uploadData[ i ];
            }
        }
    }
})();
var id = 0;
window.startUpload = function( uploadType, files ){
    for ( var i = 0, file; file = files[ i++ ]; ){
        var uploadObj = uploadManager.add( ++id, uploadType, file.fileName, file.fileSize );
    }
};
startUpload( 'plugin', [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.html',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 5000
    }
]);
startUpload( 'flash', [
    {
        fileName: '4.txt',
        fileSize: 1000
    },
    {
        fileName: '5.html',
        fileSize: 3000
    },
    {
        fileName: '6.txt',

        fileSize: 5000
    }
]);



// 2对象池技术 - 地图

var toolTipFactory = (function(){
    var toolTipPool = []; // toolTip 对象池
    return {
        create: function () {
            // debugger
            if ( toolTipPool.length === 0 ){ // 如果对象池为空
                var div = document.createElement( 'div' ); // 创建一个dom
                document.body.appendChild( div );
                return div;
            } else {
                // 如果对象池里不为空
                // 关键点 shift 导出
                return toolTipPool.shift(); // 则从对象池中取出一个dom
            }
        },
        recover: function( tooltipDom ){
            return toolTipPool.push( tooltipDom ); // 对象池回收dom
        }
    }
})();

var ary = [];
for (var i = 0, str; str = ['A', 'B'][i++];){
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    ary.push( toolTip );
};

for ( var i = 0, toolTip; toolTip = ary[ i++ ]; ){
    toolTipFactory.recover( toolTip );
};

for (var i = 0, str; str = ['A', 'B', 'C', 'D', 'E', 'F'][i++];){
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
};


// 3通用线程池实现

var objectPoolFactory = function( createObjFn ){
    var objectPool = [];
    return {
        create: function () {
            console.log(objectPool)
            var obj = objectPool.length === 0 ?
            createObjFn.apply( this, arguments ) : objectPool.shift();
            return obj;
        },
        recover: function (obj) {
            objectPool.push(obj);
            // console.log(objectPool)
        }
    }
};

var iframeFactory = objectPoolFactory( function(){
    var iframe = document.createElement( 'iframe' );
    document.body.appendChild( iframe );
    iframe.onload = function(){
        iframe.onload = null; // 防止iframe 重复加载的bug
        // debugger
        // console.log("onload success")
        iframeFactory.recover( iframe ); // iframe 加载完成之后回收节点
    }
    return iframe;
});

debugger
var iframe1 = iframeFactory.create();
iframe1.src = 'http://www.baidu.com';
debugger
var iframe2 = iframeFactory.create();
iframe2.src = 'http://www.QQ.com';
setTimeout(function(){
    var iframe3 = iframeFactory.create();
    iframe3.src = 'http://www.163.com';
}, 5000 );