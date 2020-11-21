class Symbol{
  constructor(code,base,quote,minBase,minQuote,baseStep,quoteStep,feeCurrency,fee=0.002){
    this.code=code; this.base=base; this.quote=quote; this.fee=fee;
    this.minBase=minBase; this.minQuote=minQuote; this.baseStep=baseStep; this.quoteStep=quoteStep;
  }
}
