<template>
  <div>
    <div class="blocklyDiv" ref="blocklyDiv"></div>
    <!-- Toolbox Definition -->
    <xml id="toolbox-categories" style="display: none">
      <!-- <toolboxlabel name="Custom Toolbox" colour="darkslategrey"></toolboxlabel> -->
      <category
        css-icon="customIcon fa fa-microchip"
        name="芯片"
        categorystyle="chip_category"
      >
        <block type="on_start"></block>
        <block type="wait"></block>
        <block type="pin_on_off"></block>
        <block type="pin_check"></block>
        <block type="pin_analog_read"></block>
      </category>

      <category
        css-icon="customIcon fa fa-random"
        name="逻辑"
        categorystyle="logic_category"
      >
        <block type="controls_if"></block>
        <block type="controls_ifelse"></block>
        <block type="logic_compare"></block>
        <block type="logic_operation"></block>
        <block type="logic_negate"></block>
        <block type="logic_boolean"></block>
      </category>

      <category
        css-icon="customIcon fa fa-recycle"
        name="循环"
        categorystyle="loop_category"
      >
        <block type="controls_repeat_ext">
          <value name="TIMES">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
        </block>
        <!-- <block type="controls_repeat"></block> -->
        <block type="controls_whileUntil"></block>
        <block type="controls_for">
          <value name="FROM">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="TO">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
          <value name="BY">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
        </block>
        <block type="controls_forEach"></block>
        <block type="controls_flow_statements"></block>
      </category>

      <category
        css-icon="customIcon fa fa-question-circle"
        name="数学"
        categorystyle="math_category"
      >
        <block type="math_number" gap="32">
          <field name="NUM">123</field>
        </block>
        <block type="math_arithmetic">
          <value name="A">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="B">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
        </block>
        <block type="math_random_int">
          <value name="FROM">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="TO">
            <shadow type="math_number">
              <field name="NUM">100</field>
            </shadow>
          </value>
        </block>
        <block type="math_random_float"></block>
        <block type="math_number_property">
          <value name="NUMBER_TO_CHECK">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
        </block>
        <block type="math_round">
          <value name="NUM">
            <shadow type="math_number">
              <field name="NUM">3.1</field>
            </shadow>
          </value>
        </block>
        <block type="math_on_list"></block>
        <block type="math_modulo">
          <value name="DIVIDEND">
            <shadow type="math_number">
              <field name="NUM">64</field>
            </shadow>
          </value>
          <value name="DIVISOR">
            <shadow type="math_number">
              <field name="NUM">10</field>
            </shadow>
          </value>
        </block>
        <block type="math_constrain">
          <value name="VALUE">
            <shadow type="math_number">
              <field name="NUM">50</field>
            </shadow>
          </value>
          <value name="LOW">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
          <value name="HIGH">
            <shadow type="math_number">
              <field name="NUM">100</field>
            </shadow>
          </value>
        </block>
      </category>

      <category
        css-icon="customIcon fa fa-percent"
        name="字符"
        categorystyle="text_category"
      >
        <block type="text"></block>
        <block type="text_multiline"></block>
        <block type="text_join"></block>
        <block type="text_append">
          <value name="TEXT">
            <shadow type="text"></shadow>
          </value>
        </block>
        <block type="text_length">
          <value name="VALUE">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_isEmpty">
          <value name="VALUE">
            <shadow type="text">
              <field name="TEXT"></field>
            </shadow>
          </value>
        </block>
        <block type="text_indexOf">
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">text</field>
            </block>
          </value>
          <value name="FIND">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_charAt">
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">text</field>
            </block>
          </value>
        </block>
        <block type="text_getSubstring">
          <value name="STRING">
            <block type="variables_get">
              <field name="VAR">text</field>
            </block>
          </value>
        </block>
        <block type="text_changeCase">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_trim">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_count">
          <value name="SUB">
            <shadow type="text"></shadow>
          </value>
          <value name="TEXT">
            <shadow type="text"></shadow>
          </value>
        </block>
        <block type="text_replace">
          <value name="FROM">
            <shadow type="text"></shadow>
          </value>
          <value name="TO">
            <shadow type="text"></shadow>
          </value>
          <value name="TEXT">
            <shadow type="text"></shadow>
          </value>
        </block>
        <block type="text_reverse">
          <value name="TEXT">
            <shadow type="text"></shadow>
          </value>
        </block>
        <label text="Input/Output:" web-class="ioLabel"></label>
        <block type="text_print">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
        <block type="text_prompt_ext">
          <value name="TEXT">
            <shadow type="text">
              <field name="TEXT">abc</field>
            </shadow>
          </value>
        </block>
      </category>

      <category
        css-icon="customIcon fa fa-list"
        name="列表"
        categorystyle="list_category"
      >
        <block type="lists_create_with">
          <mutation items="0"></mutation>
        </block>
        <block type="lists_create_with"></block>
        <block type="lists_repeat">
          <value name="NUM">
            <shadow type="math_number">
              <field name="NUM">5</field>
            </shadow>
          </value>
        </block>
        <block type="lists_length"></block>
        <block type="lists_isEmpty"></block>
        <block type="lists_indexOf">
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">list</field>
            </block>
          </value>
        </block>
        <block type="lists_getIndex">
          <value name="VALUE">
            <block type="variables_get">
              <field name="VAR">list</field>
            </block>
          </value>
        </block>
        <block type="lists_setIndex">
          <value name="LIST">
            <block type="variables_get">
              <field name="VAR">list</field>
            </block>
          </value>
        </block>
        <block type="lists_getSublist">
          <value name="LIST">
            <block type="variables_get">
              <field name="VAR">list</field>
            </block>
          </value>
        </block>
        <block type="lists_split">
          <value name="DELIM">
            <shadow type="text">
              <field name="TEXT">,</field>
            </shadow>
          </value>
        </block>
        <block type="lists_sort"></block>
        <block type="lists_reverse"></block>
      </category>

      <category
        css-icon="customIcon fa fa-recycle"
        name="变量"
        categorystyle="variable_category"
        custom="VARIABLE"
      ></category>

      <category
        css-icon="customIcon fa fa-recycle"
        name="函数"
        categorystyle="procedure_category"
        custom="PROCEDURE"
      ></category>
      <category
        css-icon="customIcon fa fa-thermometer-full"
        name="传感器"
        categorystyle="sensor_category"
      >
      </category>
      <category
        css-icon="customIcon fa fa-podcast"
        name="执行器"
        categorystyle="actor_category"
      ></category>
    </xml>
  </div>
</template>

<script>
/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blockly Vue Component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import Blockly from "blockly";
import "./custom_category.js";
import "./custom_theme.js";

import "../blocks/chip";

export default {
  name: "BlocklyComponent",
  data() {
    return {
      workspace: null,
    };
  },
  methods: {
    blocklyUpdate() {
      this.$emit("blocklyUpdate");
    },
  },
  mounted() {
    this.workspace = Blockly.inject(this.$refs["blocklyDiv"], {
      toolbox: document.getElementById("toolbox-categories"),
      theme: Blockly.Themes.pico,
      renderer: "zelos",
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.8,
        maxScale: 1.6,
        minScale: 0.4,
        scaleSpeed: 1.1,
        pinch: true,
      },
      scrollbars: true,
    });

    // 绑定blocks更改的事件
    this.workspace.addChangeListener(this.blocklyUpdate);

    // 消除滚动条，注意workspace配置里面的scrollbars不能为false，否则就不能拖动了;
    // 由于div是注入生成的，所以只能在这里通过js完成，有点丑陋
    document.querySelectorAll(".blocklyMainWorkspaceScrollbar").forEach(function(item) {
      item.setAttribute("width", 0);
      item.setAttribute("height", 0);
    });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blocklyDiv {
  height: 100%;
  width: 100%;
  text-align: left;
}
</style>
