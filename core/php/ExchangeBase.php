<?php
class ExchangeBase{
  static function getSymbols($codes){}
  static function getCandles($symbol,$from=0,$count=100){}
  static function getTickers(){$symbols}
  static function sendOrder($order){}
  static function findOrder($params){}
  static function getNamedPeriodOf($period){}
  static function getNamedExecutionModeOf($execution){}
}
?>
