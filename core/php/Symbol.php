<?php
class Symbol{
  __construct($code,$base,$quote,$fee=0.002){
    $this->code=$code; $this->base=$base; $this->quote=$quote; $this->fee=$fee;
  }
}
