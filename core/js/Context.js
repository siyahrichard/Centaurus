class Context{
  static activeObject=null;
  constructor(strategy,symbols,inputs,memo){
    this.strategy=strategy; this.symbols=symbols; this.inputs; this.memo=memo;
  }
  activate(){ Context.activeObject=this; }
}
