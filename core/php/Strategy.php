<?php
class Strategy{
  static function onInit(){
    return true;
  }
  static function onTick($e){
    return true;
  }
  static function onTimer(){
    return true;
  }
  static function getDefaultInputs(){
    return array();
  }
}
?>
