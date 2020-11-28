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
