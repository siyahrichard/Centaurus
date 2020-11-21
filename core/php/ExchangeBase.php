<?php
class ExchangeBase{
  static function getSymbols($codes,$callback=null){}
  static function getTickers($symbols,$callback=null){}
  static function getCandles($symbol,$period=3600,$from=0,$count=100,$callback=null){}
  static function sendOrder($order){}
  static function findOrder($params){}
  static function getNamedPeriodOf($period){}
  static function getNamedExecutionModeOf($execution){}
}
?>
