Function.prototype.before = function( beforefn ){
    var __self = this;
    return function(){
        beforefn.apply( this, arguments );
        return __self.apply( this, arguments );
    }
}

Function.prototype.after = function( afterfn ){
	var __self = this;
	return function(){
		var ret = __self.apply( this, arguments );
		afterfn.apply( this, arguments );
		return ret;
	}
}

document.getElementById = document.getElementById.before(function(){
    alert (1);
});
var button = document.getElementById( 'button' );

console.log( button );

window.onload = function(){
    alert (1);
}
window.onload = ( window.onload || function(){} ).after(function(){
    alert (2);
}).after(function(){
    alert (3);
}).after(function(){
    alert (4);
});