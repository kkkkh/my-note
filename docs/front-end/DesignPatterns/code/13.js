// 状态模式 - 电灯开关
var OffLightState = function (light) {
    this.light = light;
};

OffLightState.prototype.buttonWasPressed = function(){
    console.log( '弱光' ); // offLightState 对应的行为
    this.light.setState( this.light.weakLightState ); // 切换状态到weakLightState
};
// WeakLightState：
var WeakLightState = function( light ){
    this.light = light;
};

WeakLightState.prototype.buttonWasPressed = function(){
    console.log( '强光' ); // weakLightState 对应的行为
    this.light.setState( this.light.strongLightState ); // 切换状态到strongLightState
};
// StrongLightState：
var StrongLightState = function( light ){
    this.light = light;
};

StrongLightState.prototype.buttonWasPressed = function(){
    console.log( '关灯' ); // strongLightState 对应的行为
    this.light.setState( this.light.offLightState ); // 切换状态到offLightState
};

var Light = function(){
    this.offLightState = new OffLightState( this );
    this.weakLightState = new WeakLightState( this );
    this.strongLightState = new StrongLightState( this );
    this.button = null;
};


Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
    self = this;
    this.button = document.body.appendChild( button );
    this.button.innerHTML = '开关';
    this.currState = this.offLightState; // 设置当前状态
    this.button.onclick = function(){
        self.currState.buttonWasPressed();
    }	
};

Light.prototype.setState = function( newState ){
    this.currState = newState;
};

var light = new Light();
light.init();





// 状态模式 - 上传文件
window.external.upload = function( state ){
    console.log( state ); // 可能为sign、uploading、done、error
};
var plugin = (function(){
    var plugin = document.createElement( 'embed' );
    plugin.style.display = 'none';
    plugin.type = 'application/txftn-webkit';
    plugin.sign = function(){
        console.log( '开始文件扫描' );
    }
    plugin.pause = function(){
        console.log( '暂停文件上传' );
    };
    plugin.uploading = function(){
        console.log( '开始文件上传' );
    };
    plugin.del = function(){
        console.log( '删除文件上传' );
    }
    plugin.done = function(){
        console.log( '文件上传完成' );
    }
    document.body.appendChild( plugin );
    return plugin;
})();

var Upload = function( fileName ){
    this.plugin = plugin;
    this.fileName = fileName;
    this.button1 = null;
    this.button2 = null;
    this.signState = new SignState( this ); // 设置初始状态为waiting
    this.uploadingState = new UploadingState( this );

    this.pauseState = new PauseState( this );
    this.doneState = new DoneState( this );
    this.errorState = new ErrorState( this );
    this.currState = this.signState; // 设置当前状态
};


Upload.prototype.init = function(){
    var that = this;
    this.dom = document.createElement( 'div' );
    this.dom.innerHTML =
    '<span>文件名称:'+ this.fileName +'</span>\
    <button data-action="button1">扫描中</button>\
    <button data-action="button2">删除</button>';
    document.body.appendChild( this.dom );
    this.button1 = this.dom.querySelector( '[data-action="button1"]' );
    this.button2 = this.dom.querySelector( '[data-action="button2"]' );
    this.bindEvent();
};

Upload.prototype.bindEvent = function(){
    var self = this;
    this.button1.onclick = function(){
        self.currState.clickHandler1();
    }
    this.button2.onclick = function(){
        self.currState.clickHandler2();
    }
};

Upload.prototype.sign = function(){
    this.plugin.sign();
    this.currState = this.signState;
};
Upload.prototype.uploading = function(){
    this.button1.innerHTML = '正在上传，点击暂停';
    this.plugin.uploading();
    this.currState = this.uploadingState;
};
Upload.prototype.pause = function(){

    this.button1.innerHTML = '已暂停，点击继续上传';
    this.plugin.pause();
    this.currState = this.pauseState;
};
Upload.prototype.done = function(){
    this.button1.innerHTML = '上传完成';
    this.plugin.done();
    this.currState = this.doneState;
};
Upload.prototype.error = function(){
    this.button1.innerHTML = '上传失败';
    this.currState = this.errorState;
};
Upload.prototype.del = function(){
    this.plugin.del();
    this.dom.parentNode.removeChild( this.dom );
};

var StateFactory = (function(){
    var State = function(){};
    State.prototype.clickHandler1 = function(){
        throw new Error( '子类必须重写父类的clickHandler1 方法' );
    }
    State.prototype.clickHandler2 = function(){
        throw new Error( '子类必须重写父类的clickHandler2 方法' );
    }
    return function( param ){
        var F = function( uploadObj ){
            this.uploadObj = uploadObj;
        };
        F.prototype = new State();
        for ( var i in param ){
            F.prototype[ i ] = param[ i ];
        }
        return F;
    }
})();

var SignState = StateFactory({
    clickHandler1: function(){
        console.log( '扫描中，点击无效...' );
    },
    clickHandler2: function(){
        console.log( '文件正在上传中，不能删除' );
    }
});
var UploadingState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.pause();
    },
    clickHandler2: function(){
        console.log( '文件正在上传中，不能删除' );
    }
});
var PauseState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.uploading();
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
});
var DoneState = StateFactory({
    clickHandler1: function(){
        console.log( '文件已完成上传, 点击无效' );
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
});
var ErrorState = StateFactory({
    clickHandler1: function(){
        console.log( '文件上传失败, 点击无效' );
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
});

var uploadObj = new Upload( 'JavaScript 设计模式与开发实践' );
uploadObj.init();
window.external.upload = function( state ){
    uploadObj[ state ]();
};
window.external.upload( 'sign' );
setTimeout(function(){
        window.external.upload( 'uploading' ); // 1 秒后开始上传
    }, 1000 );
setTimeout(function(){
        window.external.upload( 'done' ); // 5 秒后上传完成
}, 5000);
    

// js 状态机
var Light = function(){
    this.currState = FSM.off; // 设置当前状态
    this.button = null;
};
Light.prototype.init = function(){
    var button = document.createElement( 'button' ),
    self = this;
    button.innerHTML = '已关灯';
    this.button = document.body.appendChild( button );
    this.button.onclick = function(){
        self.currState.buttonWasPressed.call( self ); // 把请求委托给FSM 状态机
    }
};
var FSM = {
    off: {
        buttonWasPressed: function(){
            console.log( '关灯' );
            this.button.innerHTML = '下一次按我是开灯';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed: function(){
            console.log( '开灯' );
            this.button.innerHTML = '下一次按我是关灯';
            this.currState = FSM.off;
        }
    }
};
var light = new Light();
light.init();

// js-状态机2
// var delegate = function( client, delegation ){
//     return {
//         buttonWasPressed: function(){ // 将客户的操作委托给delegation 对象
//             return delegation.buttonWasPressed.apply( client, arguments );
//         }
//     }
// };

// var FSM = {
//     off: {
//         buttonWasPressed: function(){
//             console.log( '关灯' );
//             this.button.innerHTML = '下一次按我是开灯';
//             this.currState = this.onState;
//         }
//     },
//     on: {
//         buttonWasPressed: function(){
//             console.log( '开灯' );
//             this.button.innerHTML = '下一次按我是关灯';
//             this.currState = this.offState;
//         }
//     }
// };

// var Light = function(){
//     this.offState = delegate( this, FSM.off );
//     this.onState = delegate( this, FSM.on );
//     this.currState = this.offState; // 设置初始状态为关闭状态
//     this.button = null;
// };

// Light.prototype.init = function(){
//     var button = document.createElement( 'button' ),
//     self = this;
//     button.innerHTML = '已关灯';
//     this.button = document.body.appendChild( button );
//     this.button.onclick = function(){
//         self.currState.buttonWasPressed();
//     }
// };
// var light = new Light();
// light.init();