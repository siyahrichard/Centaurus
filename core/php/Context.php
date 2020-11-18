<?php
class Context{
  static $activeObject=null;
  __construct($strategy,$symbols,$inputs,$memo){
    $this->strategy=$strategy; $this->symbols=$symbols; $this->inputs=$inputs; $this->memo=$memo;
  }
  activate(){ Context::$activeObject=$this; }
}
?>
