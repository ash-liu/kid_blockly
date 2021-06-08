<template>
  <div id="app">
    <nav>
      <div id="navigation-bar">
        <span class="logo-container">
          <div id="nav-projects">
            <div id="nav-back-arrow">❮</div>
            <img
              class="logo"
              src="./assets/piper_make_logo.svg"
              alt="Piper Make Logo"
              style="width: 120px; height: 48px"
            />
          </div>
        </span>
      </div>
    </nav>

    <div>
      <div class="device-button">
        <div class="controlFlow">
          <div
            id="device-load"
            class="icon top-button inactive"
            style="display: block"
          >
            Start
          </div>
          <div
            id="device-stop"
            class="icon top-button inactive"
            style="display: none"
          >
            Stop
          </div>
        </div>
      </div>

      <div class="connect-control">
        <div id="device-connect" class="icon bottom-button start">Connect</div>
      </div>

      <div
        id="visualizer-container"
        class="SidePanelBottom tabs_closed bottomTabSelected"
      >
        <div
          id="visualizer-file"
          class="contentTabs fileBottomTab"
          style="display: block"
        >
          <p>Raspberry Pi<br />Pico</p>
          <button id="digital-view-toggle" style="display: block">
            <svg
              width="14px"
              height="14px"
              viewBox="0 0 10 10"
              id="digital-view-toggle-dot"
            >
              <circle r="5" cx="5" cy="5" fill="#000" stroke="none"></circle>
            </svg>
          </button>
          <div id="digital-view-module-image" >
            <img
              src="./assets/pico.png" 
              style='height: 100%; width: 100%; object-fit: contain'
            />
          </div>
        </div>
        <div class="tabsContainer">
          <div id="tab-bottom-file" class="tabBottom selected">
            Digital View
          </div>
          <div id="tab-bottom-python" class="tabBottom">Python</div>
        </div>
      </div>
    </div>

    
    <BlocklyComponent
      id="blockly2"
      :options="options"
      ref="foo"
      style="left: 0px; top: 55px; width: 1842px; height: 949px;"
    ></BlocklyComponent>
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
  computed: {},
  methods: {
    showCode() {
      this.code = BlocklyPY.workspaceToCode(this.$refs["foo"].workspace);
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
  font-family: Montserrat, sans-serif;
  font-size: 16px;
  color: #777;
  padding: 0;
  margin: 0;
  height: 100vh;
  overflow-y: auto;
}

/* begin here!!!!!!!!!!!!!!!!! */

* {
  box-sizing: border-box;
}

nav {
  display: block;
  width: 100%;
  height: 60px;
}

#navigation-bar {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  height: 60px;
  z-index: 500;
  display: flex;
  justify-content: space-around;
  font-weight: 700;
  background-color: #333;
}

#navigation-bar div {
  position: relative;
  color: #ccc;
  font-weight: 400;
  border: none;
  font-size: 18px;
  line-height: 60px;
  cursor: pointer;
  display: flex;
}

#navigation-bar > .logo-container {
  flex-grow: 1;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}

#navigation-bar .logo {
  width: 120px;
  margin: 6px 20px;
}

#nav-projects {
  color: #aaa;
  font-size: 24px;
}

#nav-projects,
#nav-settings {
  margin: 0 15px;
}

#nav-projects:focus,
#nav-projects:hover,
#nav-settings:focus,
#nav-settings:hover {
  transform: scale(1.1);
  transition: transform 0.25s;
}

#nav-settings:focus,
#nav-settings:hover {
  font-weight: 700;
}

#nav-sidebar {
  position: absolute;
  top: 0;
  left: 0;
  width: 340px;
  height: 100vh;
  z-index: 550;
  background: #fff;
  padding: 20px 50px;
  text-align: center;
}

#nav-sidebar p {
  font-size: 21px;
  color: #333;
}

.device-button {
  width: 160px;
  height: 55px;
  background: #fff;
  position: absolute;
  z-index: 65;
}

.controlFlow {
  top: -10px;
  z-index: 80;
  position: relative;
  width: 160px;
  padding: 10px 10px 0 0;
  background: #fff;
}

.icon {
  width: 100%;
  height: 100%;
  fill: #fff;
  margin: 0 auto;
  font-family: Montserrat, sans-serif;
  color: #fff;
  font-size: 25px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 2px 5px 0;
  stroke: #fff;
  border: 4px solid #888;
  background: #eee;
  border-radius: 0 10px 10px 0;
  border-left: none;
}

.icon.start {
  border-color: #2b0;
  color: #2b0;
  background: #efe;
}

.icon.start:hover {
  border-color: #090;
  color: #090;
  background: #cfc;
}

.icon.top-button {
  font-size: 21px;
  line-height: 21px;
  text-transform: uppercase;
  font-weight: 700;
  height: 40px;
  margin-top: 8px;
  padding-top: 6px;
}

.icon.bottom-button {
  height: 40px;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  border-left: none;
  margin-top: 8px;
}

.icon.inactive {
  background: #eee;
  color: #888;
}

.connect-control {
  position: absolute;
  z-index: 90;
  bottom: 0;
  width: 160px;
  background: #fff;
  padding: 0 10px 10px 0;
}

.tabs_closed {
  width: calc(100vw - 175px);
}

.bottomTabSelected {
  background-color: #fff;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.1);
}

.SidePanelBottom {
  position: absolute;
  bottom: 0;
  z-index: 60;
  left: 160px;
  flex-direction: column;
}

.SidePanelBottom,
.SidePanelBottom > .contentTabs {
  align-items: center;
  justify-content: center;
}

.SidePanelBottom>.tabsContainer {
                width: 50%;
                display: flex;
                align-items: center;
                justify-content: space-around;
                padding: 0 10px;
                position: relative;
                z-index: 15;
                border-top: none
            }

.tabBottom {
                font-size: 14px;
                font-weight: 700;
                text-transform: uppercase;
                color: #000;
                width: 100%;
                height: 39px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 4px;
                margin-right: 10px;
                border-radius: 6px 6px 0 0;
                background-color: #ddd;
                color: #333;
                white-space: pre;
                position: relative
            }

            .tabBottom:hover {
                cursor: pointer;
                height: 49px;
                margin-top: -10px
            }

            .tabBottom.selected {
                font-size: 15px;
                background-color: #bbb;
                height: 49px;
                margin-top: -10px
            }

            .tabBottom:last-child {
                margin-right: 0
            }

.contentTabs {
  width: 100%;
  display: none;
}

#visualizer-file {
  padding: 10px;
  min-height: 135px;
  vertical-align: bottom;
  max-height: 185px;
}

.fileBottomTab p {
  font-size: 22px;
  font-weight: 700;
  color: #000;
  position: absolute;
  left: 20px;
  top: 0;
  margin-top: 10px;
}

#digital-view-toggle {
  position: absolute;
  top: 70px;
  left: 20px;
  height: 40px;
  padding: 0;
  border-radius: 50px;
  border: 2px solid #000;
  width: 22px;
  background: 0 0;
  margin-top: 20px;
}

#digital-view-module-image {
  max-width: 635px;
  min-width: 440px;
  margin-left: max(40px, calc((100% - 635px) / 2));
  box-sizing: border-box;
}

/* end here!!!! */
</style>
