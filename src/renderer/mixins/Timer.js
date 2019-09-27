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
            }
        }
    },
    computed: {
        getCurrentTimerStatus() {
            return (this.$store.getters.TIMER_STARTED) ? 'started' : 'stopped';
        }
    }
};


export default Timer;