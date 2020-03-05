import swal from 'sweetalert';
import _assign from 'lodash/assign';
import log from 'electron-log';

const Log = {
    success(msg, data = {}) {
        if (data.withPrompt) {
            _assign(data, {
                icon: data && data.icon ? data.icon : "success",
                title: data && data.title ? data.title : "Success", 
                text: msg
            })
            swal(data);
        }
        log.info((data.processType ? "[" + data.processType.toUpperCase() + "] " : "") + msg + JSON.stringify(data.rawData));
    },
    info(msg, data = {}) {
        if (data.withPrompt) {
            swal({
                icon: data && data.title ? data.icon : "info",
                title: data && data.title ? data.title : "Info",
                text: msg,
            })
        }
        log.info((data.processType ? "[" + data.processType.toUpperCase() + "]" : "") + msg);
    },
    warning(msg, data = {}) {
        if (data.withPrompt) {
            swal({
                icon: data && data.title ? data.icon : "warning",
                title: data && data.title ? data.title : "Warning",
                text: msg,
            })
        }
        log.info((data.processType ? "[Warning][" + data.processType.toUpperCase() + "]" : "") + msg);
    },
    error(msg, data = {}) {
        if (data.withPrompt) {
            swal({
                icon: 'error',
                title: "Error",
                text: msg,
            })
        }
        log.error((data.processType ? "[" + data.processType.toUpperCase() + "]" : "") + msg);
    }
}

export default Log;