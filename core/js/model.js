class Candle{
  constructor(time,period,open,high,low,close,volume,symbol=null){
    this.time=time; this.open=open; this.high=high; this.low=low; this.close=close; this.volume=volume;
    this.symbol=symbol; this.period=period;
  }
  static get(index,period,symbol){
    return new Candle(0,period,0,0,0,0,0,symbol);
  }
}

class Context{
  static activeObject=null;
  constructor(strategy,symbols,inputs,memo){
    this.strategy=strategy; this.symbols=symbols; this.inputs; this.memo=memo;
  }
  activate(){ Context.activeObject=this; }
}

class ExchangeBase{
  static getSymbols(codes){}
  static getCandles(symbol,from=0,count=100){}
  static getTickers(symbols,callback=null){}
  static sendOrder(order){}
  static findOrder(params){}
  static closeOrder(order){}
  static getNamedPeriodOf(period){}
  static getNamedExecutionModeOf(execution){}
}

class FinanceEvent{
  constructor(symbol,tick,candle,prev_candle){
    this.symbol=symbol; this.tick=tick; this.candle=candle; this.prev_candle=prev_candle;
  }
}

class Indicator{
  constructor(){
    this.buffers=[];
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
  static onInit(){
    return true;
  }
  static onTick(e){
    return true;
  }
  static onTimer(){
    return true;
  }
  static getDefaultInputs(){
    return [];
  }
}

class StrategyInput{
  constructor(title,name,defaultValue,userValue,typeName='int',start=0,step=0,stop=0){
    this.title=title; this.name=name; this.defaultValue=defaultValue; this.typeName=typeName;
    this.start=start; this.step=step; this.stop=0; //for optimization
  }
}

class Symbol{
  constructor(code,base,quote,fee=0.002){
    this.code=code; this.base=base; this.quote=quote; this.fee=fee;
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

exports.Candle=Candle;
exports.Context=Context;
exports.ExchangeBase=ExchangeBase;
exports.FinanceEvent=FinanceEvent;
exports.Indicator=Indicator;
exports.Order=Order;
exports.Strategy=Strategy;
exports.StrategyInput=StrategyInput;
exports.Symbol=Symbol;
exports.Tester=Tester;
exports.Tick=Tick;
