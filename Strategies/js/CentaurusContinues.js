const {Strategy,InputParam}=require("../../core/js/model.js");
class CentaurusContinues extends Strategy{
  constructor(symbols,inputs,context){
    super(symbols,inputs,context)
    //this.symbols=symbols?symbols:[];
    this.inputs=inputs?inputs:CentaurusContinues.getDefaultInputs();
    //this.context=context;

    this.symbol=this.symbols[0];
  }
  onInit(){

    return true;
  }
  onTick(e){
    this.context.print(e);
    return true;
  }
  onTimer(){
    return true;
  }
  getName(){
    return "CentaurusContinues";
  }
  static getDefaultInputs(){
    return [
      new InputParam("Take Profit(%)","inp_tp",5,5.2,'int',1,1,30),
      new InputParam("Stop Loss(%)","inp_sl",5,5,'int',1,1,30)
    ];
  }
}
exports.strategy=CentaurusContinues;
