// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks


import * as Blockly from 'blockly/core';
import BlocklyPY from "blockly/python";


// 临时用来处理中文显示
var language = "zh";
var local_str_table = {
  "en": {
    "START": "start",
    "WAIT": "wait",
    "SECONDS": "seconds",
    "TURN_PIN": "turn pin",
    "AS": "as",
    "WEATHER_AS": "as",
    "ON": "on",
    "OFF": "off",
    "IS_PIN": "is pin",
    "LOW_WHEN_PULLED_UP": "LOW when pulled UP",
    "HIGH_WHEN_PULLED_UP": "HIGH when pulled UP",
    "LOW": "LOW",
    "HIGH": "HIGH",
    "LOW_WHEN_PULLED_DOWN": "LOW when pulled DOWN",
    "HIGH_WHEN_PULLED_DOWN": "HIGH when pulled DOWN",
    "READ_VOLTAGE_FROM_PIN": "read voltage from pin",
  },

  "zh": {
    "START": "开始",
    "WAIT": "等待",
    "SECONDS": "秒",
    "TURN_PIN": "设置管脚",
    "AS": "为",
    "WEATHER_AS": "是否为",
    "ON": "高",
    "OFF": "低",
    "IS_PIN": "判断管脚",
    "LOW_WHEN_PULLED_UP": "低(上拉)",
    "HIGH_WHEN_PULLED_UP": "高(上拉)",
    "LOW": "低",
    "HIGH": "高",
    "LOW_WHEN_PULLED_DOWN": "低(下拉)",
    "HIGH_WHEN_PULLED_DOWN": "高(下拉)",
    "READ_VOLTAGE_FROM_PIN": "读取电压",
  }
};


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
    this.appendDummyInput().appendField(local_str_table[language]["START"]);
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
    this.appendValueInput("time").setCheck("Number").appendField(local_str_table[language]["WAIT"]);
    this.appendDummyInput().setAlign(Blockly.ALIGN_RIGHT).appendField(local_str_table[language]["SECONDS"]);
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
    this.appendDummyInput()
        .appendField(local_str_table[language]["TURN_PIN"])
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.digital), "GPIO")
        .appendField(local_str_table[language]["AS"])
        .appendField(new Blockly.FieldDropdown([[local_str_table[language]["ON"], "1"], [local_str_table[language]["OFF"], "0"]]), "NAME");
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
    this.appendDummyInput()
        .appendField(local_str_table[language]["IS_PIN"])
        .appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.digital), "GPIO")
        .appendField(local_str_table[language]["WEATHER_AS"])
        .appendField(new Blockly.FieldDropdown([[local_str_table[language]["LOW_WHEN_PULLED_UP"], "0,UP"], 
                                                [local_str_table[language]["HIGH_WHEN_PULLED_UP"], "1,UP"], 
                                                [local_str_table[language]["LOW"], "0,FLOAT"], 
                                                [local_str_table[language]["HIGH"], "1,FLOAT"], 
                                                [local_str_table[language]["LOW_WHEN_PULLED_DOWN"], "0,DOWN"], 
                                                [local_str_table[language]["HIGH_WHEN_PULLED_DOWN"], "1,DOWN"]]), "CHECKFOR");
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
  init: function () {
    this.appendDummyInput().appendField(local_str_table[language]["READ_VOLTAGE_FROM_PIN"]).appendField(new Blockly.FieldDropdown(Blockly.Blocks.pins.analog), "GPIO");
    this.setInputsInline(!0);
    this.setOutput(!0, Blockly.Constants.NUMBER);
    this.setStyle("chip_blocks");
    this.setTooltip("");
    this.setHelpUrl("")
  }
};

Blockly.Python.pin_analog_read = function (a) {
  var b = a.getFieldValue("GPIO");
  a.disabled || (Blockly.Python.definitions_.import_board = "import board",
    Blockly.Python.definitions_["analog_pin_" + b] = "\n" + b + " = piperPin(board." + b + ', "' + b + '", "Analog")',
    Blockly.Python.definitions_.import_piper_blockly = "from piper_blockly import *",
    Blockly.Python.definitions_.import_digital_view = "try:\n" + Blockly.Python.INDENT + "set_digital_view(True)\nexcept:\n" + Blockly.Python.INDENT + "pass\n");
  return [b + ".readVoltage()", Blockly.Python.ORDER_ATOMIC]
};