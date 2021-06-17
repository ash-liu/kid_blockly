/*
   * Web Serial API (Google Chrome)
   *
   * Useful information used to this implementation:
   * https://github.com/svendahlstrand/web-serial-api/
   * https://dev.to/unjavascripter/the-amazing-powers-of-the-web-web-serial-api-3ilc
   *
   */

const connectButton = document.getElementById('SerialConnectButton');
let port;

if ('serial' in navigator) {
    connectButton.addEventListener('click', function () {
        if (port) {
            term.write('\x1b[31mDisconnected from Serial Port\x1b[m\r\n');
            port.close();
            port = undefined;
            connectButton.innerText = 'Connect (Web Serial)';
            connected = false;


        }
        else {
            connectButton.innerText = 'Disconnect';
            getReader();
        }
    });

    connectButton.disabled = false;
}
else {
    const error = document.createElement('p');
    error.innerHTML = '<p>Support for Serial Web API not enabled. Please enable it using chrome://flags/ and enable Experimental Web Platform fetures</p>';

}


let lineBuffer = '';
let latestValue = 0;

async function serialWrite(data) {
    encoder = new TextEncoder();
    const dataArrayBuffer = encoder.encode(data);

    if (port && port.writable) {
        const writer = port.writable.getWriter();
        writer.write(dataArrayBuffer);
        writer.releaseLock();
    }
}


async function serialWriteE(data) {
    encoder = new TextEncoder();
    const dataArrayBuffer = data;

    if (port && port.writable) {
        const writer = port.writable.getWriter();
        writer.write(dataArrayBuffer);
        writer.releaseLock();
    }
}


async function getReader() {
    port = await navigator.serial.requestPort({});

    /*
          if (navigator.appVersion.indexOf("Win") != -1)
      await port.open({ baudRate: 115200 });
          if (navigator.appVersion.indexOf("Linux") != -1)
      await port.open({ baudRate: 115200 });
    */

    //await port.open({ baudrate: 115200 });
    await port.open({ baudRate: 115200 });


    connectButton.innerText = 'Disconnect';
    term.write('\x1b[31mConnected using Web Serial API !\x1b[m\r\n');
    connected = true;

    const appendStream = new WritableStream({
        write(chunk) {
            //term.write(chunk);
            //console.log('.' + chunk);
            var dataIn = chunk;
            //var dataIn = new Uint8Array(chunk);
            console.log('binary state = ' + binary_state);
            //console.log("chunk = " + dataIn);

            switch (binary_state) {
                case 91:
                    binary_state = 92;
                    received_string2 = "";
                    gtCnt = 0;
                    break;

                case 92:
                    //console.log("len = " + dataIn.length);
                    for (var i = 0; i < dataIn.length; i++) {
                        console.log(dataIn.charCodeAt(i) + " " + dataIn.charAt(i));
                        if (dataIn.charAt(i) == '>') {
                            gtCnt = gtCnt + 1;
                        }
                        if (gtCnt >= 3) {
                            console.log("GOT gtCnt = " + gtCnt);
                            //binary_state=93;
                            console.log(received_string2);
                            editor.getDoc().setValue(received_string2);
                        }
                    }
                    break;

            }
            received_string2 = received_string2.concat(chunk);

            if (chunk instanceof ArrayBuffer) {
                if (binary_state == 12) {
                    // final response for put
                    if (decode_resp(data) == 0) {
                        update_file_status('Sent ' + put_file_name + ', ' + put_file_data.length + ' bytes');
                    } else {
                        update_file_status('Failed sending ' + put_file_name);
                    }
                    binary_state = 0;
                }

                if (binary_state == 11) {
                    // first response for put
                    if (decode_resp(data) == 0) {
                        // send file data in chunks
                        for (var offset = 0; offset < put_file_data.length; offset += 1024) {
                            serialWrite(put_file_data.slice(offset, offset + 1024));
                        }
                        binary_state = 12;
                    }

                }

                if (binary_state == 23) {
                    // final response
                    if (decode_resp(data) == 0) {
                        update_file_status('Got ' + get_file_name + ', ' + get_file_data.length + ' bytes');
                        if (!viewOnly)
                            saveAs(new Blob([get_file_data], { type: "application/octet-stream" }), get_file_name);
                        else
                            //updateSourceCode([get_file_data]);
                            updateSourceCode(new Blob([get_file_data], { type: "text/plain" }), get_file_name);
                    } else {
                        update_file_status('Failed getting ' + get_file_name);
                    }
                    binary_state = 0;
                }
                if (binary_state == 23) {
                    // first (and last) response for GET_VER
                    console.log('GET_VER', data);
                    binary_state = 0;

                }


                if (binary_state == 22) {
                    // file data
                    var sz = data[0] | (data[1] << 8);
                    if (data.length == 2 + sz) {
                        // we assume that the data comes in single chunks
                        if (sz == 0) {
                            // end of file
                            binary_state = 23;
                        } else {
                            // accumulate incoming data to get_file_data
                            var new_buf = new Uint8Array(get_file_data.length + sz);
                            new_buf.set(get_file_data);
                            new_buf.set(data.slice(2), get_file_data.length);
                            get_file_data = new_buf;
                            update_file_status('Getting ' + get_file_name + ', ' + get_file_data.length + ' bytes');

                            var rec = new Uint8Array(1);
                            rec[0] = 0;
                            serialWrite(rec);
                        }
                    } else {
                        binary_state = 0;
                    }
                }


                if (binary_state == 21) {
                    // first response for get
                    if (decode_resp(data) == 0) {
                        binary_state = 22;
                        var rec = new Uint8Array(1);
                        rec[0] = 0;
                        serialWrite(rec);
                    }

                }

            }
            //term.write(event.data);
            term.write(chunk);
            console.log(chunk);
            received_string = received_string.concat(chunk);


            //byte by byte...
            //alert(event.data);
            //received_string = received_string.concat(event.data);

            //////////////////////COPIADO DE CIMA DO WEBSOCKET
            //////////////////////COPIADO DE CIMA DO WEBSOCKET
            //////////////////////COPIADO DE CIMA DO WEBSOCKET
            //////////////////////COPIADO DE CIMA DO WEBSOCKET
        }
    });

    port.readable
        .pipeThrough(new TextDecoderStream())
        .pipeTo(appendStream);

    setTimeout(sendSerialHello, 500);
}

function sendSerialHello() {
    //serialWrite("\nmachine.soft_reset()\n\n");
    serialWrite('\x03');
    serialWrite('\x03');
}

class serialDevice{
    constructor() {
        this.port = null;

    }

    connect(flag) {
        // connect
        if(flag) {

        }
        // disconnect
        else {

        }
    }

    write(msg) {

    }

    read() {

    }
}