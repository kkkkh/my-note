var Event = (function () {
    debugger
    var global = this,
    Event,
    _default = 'default';
    Event = function () {
        // 实际为抽离出来的公共方法
        var _listen,
        _trigger,
        _remove,
        _slice = Array.prototype.slice,
        _shift = Array.prototype.shift,
        _unshift = Array.prototype.unshift,
        namespaceCache = {},
        _create,
        find,
            each = function (ary, fn) {
            // 遍历对应缓存
            // 和 遍历对应离线储存fn
            var ret;
            for ( var i = 0, l = ary.length; i < l; i++ ){
                var n = ary[i];
                // 
                ret = fn.call( n, i, n);
            }
            return ret;
        };
        _listen = function (key, fn, cache) {
            // 订阅事件方法
            if ( !cache[ key ] ){
                cache[ key ] = [];
            }
            cache[key].push( fn );
        };
        _remove = function( key, cache ,fn){
            if ( cache[ key ] ){
                if( fn ){
                    for( var i = cache[ key ].length; i >= 0; i-- ){
                        if( cache[ key ] === fn ){
                            cache[ key ].splice( i, 1 );
                        }
                    }
                }else{
                    cache[ key ] = [];
                }
            }
        };
        _trigger = function () {
            // 发布事件方法
            var cache = _shift.call(arguments),
            key = _shift.call(arguments),
            args = arguments,
            _self = this,
            ret,
            stack = cache[ key ];
            if ( !stack || !stack.length ){
                return;
            }
            return each(stack, function () {
                // this为 echo中
                // fn.call( n, i, n) 中的 n
                // 为订阅方法
                return this.apply( _self, args );
            });
        };
        _create = function (namespace) {
            // 关键所在 没创建一个命名空间 创建新的缓存cache
            var namespace = namespace || _default;
            var cache = {},
            offlineStack = [], // 离线事件
            ret = {
                listen: function( key, fn, last ){
                    _listen( key, fn, cache );
                    if ( offlineStack === null ){
                        return;
                    }
                    if ( last === 'last' ){
                    } else {
                        // 对离线进行处理
                        // 离线缓存可能存在多个
                        each(offlineStack, function () {
                            // this 为
                            // offlineStack中存储的fn
                            this();
                        });
                    }
                    // 先 listen  后 trigger 
                    // offlineStack 离线缓存置空
                    offlineStack = null;
                },
                one: function( key, fn, last ){
                    _remove( key, cache );
                    this.listen( key, fn ,last );
                },
                remove: function( key, fn ){
                    _remove( key, cache ,fn);
                },
                trigger: function(){
                    var fn,
                    args,
                    _self = this;
                    _unshift.call( arguments, cache );
                    // arguments  为 缓存 + key、参数
                    // 进行了保存
                    // 可以直接调用也可以在离线中调用
                    args = arguments;
                    // 可以保存 或 直接调取
                    fn = function () {
                        // 调取 _trigger
                        return _trigger.apply( _self, args );
                    };
                    if (offlineStack) {
                        // 先 trigger 后 listen 
                        // offlineStack 要将trigger放入到离线缓存
                        return offlineStack.push( fn );
                    }
                    // 后 trigger 直接调用fn
                    return fn();
                }
            };
            return namespace ?
            ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                namespaceCache[ namespace ] = ret )
            : ret;
        };
        return {
            create: _create,
            one: function( key,fn, last ){
                var event = this.create( );
                event.one( key,fn,last );
            },
            remove: function( key,fn ){
                var event = this.create( );
                event.remove( key,fn );
            },
            listen: function (key, fn, last) {
                // 直接调取 listen 走create中namespace默认default
                var event = this.create( );
                event.listen( key, fn, last );
            },
            trigger: function(){
                // 直接调取 trigger 走create中namespace默认default
                var event = this.create( );
                event.trigger.apply( this, arguments );
            }
        };
    }();
    return Event;
})();
// debugger
/************** 先发布后订阅 ********************/
Event.trigger( 'click', 1 );
Event.listen( 'click', function( a ){
    console.log( a );       // 输出：1
});

/************** 使用命名空间 ********************/

Event.create( 'namespace1' ).listen( 'click', function( a ){
    console.log( a );    // 输出：1
});

Event.create( 'namespace1' ).trigger( 'click', 1 );

Event.create( 'namespace2' ).listen( 'click', function( a ){
    console.log( a );     // 输出：2
});
Event.create( 'namespace2' ).trigger( 'click', 2 );
