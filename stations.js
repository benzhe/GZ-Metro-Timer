/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

//初始属性：每个站点平均时间，每个中转消耗时间，高峰时期额外增加的时间
var StAvg = 3;
var HubAvg = 3;
var PkStAdd = 1;
var PkHubAdd = 2;

//站点的定义：名称、所属线路（数组）、中转站、额外时间
//所属线路 [线路，排序]
var station = function(name, lines, hub, terminal, ext_time){
  var o = {};
  var args = arguments;
  var i = 0;
  station.argumentNames().forEach(function(val){
    o[val] =args[i];i++; 
  });
  return o;
  
};

// sts 用于储存站点名称数组，方便用于循环
var Stations = {
  sts:[],
  //刷新站点列表
  refresh:function(){
    this.sts = [];
    Lines.refresh();
    Lines.lns.forEach(function(lineName){
      var key = 0;
      Lines[lineName].sts.forEach(function(st){
        ++key;
        if(st[0] in this) 
          this[st[0]].lines.push([lineName, key]);
        else
          this[st[0]] = station(st[0], [[lineName, key]], st[1], st[2]);
        this.sts.push(st[0]);
      }, this);
    },this); // 使用 this 即 Station 作为子循环的指针；
  }
};
  //station("广州东站", [[1,9]], 0, 0, 0),

var Hubs = {
  //hubs:[],
  distant:function(hub,st){},
  refresh:function(){
    //this.hubs = [];
    Lines.refresh();
    Lines.lns.forEach(function(lineName){
      var key = 0;
      Lines[lineName].sts.forEach(function(st){
        if(st[1]) {
          ++key;
          if(st[0] in this)
            this[st[0]].push([lineName,key]);
          else
            this[st[0]] = [[lineName,key]];
        }
      },this);
    },this)
  }
}

var Lines = {
  lns:[],
  //刷新路线，填入线路，建立单条路线对象，测试性质
  refresh:function(){
    this.lns = [];
    for(var i in this) {
      if (this[i].constructor == Object && !un(this[i].sts) && this[i].sts.length && !un((this[i].sts)[0][0])) {
        this.lns.push(i);       //推入线路名数组；
        this[i] = new Line(this[i].sts);      //重建线路对象
      }
    }    
  } 
};

var Line = function(sts){
  //根据提供站点判断前后是否有中转站，返回中转站列表
  this.sts = sts;
  this.hasHub = function(st){}
  
  //是否有此站点，返回：0:无，1:有
  this.hasStation = function(st){
    this.sts.forEach(function(s){
      if(s == st){return true;}
    }, this);
    return false;
  }
}