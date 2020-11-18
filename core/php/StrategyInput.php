<?php
class StrategyInput{
  _construct($title,$name,$defaultValue,$userValue,$typeName='int',$start=0,$step=0,$stop=0){
    $this->title=$title; $this->name=$name; $this->defaultValue=$defaultValue; $this->typeName=$typeName;
    $this->start=$start; $this->step=$step; $this->stop=0; //for optimization
  }
}
?>
