// base
var RefreshMenuBarCommand = function( receiver ){
    return {
        execute: function(){
            receiver.refresh();
        }
    }
};
var MenuBar = {
    refresh: function(){
      console.log( "刷新菜单界面" );
    }
};
var setCommand = function( button, command ){
    button.onclick = function(){
        command.execute();
    }
};
const button1 = document.getElementById("button1")
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);

// 小球

var ball = document.getElementById( 'ball' );
var pos = document.getElementById( 'pos' );
var moveBtn = document.getElementById( 'moveBtn' );

var MoveCommand = function( receiver, pos ){
    this.receiver = receiver;
    this.pos = pos;
    this.oldPos = null; //记录
};
MoveCommand.prototype.execute = function () {
    this.receiver.start( 'left', this.pos, 1000, 'strongEaseOut' );
    // 每次执行 都对小球原来位置做了记录
    // 存储在 oldPos
    this.oldPos = this.receiver.dom.getBoundingClientRect()[this.receiver.propertyName];
};
// 悔棋、ctrl + z 回退功能 （借鉴）
MoveCommand.prototype.undo = function(){
    this.receiver.start( 'left', this.oldPos, 1000, 'strongEaseOut' );
// 回到小球移动前记录的位置
};
// var moveCommand;
moveBtn.onclick = function(){
    var animate = new Animate( ball );
    moveCommand = new MoveCommand( animate, pos.value );
    moveCommand.execute();
};
cancelBtn.onclick = function(){
    moveCommand.undo(); // 撤销命令
};


// 录像功能
var Ryu = {
    attack: function(){
        console.log( '攻击' );
    },
    defense: function(){
        console.log( '防御' );
    },
    jump: function(){
        console.log( '跳跃' );
    },
    crouch: function(){
        console.log( '蹲下' );
    }
};
var makeCommand = function( receiver, state ){ // 创建命令
    // 返回一个方法
    // 将要执行的命令进行调用
    return function () {
        receiver[ state ]();
    }
};
var commands = {
    "119": "jump", // W
    "115": "crouch", // S
    "97": "defense", // A
    "100": "attack" // D
};
var commandStack = []; // 保存命令的堆栈
document.onkeypress = function( ev ){
    var keyCode = ev.keyCode,
    command = makeCommand( Ryu, commands[ keyCode ] );
    if ( command ){
        command(); // 执行命令
        // 进行存储
        commandStack.push( command ); // 将刚刚执行过的命令保存进堆栈
    }
};
document.getElementById( 'replay' ).onclick = function(){ // 点击播放录像
    var command;
    while( command = commandStack.shift() ){ // 从堆栈里依次取出命令并执行
        command();
    }
};

// 宏命令
var closeDoorCommand = {
    execute: function(){
        console.log( '关门' );
    }
};
var openPcCommand = {
    execute: function(){
        console.log( '开电脑' );
    }
};

var openQQCommand = {
    execute: function(){
        console.log( '登录QQ' );
    }
};

var MacroCommand = function(){
    return {
        commandsList: [],
        add: function( command ){
            this.commandsList.push( command );
        },
        execute: function(){
            for ( var i = 0, command; command = this.commandsList[ i++ ]; ){
                command.execute();
            }
        }
    }
};
var macroCommand = MacroCommand();
macroCommand.add( closeDoorCommand );
macroCommand.add( openPcCommand );
macroCommand.add( openQQCommand );
macroCommand.execute();