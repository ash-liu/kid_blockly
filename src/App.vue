<template>
  <div id="app">
    <!-- 发布项目的模态框 -->
    <div
      class="modal fade"
      id="shareLayer"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">发布项目</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <span class="input-group-text">项目名称</span>
              <input
                type="text"
                class="form-control"
                placeholder="输入项目名称"
                v-model="share_project_name"
                @keydown.enter="onShareClicked"
              />
            </div>

            <div class="input-group mb-3">
              <span class="input-group-text">允许修改</span>
              <div class="input-group-text">
                <input
                  class="form-check-input mt-0"
                  type="checkbox"
                  v-model="share_project_writeable"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="onShareClicked">确定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 获取项目的模态框 -->
    <div
      class="modal fade"
      id="fetchLayer"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">获取项目</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <span class="input-group-text">项目名称</span>
              <input
                type="text"
                class="form-control"
                placeholder="输入项目名称"
                v-model="share_project_name"
                @keydown.enter="onFetchClicked"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="onFetchClicked">确定</button>
          </div>
        </div>
      </div>
    </div>

    <nav>
      <div id="navigation-bar">
        <span class="logo-container">
          <div id="nav-projects">
            <!-- <div id="nav-back-arrow">❮</div> -->
            <img
              class="logo"
              src="./assets/piper_make_logo.svg"
              alt="Piper Make Logo"
              style="width: 120px; height: 48px"
            />
          </div>
        </span>

        <!-- 串口与wifi选择区 -->
        <div class="interface-select">
          <i
            id="icon_serial"
            class="fa fa-usb fa-2x"
            :style="{ color: usbColor }"
            @click="do_interface_select('serial')"
          ></i>
          <div style="width: 15px"></div>
          <i
            id="icon_ws"
            class="fa fa-wifi fa-2x"
            :style="{ color: wifiColor }"
            @click="do_interface_select('ws')"
          ></i>
          <input
            :disabled="device.deviceConnectFlag"
            v-show="interface_select != 'serial'"
            v-model="ip_input"
            type="text"
            class="form-control"
            placeholder="输入IP地址"
            @keydown.enter="doConnect"
          />
        </div>

        <!-- 分享与载入区 -->
        <div style="width: 15px"></div>
        <div class="share-import-area">
          <!-- 分享 -->
          <i
            type="button"
            class="fa fa-paper-plane fa-2x"
            data-bs-toggle="modal"
            data-bs-target="#shareLayer"
          ></i>
          <div style="width: 15px"></div>
          <i
            class="fa fa-arrow-circle-down fa-2x"
            data-bs-toggle="modal"
            data-bs-target="#fetchLayer"
          ></i>
        </div>
      </div>
    </nav>

    <div>
      <!-- 设备连接&控制按钮 -->
      <div class="device-button">
        <div class="controlFlow">
          <div
            class="icon top-button"
            :class="{
              start: !device.deviceRunningFlag,
              stop: device.deviceRunningFlag,
            }"
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

import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
import {Modal, Tooltip, Toast, Popover } from "bootstrap";

import BlocklyComponent from "./components/BlocklyComponent.vue";
import "./prompt";

import ace from "ace-builds";
import "ace-builds/webpack-resolver";

import BlocklyPY from "blockly/python";

import Device from "./device";

const AV = require('leancloud-storage');
const { Query, User } = AV;
// localStorage.setItem('debug', 'leancloud*');
// AV.debug.enable();  // 启用

export default {
  name: "app",
  props: ["source"], // "serial" or "ws"
  components: {
    BlocklyComponent,
  },
  data() {
    return {
      interface_select: window.location.pathname.slice(1, -5),
      ip_input: "",
      device: new Device(this.interface_select),
      pythonExpandFlag: false, // python code是否展开

      editor: null,
      code: "",
      isTabDigtalViewSelected: false,
      isTabPythonSelected: false,

      share_project_name: "",
      share_project_writeable: true,
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

    usbColor: function () {
      if (this.interface_select == "serial") {
        return "#3298dc";
      } else {
        return "#888888";
      }
    },

    wifiColor: function () {
      if (this.interface_select == "serial") {
        return "#888888";
      } else {
        return "#3298dc";
      }
    },

    ws_address_from_ip: function () {
      return "ws://" + this.ip_input + ":8266/";
    },
  },
  methods: {
    // 针对不同的接口类型跳转到对应的页面
    do_interface_select(i) {
      if (this.interface_select == i) {
        return;
      } else {
        if (i == "serial") {
          // 只有当在线模式下才会跳转到https
          if (window.location.host == "lstabc.com") {
            window.location.replace(
              "https://" + window.location.host + "/serial.html"
            );
          } else {
            window.location.replace(
              "http://" + window.location.host + "/serial.html"
            );
          }
        } else {
          window.location.replace(
            "http://" + window.location.host + "/ws.html"
          );
        }
      }
    },

    //处理连接&断开连接
    doConnect() {
      console.log("ws = ", this.ws_address_from_ip);
      if (this.device.deviceConnectFlag) {
        this.device.connect(
          this.interface_select,
          false,
          this.ws_address_from_ip
        );
      } else {
        this.device.connect(
          this.interface_select,
          true,
          this.ws_address_from_ip
        );
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

    // 点击分享的处理
    onShareClicked() {
      if (this.share_project_name == "") {
        alert("输入项目名称.");
        return;
      }
      const query = new AV.Query('works');
      query.includeACL(true);
      query.equalTo('alias', this.share_project_name);
      query.first().then((work) => {
        if (work) {
          if (work.attributes.ACL.getPublicWriteAccess()) {
            // 读取工作区并保存
            work.set('work_content', this.$refs["foo"].readWorkspace());
            work.save()

            // 关闭模态框
            var tmp_modal = document.getElementById('shareLayer')
            var modal = Modal.getInstance(tmp_modal) // Returns a Bootstrap modal instance
            modal.hide()
          }
          else {
            alert("项目已经存在且不允许修改，请换一个名字.");
          }
        }
        else {
          // console.log(work.attributes.work_content);
          const worksObject = AV.Object.extend('works');
          const new_work = new worksObject();
          new_work.set('alias', this.share_project_name);
          new_work.set('work_content', this.$refs["foo"].readWorkspace());

          // 设置ACL权限
          var acl = new AV.ACL();
          acl.setPublicReadAccess(true);
          acl.setPublicWriteAccess(this.share_project_writeable);
          new_work.setACL(acl);
          new_work.save()

          // 关闭模态框
          var tmp_modal = document.getElementById('shareLayer')
          var modal = Modal.getInstance(tmp_modal) // Returns a Bootstrap modal instance
          modal.hide()
        }
      });
    },

    // 点击获取的处理
    onFetchClicked() {
      if (this.share_project_name == "") {
        alert("输入项目名称.");
        return;
      }
      const query = new AV.Query('works');
      query.equalTo('alias', this.share_project_name);
      query.first().then((work) => {
        if (work) {
          if (work.attributes.work_content) {
            // 写入工作区
            this.$refs["foo"].writeWorkspace(work.attributes.work_content);

            // 关闭模态框
            var tmp_modal = document.getElementById('fetchLayer')
            var modal = Modal.getInstance(tmp_modal) // Returns a Bootstrap modal instance
            modal.hide()
          }
        }
        else {
          alert("项目不存在.");
        }
      })
    },
  },

  mounted() {
    // console.log("interface_select:", this.interface_select);
    this.editor = ace.edit("python-editor", {
      readOnly: true,
      highlightActiveLine: false,
    });
    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.setMode("ace/mode/python");

    // 初始化av cloud
    AV.init({
      appId: "iSOPNtkCdySPR0sCe3hnJrAM-gzGzoHsz",
      appKey: "9IGUomQYHnw2hdBPfDbO76xq",
      serverURL: "https://isopntkc.lc-cn-n1-shared.com"
    });
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

/* --------------------------------------- */
/* 导航部分的css */
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
  align-items: center;
  justify-content: flex-start;
  font-weight: 700;
  background-color: white;
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

#nav-projects {
  color: #aaa;
  font-size: 24px;
}

#nav-projects {
  margin: 0 15px;
}

/* logo区域 */
#navigation-bar > .logo-container {
  flex-grow: 0;
  text-align: left;
  display: flex;
  justify-content: flex-start;
}

#navigation-bar .logo {
  width: 120px;
  margin: 6px 20px;
}

/* nav里面的图标 */
#navigation-bar i {
  display: flex;
  flex-grow: 0;
  color: #888;
}

#navigation-bar i:focus,
#navigation-bar i:hover {
  transform: scale(1.1);
  transition: transform 0.25s;
  color: #3298dc;
}

/* interface选择区 */
#navigation-bar .interface-select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 0;
}

#navigation-bar .interface-select input {
  height: 26px;
  margin-left: 5px;
  margin-bottom: 0;
}

#navigation-bar .interface_icon_margin {
  display: flex;
  flex-basis: 10px;
  flex-grow: 0;
}

/* 分享区 */
#navigation-bar .share-import-area {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-grow: 0;
}

/* --------------------------------------- */
/* 左侧控制区 */
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

.connect-control {
  position: absolute;
  z-index: 90;
  bottom: 0;
  width: 160px;
  background: #fff;
  padding: 0 10px 10px 0;
}

/* ------------------------------------------------- */
/* 下方展示区 */
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
