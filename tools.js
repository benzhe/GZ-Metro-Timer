/*
 * 自己的 javascript 工具包
 *
*/

//检测变量是否存在
function un(o) {
	if(typeof(o) == 'undefined') return true;
	else return false;
}

//检测变量是否存在且值不为空，存在即返回原变量，不存在即返回空字符串
function em(o) {
	if(typeof(o) == 'undefined' || !o) return '';
	else return o;
}

//查询 localStorage ，s 可为正则表达式，返回数组 key/value
function ls_getitems(s, v) {
	var list = [];
	for(var i in localStorage) {
		if(i.match(s)) {
			if(v) list.push(localStorage[i]);
			else list.push(i);
		}
	}
	return list;
}

// 清空 localStorage
function ls_clear(){
  for(var i in localStorage) {
    delete(localStorage[i]);
  }
}

//为字符串提供 trim 方法；
if(!String.prototype.trim) String.prototype.trim = function(){return this.replace(/(^\s+)|(\s+$)/ig, '');}

//数组最大值最小值扩展
Array.prototype.max = function() {
    return Math.max.apply({}, this);
};
 
Array.prototype.min = function() {
    return Math.min.apply({}, this);
};

//根据字段排序数组
Array.prototype.sortBy = function(col){
  this.sort(function(a, b){
    if(un(b[col])) b[col] = 0;
    if(un(a[col])) a[col] = 0; 
    return a[col] - b[col];
  });
}

//为 Javascript1.5 和以下提供数组 forEach 方法
if (!Array.prototype.forEach){
  Array.prototype.forEach = function(fun /*, thisp*/)  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError(); 
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

//提供数组 indexOf 方法
if (!Array.prototype.indexOf){
  Array.prototype.indexOf = function(elt /*, from*/)  {
    var len = this.length;
    var from = Number(arguments[1]) || 0;
    from = (from < 0)
    ? Math.ceil(from)
    : Math.floor(from);
    if (from < 0)
      from += len;
    for (; from < len; from++) {
      if (from in this &&
        this[from] === elt)
        return from;
    }
    return -1;
  };
}


//实例化 Object, old: 类型对象，obj: 实体参数对象
function object(old,obj) {
  function AgentObject(){}
  AgentObject.prototype = old;
  return (new AgentObject(obj)).update(obj);
}

//根据参数对象更新旧对象
Object.prototype.update = function(obj) {
  for(var key in obj) {
    this[key] = obj[key];
  }
  return this;
}

//克隆对象
Object.prototype.clone = function(){
    function clonePrototype(){}
    clonePrototype.prototype = this;
    var obj = new clonePrototype();
    for(var ele in obj){
       if(typeof(obj[ele])=="object") obj[ele] = obj[ele].cloneAll();
    }
    return obj;
}


//Function
//返回 function 的参数
Function.prototype.argumentNames = function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
      .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
      .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
  }


/*
 * for jQuery
 *
*/
//生成 jQuery 对象，s: 标签，html: innerHTML
function j_createEl(s,html) {
	return $('<'+s+'>'+(!un(html)?html:'')+'</'+s+'>');
}
