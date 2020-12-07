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
