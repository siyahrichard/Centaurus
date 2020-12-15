class Context{
  static activeObject=null;
  static globalTickerTimer=0;
  static globalTickDelay=30000;
  static defaultHistoryMargin=3;
  constructor(exchange,inputs,memo){
    this.exchange=exchange;
    this.inputs; this.memo=memo;
    this.currentTickers=null;
    this.strategyShortcuts=[]; this.strategies={}; this.strategyInstances=[];
    this.historyMargin=Context.defaultHistoryMargin; //for loading new candles/indicator data margin ,....
    this.candleStore={};//[symbol][period][index]
    this.indicatorStore={};//[indicator uid]
    this.consoleCash="";
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
    index=Candle.shift(index,period);console.log("index: "+index);
    if(this.candleStore[symbol]){
      if(this.candleStore[symbol][period]){
        if(this.candleStore[symbol][period][index]){
          if(callback)callback(this.candleStore[symbol][period][index]);
          return this.candleStore[symbol][period][index]
        }
      }else { this.candleStore[symbol][period]={}; }
    }else{ this.candleStore[symbol]={}; this.candleStore[symbol][period]={}; }
    //retrieve from exchange
    var from= (index - this.historyMargin);
    this.exchange.getCandles(symbol,period,from,this.historyMargin*2,function(candles){
      for(var i=0;i<candles.length;i++){
        var candle_index=Math.floor(candles[i].time/period);console.log(candle_index);
        Context.activeObject.candleStore[candles[i].symbol][candles[i].period][candle_index]=candles[i];
        if(candle_index==index && callback)callback(candles[i]);
        //console.log(Context.activeObject.candleStore[candles[i].symbol][candles[i].period][candle_index]);
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
  sethistoryMargin(margin){
    this.historyMargin=margin?margin:Context.defaultHistoryMargin;
  }
  addIndicator(symbol,timeframe,indicator,inputs){
    var indi=new Indicator(symbol,timeframe,inputs);
    var uuid=indi.getUID();
    if(!this.indicatorStore[uuid]){
      // Adding The indicator to indicator storage of the context
      this.indicatorStore[uuid]=indi;
      //load candles
    }
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
  print(o,nl="\r\n"){
    if(typeof(o)=="object"){
      this.consoleCash+=JSON.stringify(o,null,4);
    }else{
      this.consoleCash+=o;
    }
    this.consoleCash+=nl;
    if(this.consoleCash.length>2048){
      this.consoleCash=this.consoleCash.substring(this.consoleCash.length - 2048);
    }
  }
  flushPrint(){
    console.log(this.consoleCash);
    this.consoleCash="";
  }
}
