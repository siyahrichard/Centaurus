<?php
class FinanceEvent{
  __construct($symbol,$tick,$candle,$prev_candle){
    $this->symbol=$symbol; $this->tick=$tick; $this->candle=$candle; $this->prev_candle=$prev_candle;
  }
}
?>
