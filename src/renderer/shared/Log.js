import swal from 'sweetalert';
import _assign from 'lodash/assign';

const Log = {
    success(msg, withPrompt = false, data = {}) {
        if (withPrompt) {
            _assign(data, {
                icon: data && data.icon ? data.icon : "success",
                title: data && data.title ? data.title : "Success", 
                text: msg
            })
            swal(data);
        }
        console.log(msg);
    },
    info(msg, withPrompt = false, data = {}) {
        if (withPrompt) {
            swal({
                icon: data && data.title ? data.icon : "info",
                title: data && data.title ? data.title : "Info",
                text: msg,
            })
        }
        console.log(msg);
    },
    warning(msg, withPrompt = false, data = {}) {
        if (withPrompt) {
            swal({
                icon: data && data.title ? data.icon : "warning",
                title: data && data.title ? data.title : "Warning",
                text: msg,
            })
        }
        console.log(msg);
    },
    error(msg, withPrompt = true) {
        if (withPrompt) {
            swal({
                icon: 'error',
                title: "Error",
                text: msg,
            })
        }
        console.log(msg);
    }
}

export default Log;