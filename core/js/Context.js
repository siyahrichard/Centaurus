class Context{
  static activeObject=null;
  static candleStore={};
  constructor(exchange,strategy,symbols,inputs,memo){
    this.exchange=exchange;
    this.strategy=strategy; this.symbols=symbols; this.inputs; this.memo=memo;
  }
  activate(){ Context.activeObject=this; }
}
