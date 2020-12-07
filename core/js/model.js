class SCF{
  constructor(){
    this.title="";
    this.channel=null;
    this.channelUpdateDelay=0;
    this.datasets=[];
    this.cursors=[];
    this.object=[];
  }
}

class SCFDataset{
  constructor(){
    this.data=[];
    this.type='line';
    this.theme=null;
  }
}

class Candle{
  constructor(time,period,open,high,low,close,volume,symbol=null){
    this.time=time; this.open=open; this.high=high; this.low=low; this.close=close; this.volume=volume;
    this.symbol=symbol; this.period=period;
  }
  static get(symbol,period,index){
    return Context.activeObject.getCandle(symbol,period,index);
  }
  static shift(value=0,period=3600){
    return Math.floor(Date.now()/1000/period) - value;
  }
}

class Context{
  static activeObject=null;
  static candleStore={};//[symbol][period][index]
  static indicatorStore={};//[symbol][period][indicator uid]
  static globalTickerTimer=0;
  static globalTickDelay=30000;
  constructor(exchange,inputs,memo){
    this.exchange=exchange;
    this.inputs; this.memo=memo;
    this.currentTickers=null;
    this.strategyShortcuts=[]; this.strategies={}; this.strategyInstances=[];
  }
  initStrategies(){
    this.symbols=[];
    for(var i=0;i<this.strategyInstances.length;i++){
      for(var j=0;j<this.strategyInstances[i].symbols.length;j++){
        if(this.symbols.indexOf(this.strategyInstances[i].symbols[j])<0){
          this.symbols.push(this.strategyInstances[i].symbols[j]);
        }
      }
    }
  }
  addStrategy(strategy){ this.strategies.push(strategy); this.initStrategies(); }
  getCandle(symbol,period,index,callback){
    if(this.candleStore[symbol]){
      if(this.candleStore[symbol][period]){
        if(this.candleStore[symbol][period][index]){
          if(callback)callback(this.candleStore[symbol][period][index]);
          return this.candleStore[symbol][period][index]
        }
      }else { this.candleStore[symbol][period]={}; }
    }else{ this.candleStore[symbol]={}; this.candleStore[symbol][period]={}; }
    //retrieve from exchange
    var from= (index - this.candleRequestBound);
    this.exchange.getCandles(symbol,period,from,this.bound*2,function(candles){
      for(var i=0;i<candles.length;i++){
        var candle_index=Math.floor(candles[i].time/period);
        this.candleStore[candles[i].symbol][candles[i].period][candle_index]=candles[i];
        if(candle_index==index && callback)callback(candles[i]);
      }
    });
  }
  static onGlobalTick(){
    var e=null; var context=Context.activeObject;
    context.exchange.getTicks(context.symbols,function(ticks){
      context.currentTickers=ticks;
      for(var i=0;i<context.strategyInstances.length;i++){
        e=null;
        if(context.strategyInstances[i].symbols.length==1){
          var tick=ticks[context.strategyInstances[i].symbols[0]];
          e=new FinanceEvent(context.strategyInstances[i].symbols[0],tick,null,null);
        }
        context.strategyInstances[i].onTick(e);
      }
    });
    clearTimeout(Context.globalTickerTimer);
    Context.globalTickerTimer=setTimeout(Context.onGlobalTick,Context.globalTickDelay)
  }
  setCandleRequestBound(bound=5){
    this.candleRequestBound=bound;
  }
  addIndicator(symbol,period,indicator,inputs){

  }
  activate(shortcuts){
    this.strategyShortcuts=shortcuts;
    for(var i=0;i<shortcuts.length;i++){
      if(!this.strategies[shortcuts[i].name]){
        this.strategies[shortcuts[i].name] = require("../../Strategies/js/"+shortcuts[i].name+".js");
      }
      var si=new this.strategies[shortcuts[i].name].strategy(shortcuts[i].symbols,shortcuts[i].inputs,this);
      this.strategyInstances.push(si);
    }
    Context.activeObject=this;
    this.initStrategies();
    Context.onGlobalTick();
  }
}

class ExchangeBase{
  static getSymbols(codes,callback){}
  static getTickers(symbols,callback=null){}
  static getCandles(symbol,period=3600,from=0,count=100,callback=null){}
  static sendOrder(order,callback=null){}
  static findOrder(params){}
  static closeOrder(order){}
  static getNamedPeriodOf(period){}
  static getNamedExecutionModeOf(execution){}
  static getTimeframeSeconds(tf_name){
    var tfs={
      'm1':60,
      'm5':300,
      'm10':600,
      'm15':900,
      'm30':1800,
      'h1':3600,
      'h4':14400,
      'h8':28800,
      'd1':86400,
      'w1':604800
    };
    return tfs[tf_name.toLowerCase()];
  }
}

class FinanceEvent{
  constructor(symbol,tick,candle,prev_candle){
    this.symbol=symbol; this.tick=tick; this.candle=candle; this.prev_candle=prev_candle;
  }
}

class Indicator{
  constructor(symbol,timeframe,inputs){
    this.buffers=[];
    this.inputs=inputs?inputs:Indicator.getDefaultInputs()
  }
  onCalculate(calculated,totals){}
  getUID(){return "_";}
  static getDefaultInputs(){
    return [];
  }
}

class Order{
  constructor(symbol,volume,price,type,clientId,ticket,id,executed_volume){
    this.symbol=symbol; this.price=price; this.type=type; this.volume=volume;
    this.openTime=0; this.closeTime; this.closePrice=0;
    this.tp=0; this.sl=0; this.mode=0; this.ticket=ticket;
    this.executed_volume=executed_volume; this.clientId=clientId; this.id=id;
  }
}

class Strategy{
  constructor(symbols,inputs,context){
    this.symbols=symbols?symbols:[];
    this.inputs=[];
    this.context=context;
  }
  onInit(){
    return true;
  }
  onTick(e){
    return true;
  }
  onTimer(){
    return true;
  }
  static getDefaultInputs(){
    return [];
  }
}

class InputParam{
  constructor(title,name,defaultValue,userValue,typeName='int',start=0,step=0,stop=0){
    this.title=title; this.name=name; this.defaultValue=defaultValue; this.typeName=typeName;
    this.start=start; this.step=step; this.stop=0; //for optimization
    this.value=userValue?userValue:this.defaultValue;
  }
  static getByName(arr,name){
    for(var i=0;i<arr.length;i++)
      if(arr[i].name==name)return arr[i];
    return null;
  }
}

class Symbol{
  constructor(code,base,quote,minBase,minQuote,baseStep,quoteStep,feeCurrency,fee=0.002){
    this.code=code; this.base=base; this.quote=quote; this.fee=fee;
    this.minBase=minBase; this.minQuote=minQuote; this.baseStep=baseStep; this.quoteStep=quoteStep;
  }
}

class Tester{
  static currentTick=null;
  static currentTime=0;
  static exchange=null;

  constructor(){}
}

class Tick{
  constructor(symbol,time,ask,bid,volume,change){
    this.symbol=symbol; this.time=time; this.ask=ask; this.bid=bid;
    this.volume=volume; this.change=change;
  }
}

const querystring=require('querystring');
const HTTP=require('http');
const HTTPS=require('https');
const FS=require('fs');
const URL=require('url');

function transmit(_url,request_type,data,callback){
  console.log("Requesting: "+_url);
  var url=URL.parse(_url);
  var protocol=url.protocol.toLowerCase()=="http:"?HTTP:HTTPS;
  if(data){
    data=querystring.stringify(data);
  }
  var options={
    host:url.host,
    port: url.protocol.toLowerCase()=='http:'?'80':'443',
    path: url.path,
    method: request_type
  };
  if(request_type.toUpperCase()=="POST" && data){
    options.headers={
      'Content-Type':'application/x-www-form-urlencoded',
      'Content-Length':Buffer.byteLength(data)
    };
  }
  var req=protocol.request(options,function(res){
    res.setEncoding('utf8');
    var result="";
    res.on('data',function(chunk){
      result+=chunk;
    });
    res.on('end',function(){
      if(callback)callback(result);
    });
    res.on('error',function(error){
      console.log(error);
      if(callback)callback(null);
    });
  });
  if(request_type.toUpperCase()=="POST" && data){
    req.write(data);
  }
  req.end();
};

exports.SCF=SCF;
exports.SCFDataset=SCFDataset;
exports.Candle=Candle;
exports.Context=Context;
exports.ExchangeBase=ExchangeBase;
exports.FinanceEvent=FinanceEvent;
exports.Indicator=Indicator;
exports.Order=Order;
exports.Strategy=Strategy;
exports.InputParam=InputParam;
exports.Symbol=Symbol;
exports.Tester=Tester;
exports.Tick=Tick;
exports.transmit=transmit;
