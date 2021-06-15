// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';
import BlocklyPY from "blockly/python";

// Pin define
Blockly.Blocks.pins || (Blockly.Blocks.pins = {});
Blockly.Blocks.pins.digital = "0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 22".split(" ").map(function (a) {
  return [a, "GP" + a]
});
Blockly.Blocks.pins.digital.push(["25 (LED)", "GP25"]);

Blockly.Blocks.pins.analog = [["A0", "GP26"], ["A1", "GP27"], ["A2", "GP28"]];

// Blockly.Blocks['chip_start'] = {
//   init: function() {
//     this.appendDummyInput()
//         .appendField("START");
//     this.setNextStatement(true, null);
//     this.setColour(120);
//  this.setTooltip("");
//  this.setHelpUrl("");
//   }
// };

// start
Blockly.Blocks.on_start = {
  init: function () {
    this.appendDummyInput().appendField("start");
    this.setPreviousStatement(!1, null);
    this.setNextStatement(!0, null);
    this.setStyle("chip_blocks");
    this.setTooltip("");
    this.setHelpUrl("")
  }
};

BlocklyPY.on_start = function (a) {
  !a;
  return ""
};

// wait 
Blockly.Blocks.wait = {
  init: function () {
    this.appendValueInput("time").setCheck("Number").appendField("wait");
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField("seconds");
    this.setPreviousStatement(!0, null);
    this.setNextStatement(!0, null);
    this.setInputsInline(!0);
    this.setStyle("chip_blocks");
    this.setTooltip("");
    this.setHelpUrl("")
  }
};

BlocklyPY.wait = function (a) {
  a.disabled || (BlocklyPY.definitions_.import_time = "import time");
  return "time.sleep(" + BlocklyPY.valueToCode(a, "time", BlocklyPY.ORDER_ATOMIC) + ")\n"
}

// on-off
Blockly.Blocks.pin_on_off = {
  init: function () {
    this.appendDummyInput().appendField("turn pin").appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.digital), "GPIO").appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "NAME");
    this.setPreviousStatement(!0, null);
    this.setNextStatement(!0, null);
    this.setStyle("chip_blocks");
    this.setTooltip("");
    this.setHelpUrl("")
  }
};

BlocklyPY.pin_on_off = function (a) {
  var b = a.getFieldValue("GPIO");
  var c = a.getFieldValue("NAME");
  a.disabled || (BlocklyPY.definitions_.import_board = "import board",
    BlocklyPY.definitions_["digital_pin_" + b] = b + " = piperPin(board." + b + ', "' + b + '")',
    BlocklyPY.definitions_.import_piper_blockly = "from piper_blockly import *");
  return b + ".setPin(" + c + ")\n"
};

// read pin
Blockly.Blocks.pin_check = {
  init: function () {
    this.appendDummyInput().appendField("is pin").appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.digital), "GPIO").appendField(new Blockly.FieldDropdown([["LOW when pulled UP", "0,UP"], ["HIGH when pulled UP", "1,UP"], ["LOW", "0,FLOAT"], ["HIGH", "1,FLOAT"], ["LOW when pulled DOWN", "0,DOWN"], ["HIGH when pulled DOWN", "1,DOWN"]]), "CHECKFOR");
    this.setInputsInline(!0);
    this.setOutput(!0, "Boolean");
    this.setStyle("chip_blocks");
    this.setTooltip("");
    this.setHelpUrl("")
  }
};

BlocklyPY.pin_check = function (a) {
  var b = a.getFieldValue("GPIO");
  var c = a.getFieldValue("CHECKFOR").split(",");
  a.disabled || (BlocklyPY.definitions_.import_board = "import board",
    BlocklyPY.definitions_.import_digitalio_pull = "from digitalio import Pull",
    BlocklyPY.definitions_["digital_pin_" + b] = b + " = piperPin(board." + b + ', "' + b + '")',
    BlocklyPY.definitions_.import_piper_blockly = "from piper_blockly import *");
  return [("0" === c[0] ? "not " : "") + b + ".checkPin(" + ("FLOAT" === c[1] ? "None" : "Pull." + c[1]) + ")", BlocklyPY.ORDER_NONE]
};

// read analog pin
Blockly.Blocks.pin_analog_read = {
  init: function() {
      this.appendDummyInput().appendField("read voltage from pin").appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.analog), "GPIO");
      this.setInputsInline(!0);
      this.setOutput(!0, Blockly.Constants.NUMBER);
      this.setStyle("chip_blocks");
      this.setTooltip("");
      this.setHelpUrl("")
  }
};

Blockly.Python.pin_analog_read = function(a) {
  var b = a.getFieldValue("GPIO");
  a.disabled || (Blockly.Python.definitions_.import_board = "import board",
  Blockly.Python.definitions_["analog_pin_" + b] = "\n" + b + " = piperPin(board." + b + ', "' + b + '", "Analog")',
  Blockly.Python.definitions_.import_piper_blockly = "from piper_blockly import *",
  Blockly.Python.definitions_.import_digital_view = "try:\n" + Blockly.Python.INDENT + "set_digital_view(True)\nexcept:\n" + Blockly.Python.INDENT + "pass\n");
  return [b + ".readVoltage()", Blockly.Python.ORDER_ATOMIC]
};