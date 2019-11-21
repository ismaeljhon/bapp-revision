let Misc = {
    methods: {
        beautifyFeedback(msg) {
            return msg.replace("_", " ");
        },
        customHourFormat(duration) {
            let d = duration.split(':'),
                    h = d[0],
                    m = d[1];
            return h + 'h ' + m + 'm';
        }
    }
};

export default Misc;