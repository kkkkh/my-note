// 1 改进为职责链
var order500 = function (orderType, pay, stock) {
    debugger
    if ( orderType === 1 && pay === true ){
        console.log( '500 元定金预购，得到100 优惠券' );
    }else{
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};

var order200 = function (orderType, pay, stock) {
    debugger
    if ( orderType === 2 && pay === true ){
        console.log( '200 元定金预购，得到50 优惠券' );
    }else{
        return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
    // 异步
    // console.log( 2 );
    // var self = this;
    // // console.log(this)
    // setTimeout(function () {
    //     // 根据异步结果来处理
    //     // next 表示走下一节点
    //     self.next();
    // }, 1000 );
};

var orderNormal = function (orderType, pay, stock) {
    debugger
    if ( stock > 0 ){
        console.log( '普通购买，无优惠券' );
    }else{
        console.log( '手机库存不足' );
    }
};

// Chain.prototype.setNextSuccessor 指定在链中的下一个节点
// Chain.prototype.passRequest 传递请求给某个节点
var Chain = function( fn ){
    this.fn = fn;
    this.successor = null;
};

Chain.prototype.setNextSuccessor = function( successor ){
    return this.successor = successor;
};

Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this, arguments);
    // 同步 通过ret返回进行判断
    if ( ret === 'nextSuccessor' ){
        return this.successor && this.successor.passRequest.apply( this.successor, arguments );
    }
    return ret;
};
Chain.prototype.next = function () {
    // debugger
    return this.successor && this.successor.passRequest.apply( this.successor, arguments );
};

// var chainOrder500 = new Chain( order500 );
// var chainOrder200 = new Chain( order200 );
// var chainOrderNormal = new Chain( orderNormal );

// chainOrder500.setNextSuccessor( chainOrder200 );
// chainOrder200.setNextSuccessor( chainOrderNormal );
// chainOrder500.passRequest( 1, true, 500 ); // 输出：500 元定金预购，得到100 优惠券
// chainOrder500.passRequest( 2, true, 500 ); // 输出：200 元定金预购，得到50 优惠券
// chainOrder500.passRequest( 3, true, 500 ); // 输出：普通购买，无优惠券
// chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足


// AOP 
// 面向切片编程
// 一种更加方便的方法来创建职责链
Function.prototype.after = function( fn ){
    var self = this;
    debugger
    return function(){
        debugger
        var ret = self.apply( this, arguments );
        if ( ret === 'nextSuccessor' ){
            return fn.apply( this, arguments );
        }
        return ret;
    }
};
debugger
var order = order500.after(order200).after(orderNormal);
debugger
order( 1, true, 500 ); // 输出：500 元定金预购，得到100 优惠券
debugger
order( 2, true, 500 ); // 输出：200 元定金预购，得到50 优惠券
debugger
order( 1, false, 500 ); // 输出：普通购买，无优惠券