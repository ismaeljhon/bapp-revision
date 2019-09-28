let Timer = {
    data() {
        return {
            timerButton: {
                "started": {
                    variant: 'danger',
                    text: 'Stop',
                    icon: 'stop'
                },
                "stopped": {
                    variant: 'success',
                    text: 'Start',
                    icon: 'play'
                }
            },
            time: '00:00:00',
            timeBegan: null, 
            timeStopped: null,
            stoppedDuration: 0,
            started: null,
            running: false
        }
    },
    methods: {
        startTimer() {
            if(this.running) return;

            if (this.timeBegan === null) {
                this.stopTimer();
                this.timeBegan = new Date();
            }

            if (this.timeStopped !== null) {
                this.stoppedDuration += (new Date() - this.timeStopped);
            }

            this.started = setInterval(this.clockRunning, 10);	
            this.running = true;
        },
        pauseTimer() {
            this.running = false;
            this.timeStopped = new Date();
            clearInterval(this.started);
            console.log(this.time);
        },
        stopTimer() {
            this.running = false;
            clearInterval(this.started);
            this.stoppedDuration = 0;
            this.timeBegan = null;
            this.timeStopped = null;
            this.time = "00:00:00";
        },
        clockRunning() {
            let currentTime = new Date()
            , timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration)
            , hour = timeElapsed.getUTCHours()
            , min = timeElapsed.getUTCMinutes()
            , sec = timeElapsed.getUTCSeconds()
            , ms = timeElapsed.getUTCMilliseconds();

            this.time = 
                this.zeroPrefix(hour, 2) + ":" + 
                this.zeroPrefix(min, 2) + ":" + 
                this.zeroPrefix(sec, 2);
        },

        zeroPrefix(num, digit) {
            let zero = '';
            for(let i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(- digit);
        },
    },
    computed: {
        getCurrentTimerStatus() {
            return (this.$store.getters.TIMER_STARTED) ? 'started' : 'stopped';
        }
    }
};


export default Timer;