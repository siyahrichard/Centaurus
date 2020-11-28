class Context{
  static activeObject=null;
  static candleStore={};//[symbol][period][index]
  static indicatorStore={};//[symbol][period][indicator uid]
  static globalTickerTimer=0;
  constructor(exchange,strategies,inputs,memo){
    this.exchange=exchange;
    this.strategies=strategies instanceof Array?strategies:[]; this.inputs; this.memo=memo;
    initStrategies(); this.currentTickers=null;
  }
  initStrategies(){
    this.symbols=[];
    for(var i=0;i<this.strategies.length;i++){
      for(var j=0;j<this.strategies[i].symbols.length;j++){
        if(this.symbols.indexOf(this.strategies[i].symbols[j])<0){
          this.symbols.push(this.strategies[i].symbols[j]);
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
      for(var i=0;i<context.strategies.length;i++){
        e=null;
        if(context.strategies[i].symbols.length==1){
          var tick=ticks[context.strategies[i].symbols[0]];
          e=new FinanceEvent(context.strategies[i].symbols[0],tick,null,null);
        }
        context.strategies[i].onTick(e);
      }
    });
    removeTimeout(Context.globalTickerTimer);
    Context.globalTickerTimer=setTimeout(Context.onGlobalTick,CoteContext.globalTickDelay)
  }
  setCandleRequestBound(bound=5){
    this.candleRequestBound=bound;
  }
  addIndicator(symbol,period,indicator,inputs){
    
  }
  activate(){ Context.activeObject=this; }
}
