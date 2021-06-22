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
      <!-- 设备连接&控制按钮 -->
      <div class="device-button">
        <div class="controlFlow">
          <div
            class="icon top-button"
            :class="{ start: !device.deviceRunningFlag, stop: device.deviceRunningFlag }"
            style="display: block"
            @click="doStart"
          >
            {{ device.deviceRunningFlag ? "Stop" : "Start" }}
          </div>
        </div>
      </div>
      <div class="connect-control" @click="doConnect">
        <div
          id="device-connect"
          class="icon bottom-button"
          :class="{
            start: !device.deviceConnectFlag,
            stop: device.deviceConnectFlag,
          }"
        >
          {{ device.deviceConnectFlag ? "DISCONNECT" : "CONNECT" }}
        </div>
      </div>

      <!-- 下方的多页面控制区 -->
      <div
        id="visualizer-container"
        class="SidePanelBottom tabs_closed"
        :class="{
          bottomTabSelected: isTabDigtalViewSelected || isTabPythonSelected,
        }"
      >
        <!-- IO图 -->
        <div
          id="visualizer-file"
          class="contentTabs fileBottomTab"
          style="display: block"
          v-show="isTabDigtalViewSelected"
        >
          <p>Raspberry Pi<br />Pico</p>
          <div id="digital-view-module-image">
            <img
              src="./assets/pico.png"
              style="height: 100%; width: 100%; object-fit: contain"
            />
          </div>
        </div>

        <!-- python代码 -->
        <div
          id="visualizer-python"
          class="contentTabs pythonBottomTab"
          style="display: block"
          :style="{ height: pythonAreaHeight }"
          v-show="isTabPythonSelected"
        >
          <div class="tabs">
            <div
              id="python-panel-control"
              class="control"
              @click="
                pythonExpandFlag = !pythonExpandFlag;
                editor.resize(true);
              "
            >
              <div class="three-dot"></div>
              <div class="three-dot"></div>
              <div class="three-dot"></div>
            </div>
          </div>
          <div style="height: 100%">
            <div id="python-editor" style="height: 100%"></div>
          </div>
        </div>

        <div class="tabsContainer">
          <div
            id="tab-bottom-file"
            class="tabBottom"
            :class="{ selected: isTabDigtalViewSelected }"
            @click="onTabDigtalViewClicked"
          >
            Digital View
          </div>
          <div
            id="tab-bottom-python"
            class="tabBottom"
            :class="{ selected: isTabPythonSelected }"
            @click="onTabPythonClicked"
          >
            Python
          </div>
        </div>
      </div>
    </div>

    <BlocklyComponent
      id="blockly"
      ref="foo"
      style="left: 0px; top: 55px; width: 100%; height: 949px"
      @blocklyUpdate="blocklyUpdate"
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
import "./prompt";

import ace from "ace-builds";
import "ace-builds/webpack-resolver";

import BlocklyPY from "blockly/python";

import Device from "./device";

export default {
  name: "app",
  components: {
    BlocklyComponent,
  },
  data() {
    return {
      device: new Device(),
      deviceConnectFlag: false, // 设备是否连接
      deviceRunningFlag: false, // 程序是否在运行中
      pythonExpandFlag: false, // python code是否展开

      port: null,
      reader: null,             // 设备读取器
      inputDone: null,          // 

      editor: null,
      code: "",
      isTabDigtalViewSelected: false,
      isTabPythonSelected: false,
    };
  },
  computed: {
    pythonAreaHeight: function () {
      if (this.pythonExpandFlag) {
        return "600px";
      } else {
        return "206px";
      }
    },
  },
  methods: {
    //处理连接&断开连接
    doConnect() {
      if (this.device.deviceConnectFlag) {
        // this.device.connect("ws", false, "ws://192.168.1.8:8266/");
        this.device.connect("serial", false);
      }
      else {
        // this.device.connect("ws", true, "ws://192.168.1.8:8266/");
        this.device.connect("serial", true);
      }
    },

    doStart() {
      this.device.start(this.code);
    },

    onTabDigtalViewClicked() {
      this.isTabDigtalViewSelected = !this.isTabDigtalViewSelected;
      this.isTabPythonSelected = false;
    },

    onTabPythonClicked() {
      this.isTabPythonSelected = !this.isTabPythonSelected;
      this.isTabDigtalViewSelected = false;
    },

    blocklyUpdate() {
      this.code = BlocklyPY.workspaceToCode(this.$refs["foo"].workspace);
      this.editor.setValue(this.code);
    },
  },

  mounted() {
    this.editor = ace.edit("python-editor", {
      readOnly: true,
      highlightActiveLine: false,
    });
    // ace.config.set(
    //   "basePath",
    //   "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
    // )
    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.setMode("ace/mode/python");
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

.icon.stop {
  border-color: #d00;
  color: #d00;
  background: #fee;
}

.icon.stop:hover {
  border-color: #b00;
  color: #b00;
  background: #fcc;
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

.SidePanelBottom > .tabsContainer {
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 10px;
  position: relative;
  z-index: 15;
  border-top: none;
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
  position: relative;
}

.tabBottom:hover {
  cursor: pointer;
  height: 49px;
  margin-top: -10px;
}

.tabBottom.selected {
  font-size: 15px;
  background-color: #bbb;
  height: 49px;
  margin-top: -10px;
}

.tabBottom:last-child {
  margin-right: 0;
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

.pythonBottomTab {
  height: 206px;
  position: relative;
  padding-top: 3px;
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
  left: -32px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  clip-path: inset(-15px -15px -15px 0);
}

.contentTabs > .tabs {
  top: -55px;
  transform: rotate(-90deg);
  left: calc(50% - 20px);
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

/* 去掉滚动条 */
#blockly::-webkit-scrollbar {
  display: none;
}
/* end here!!!! */
</style>
