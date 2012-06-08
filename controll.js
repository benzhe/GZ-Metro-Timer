//初始属性：每个站点平均时间，每个中转额外消耗时间，高峰时段额外增加的时间
var StAvg = 3;
var HubAvg = 2;
var PkStAdd = 0.3;
var PkHubAdd = 2;

//用于储存线路结果，单条结果格式：{paths:所有经过的站点列表, lines:[中转站、之前的线路名、之后的线路名], stTime:经过所有站点占用时间，AllTime：线路占用时间（包括中转所耗时间）}
var Paths = [];       
var Peak = false;     //高峰期开关

//定义单个站点的类属性
var Station = function(st){
  this.update(st);
  this.forwardSts = function(fromSt){
    var sts = this.nextSts.slice();
    var key = sts.indexOf(fromSt);
    if(key>=0) 
      sts.splice(key,1);
    return sts;
  },
  this.sameLine = function(otherSt) {
    var a = this.lines;
    var b = Stations.getSt(otherSt).lines;
    for(var i=0;i<a.length;i++){
      if(b.indexOf(a[i])>=0) {
        return a[i];
        break;
      }
    }
    return false;
  }
}

//定义 Station 对象，用于存放所有站点信息
var Stations = {
  sts:[],
  //刷新站点列表
  refresh:function(){
    this.sts = [];
    Lines.refresh();
    Lines.lns.forEach(function(lineName){
      var sts = Lines[lineName].sts;
      for(var key=0;key<sts.length;++key){
        if (sts[key][0] in this) {
          if(!un(sts[key-1])) {
            this[sts[key][0]].nextSts.push(sts[key-1][0]);
            this[sts[key][0]].nextStsTime[sts[key-1][0]] = sts[key][2];
          }          
          if(!un(sts[key+1])) {
            this[sts[key][0]].nextSts.push(sts[key+1][0]);
            this[sts[key][0]].nextStsTime[sts[key+1][0]] = sts[key+1][2];
          }
          this[sts[key][0]].lines.push(lineName);
        }
        else {
          this.sts.push(sts[key][0]);
          this[sts[key][0]] = new Station({
            name:sts[key][0],
            nextSts:(function(){
              var nexts=[];
              if(!un(sts[key-1])) nexts.push(sts[key-1][0]);
              if(!un(sts[key+1])) nexts.push(sts[key+1][0]);
              return nexts;
            })(),
            nextStsTime:(function(){
              var times = {};
              if(!un(sts[key-1])) times[sts[key-1][0]] = sts[key][2];
              if(!un(sts[key+1])) times[sts[key+1][0]] = sts[key+1][2];
              return times;
            })(),
            lines:[lineName]
          });        
        }      
      }
    },this); // 使用 this 即 Station 作为子循环的指针
  },
  getSt:function(stName){
    return this[stName];
  }
}

// 定义线路对象
var Lines = {
  lns:[],
  refresh:function(){
    this.lns = [];
    for(var i in this) {
      //判断是否是线路对象，此方法很 ugly
      if (this[i].constructor == Object && !un(this[i].sts) && this[i].sts.length && !un((this[i].sts)[0][0])) {
        this.lns.push(i);       //推入线路名数组
        this[i].stsList = [];       //生成站点列表
        this[i].sts.forEach(function(st){
          this.stsList.push(st[0]);
        },this[i]);
      }
    }    
  },
  getLine:function(lineName){
    return Lines[lineName];
  },
  //获取终点站，一般用作显示方向
  getTermial:function(lineName, startSt, endSt){
    var line = this.getLine(lineName);
    if(un(line.stsList)) return 0;
    if(startSt == endSt) return 0;
    if(line.stsList.indexOf(startSt) - line.stsList.indexOf(endSt) > 0) return (line.stsList.slice(0,1))[0];
    else return (line.stsList.slice(-1))[0];
  }
};


function findPath(nowSt, startSt, endSt, exSt, lines, exPath, exTime){
  //if(startSt == endSt) {console.log('Find!',exPath);};
  var nowst = Stations.getSt(nowSt);
  //var endst = Stations.getSt(endSt);
  var exPath = un(exPath)?[]:exPath;
  exPath.push(nowSt);
  var exTime = un(exTime)?0:exTime;
  if(!un(exSt)) {
    exTime = exTime + StAvg + nowst.nextStsTime[exSt];
  }

  if(nowSt == endSt) {
    if(Peak) exTime += (exPath.length - 1) * PkStAdd;
    var allTime = exTime + (lines.length) * HubAvg;
    if(Peak) allTime += (lines.length) * PkHubAdd
    Paths.push({
      paths:exPath, 
      endSt:nowSt, 
      stTime:exTime,
      allTime:allTime, 
      lines:lines
    });
    //console.warn(exPath, nowSt, exTime, allTime, lines);
  }

  var forwardSts = nowst.forwardSts(exSt);       
  //forwardSts.forEach(function(nextSt){        
  for(var i=0;i<forwardSts.length;++i){          
    var nextSt = forwardSts[i];
    var tempLines = un(lines)?[]:lines.slice();
    var tempPath = un(exPath)?[]:exPath.slice();
    if(!un(exSt)){
      var exLine = nowst.sameLine(exSt);
      var nowLine = nowst.sameLine(nextSt);
      if(exLine != nowLine) {
        tempLines.push([nowSt,exLine,nowLine]);
      }            
    }         
    if(exPath.indexOf(nextSt)<0){ 
      findPath(nextSt, startSt, endSt, nowSt, tempLines, tempPath, exTime);
    }
    else {
      //console.error(exPath, nextSt);
    }                  
  }

}


