class Strategy{
  constructor(symbols){
    this.symbols=symbols?symbols:[];
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
