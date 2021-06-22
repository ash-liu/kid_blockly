/**
 * device.js
 * 说明：用于与设备交互的类，目前包含了2种交互方式：串口和websocket；
 * 所以与底层设备的交互都在这里抽象为特定的几个方法，方便ui调用；
 * 
 */

// -------------------------------------------------------------
//一些辅助函数
function decode_resp(data) {
    if (data[0] == 'W'.charCodeAt(0) && data[1] == 'B'.charCodeAt(0)) {
        var code = data[2] | (data[3] << 8);
        return code;
    } else {
        return -1;
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

// 
// 设备操作类，用于实现与设备端的操作，目前操作的interface也包含在里面
// 
export default class Device {
    constructor() {
        this.port_interface = {             // 串口handle
            port: null,
            reader: null,
            inputDone: null,

            write: function (port, data) {
                var encoder = new TextEncoder();
                const dataArrayBuffer = encoder.encode(data);

                if (port && port.writable) {
                    const writer = port.writable.getWriter();
                    writer.write(dataArrayBuffer);
                    writer.releaseLock();
                }
            }
        };
        this.ws_interface = {               // ws handle
            ws: null,
            ip: "192.168.1.8",
            port: 8266,

            write: function (ws, data) {
                ws.send(data);
            }
        };
        this._deviceConnectFlag = false;     // 是否连接标志
        this._deviceRunningFlag = false;     // 是否执行标志
        this._interfaceType = 'serial';      // 连接类型
    }

    // -----------------------------------------------------
    // propertys
    // 是否连接标志
    get deviceConnectFlag() {
        return this._deviceConnectFlag;
    }

    set deviceConnectFlag(v) {
        // can not set
    }

    // 是否执行标志
    get deviceRunningFlag() {
        return this._deviceRunningFlag;
    }

    set deviceRunningFlag(v) {
        // can not set
    }

    // 连接类型
    get interfaceType() {
        return this._interfaceType;
    }

    set interfaceType(v) {
        // can not set
    }

    // -----------------------------------------------------
    // 外部函数

    // 
    // interface_type: 连接的种类，目前包括：serial，串口连接；ws：websocket连接
    // connect_flag: false:断开连接，true：建立连接
    // 其他可选参数：param: 用于建立连接的参数
    // 
    connect(interface_type, connect_flag, param = "192.168.1.8") {
        console.log(interface_type, connect_flag);

        // 0. 检测参数
        if (["serial", "ws"].includes(interface_type)) {
            console.log("connect param check ok;");
        }
        else {
            console.log("connect param check fail;");
            return;
        }

        // 1. 如果设备已经连接，不管什么情况先断开所有类型的连接
        if (this._deviceConnectFlag) {
            this.closePort();
            this.closeWs();
        }

        // 2. 如果是关闭连接，则已经完成
        if (connect_flag == false) {
            this._interfaceType = interface_type;
            return;
        }

        // 3. 否则分类型打开连接
        this._interfaceType = interface_type;
        this.open(param);
    }

    start(msg) {
        // 检测是否连接
        if (!this._deviceConnectFlag) {
            this._deviceRunningFlag = false;
            return;
        }

        // 停止执行
        if (this._deviceRunningFlag) {
            this._deviceRunningFlag = false;
            this.write("\x03"); // 中断REPL的执行
            sleep(100);
            this.write("\x04"); // reset REPL
            sleep(100);
            this.write("\x03"); //
            console.log("stop run.");
        }
        // 开始执行 
        else {
            this._deviceRunningFlag = true;
            console.log(msg);
            this.write("\x05"); // 进入raw REPL mode
            sleep(50);
            this.write(msg);
            sleep(200);
            this.write("\x04"); // 结束raw REPL mode
            console.log("write end.");
        }
    }

    sendSerialHello() {
        this.write("\x02");         // 退出microPython的Raw mode，serial模式下会进入这个模式
        this.write("\x03");         // 复位终端
    }

    write(msg) {
        if (this._interfaceType == "serial") {
            this.port_interface.write(this.port_interface.port, msg);
        }
        else {
            this.ws_interface.write(this.ws_interface.ws, msg);
        }
    }

    // 可能不需要，通过conenct调用即可完成打开，关闭操作;
    open(param) {
        if (this._interfaceType == "serial") {
            this.openPort();
        }
        else {
            this.openWs(param);
        }

        // 连接后发送hello，复位REPL
        setTimeout(this.sendSerialHello.bind(this), 500);
    }

    // 可能不需要，通过conenct调用即可完成打开，关闭操作;
    close() {
        if (this._interfaceType == "serial") {
            this.closePort();
        }
        else {
            this.closeWs();
        }
    }

    // -----------------------------------------------------
    // 内部函数
    // for serial interface
    async openPort() {
        // 浏览器不支持serial
        if ("serial" in navigator == false) {
            console.log("The browser is not support serial api");
            return;
        }

        // 选择port口
        this.port_interface.port = await navigator.serial.requestPort({});
        console.log("port:", this.port_interface.port);

        // open serial
        await this.port_interface.port.open({ baudRate: 115200 });

        //设置标志位
        this._deviceConnectFlag = true;

        let decoder = new TextDecoderStream();
        this.port_interface.inputDone = this.port_interface.port.readable.pipeTo(decoder.writable);
        let inputStream = decoder.readable;
        this.port_interface.reader = inputStream.getReader();
        this.readLoop();
    }

    async closePort() {
        if (this.port_interface.port) {
            await this.port_interface.reader.cancel();
            await this.port_interface.inputDone.catch(() => { });
            this.port_interface.reader = null;
            this.port_interface.inputDone = null;
            await this.port_interface.port.close();
            this.port_interface.port = null;
        }
        this._deviceConnectFlag = false;
    }

    async readLoop() {
        while (true) {
            const { value, done } = await this.port_interface.reader.read();
            if (value) {
                // log.textContent += value + "\n";
            }
            if (done) {
                console.log("[readLoop] DONE", done);
                this.port_interface.reader.releaseLock();
                break;
            }
        }
    }

    // for ws interface
    openWs(ip) {
        this.ws_interface.ws = new WebSocket(ip);
        this.ws_interface.ws.binaryType = 'arraybuffer';
        this.ws_interface.ws.onopen = function () {
            console.log("Welcome to MicroPython");
            this.ws_interface.ws.onmessage = function (event) {
                if (event.data instanceof ArrayBuffer) {
                    var data = new Uint8Array(event.data);
                    console.log('ws get:', data);
                }
            };
        }.bind(this);

        //设置标志位
        this._deviceConnectFlag = true;
    }

    closeWs() {
        if (this.ws_interface.ws) {
            this.ws_interface.ws.close();
            this.ws_interface.ws = null;
        }
        this._deviceConnectFlag = false;
    }
}