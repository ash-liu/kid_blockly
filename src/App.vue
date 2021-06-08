<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <BlocklyComponent id="blockly1">
      <block type="controls_ifelse"></block>
      <block type="logic_compare"></block>
      <block type="logic_operation"></block>
      <block type="controls_repeat_ext">
          <value name="TIMES">
              <shadow type="math_number">
                  <field name="NUM">10</field>
              </shadow>
          </value>
      </block>
      <block type="logic_operation"></block>
      <block type="logic_negate"></block>
      <block type="logic_boolean"></block>
      <block type="logic_null" disabled="true"></block>
      <block type="logic_ternary"></block>
      <block type="text_charAt">
          <value name="VALUE">
              <block type="variables_get">
                  <field name="VAR">text</field>
              </block>
          </value>
      </block>
    </BlocklyComponent> -->
 
    <BlocklyComponent id="blockly2" :options="options" ref="foo" :class="block_class"></BlocklyComponent>
    
    <div class="tabs" @click="showCodeArea()">
        <div id="side-panel-control" class="control" style="display: flex;">
          <div class="three-dot"></div>
          <div class="three-dot"></div>
          <div class="three-dot"></div>
        </div>
    </div>

    <!-- <transition name="fade"> -->
    <div id="code" :class="code_class">
        <div>
          <button class="btn btn-primary" @click="showCode()">Show Code</button>
          <br/><br/>
          <pre v-html="code"></pre>
        </div>
    </div>
    <!-- </transition> -->
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
 * @fileoverview Main Vue component that includes the Blockly component.
 * @author samelh@google.com (Sam El-Husseini)
 */

import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./blocks/stocks";
import "./prompt";

import BlocklyPY from "blockly/python";

export default {
  name: "app",
  components: {
    BlocklyComponent,
  },
  data() {
    return {
      code_class: "",
      code: "",
      options: {
        media: "media/",
        grid: {
          spacing: 25,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        toolbox: `<xml>
          <category name="Logic" colour="%{BKY_LOGIC_HUE}">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
          </category>
          <category name="Loops" colour="%{BKY_LOOPS_HUE}">
            <block type="controls_repeat_ext">
              <value name="TIMES">
                <block type="math_number">
                  <field name="NUM">10</field>
                </block>
              </value>
            </block>
            <block type="controls_whileUntil"></block>
          </category>
          <category name="Math" colour="%{BKY_MATH_HUE}">
            <block type="math_number">
              <field name="NUM">123</field>
            </block>
            <block type="math_arithmetic"></block>
            <block type="math_single"></block>
          </category>
          <category name="Text" colour="%{BKY_TEXTS_HUE}">
            <block type="text"></block>
            <block type="text_length"></block>
            <block type="text_print"></block>
          </category>
          <category name="Variables" custom="VARIABLE" colour="%{BKY_VARIABLES_HUE}">
            </category>
          <category name="Stocks" colour="%{BKY_LOOPS_HUE}">
            <block type="stock_buy_simple"></block>
            <block type="stock_buy_prog"></block>
            <block type="stock_fetch_price"></block>
          </category>
        </xml>`,
      },
    };
  },
  computed: {
    block_class() {
      if (this.code_class == "") {
        return "";
      }
      else if (this.code_class == "code_hide") {
        return "block_large";
      }
      else {
        return "block_small";
      }
    }
  },
  methods: {
    showCode() {
      this.code = BlocklyPY.workspaceToCode(this.$refs["foo"].workspace);
    },

    showCodeArea() {
      if (this.code_class == "code_hide") {
        this.code_class = "code_show";
      }
      else if (this.code_class == "code_show") {
        this.code_class = "code_hide";
      }
      else {      // init value 
        this.code_class = "code_hide";
      }
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}

#code {
  display: flex;
  flex-flow: row;
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
  margin: 0;
  background-color: beige;
}

.code_hide {
  animation: animation_code_hide 1s;
  -webkit-animation: animation_code_hide 1s; /* Safari and Chrome */
  animation-fill-mode:forwards;
  -webkit-animation-fill-mode:forwards;
}

.code_show {
  animation: animation_code_show 1s;
  -webkit-animation: animation_code_show 1s; /* Safari and Chrome */
  animation-fill-mode:forwards;
  -webkit-animation-fill-mode:forwards;
}

@keyframes animation_code_hide
{
	0%   {width: 50%;}
	100% {width: 0%;}
}

@keyframes animation_code_show
{
	0%   {width: 0%;}
	100% {width: 50%;}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
  width: 50%;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  width: 0%;
}

/* #blockly1 {
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 50%;
} */

#blockly2 {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 50%;
  height: 100%;
}

.block_small {
  animation: animation_block_small 1s;
  -webkit-animation: animation_block_small 1s; /* Safari and Chrome */
  animation-fill-mode:forwards;
  -webkit-animation-fill-mode:forwards;
}

.block_large {
  animation: animation_block_large 1s;
  -webkit-animation: animation_block_large 1s; /* Safari and Chrome */
  animation-fill-mode:forwards;
  -webkit-animation-fill-mode:forwards;
}

@keyframes animation_block_small
{
	0%   {width: 100%;}
	100% {width: 50%;}
}

@keyframes animation_block_large
{
	0%   {width: 50%;}
	100% {width: 100%;}
}

.tabs {
  display: flex;
  flex-flow: row;
  transform: rotate(180deg);
  writing-mode: vertical-lr;
  padding-left: 0;
  z-index: 110;
  position: absolute;
  top: 38vh;
  left: 48%;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  clip-path: inset(-15px -15px -15px 0);
}

.tabs > .control {
  width: 32px;
  height: 80px;
  background-color: #fff;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  margin-right: 1px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}

.three-dot {
  height: 12px;
  width: 12px;
  background-color: #ccc;
  border-radius: 50%;
}
</style>
