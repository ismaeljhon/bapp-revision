<template>
    <b-card header="Work Summary">
        <strong>Today: </strong><span>{{ dailyTimeLogs }}</span>
        <br>
        <strong>This Week: </strong><span>{{ weeklyTimelogs }}</span>
    </b-card>
</template>
<script>
export default {
    name: 'timelog-summary',
    computed: {
        weeklyTimelogs() {
            let weeklyTimelogs = this.$store.getters.WEEKLY_TIMELOGS || [];
            return weeklyTimelogs.grandtotal ? this.customHourFormat(weeklyTimelogs.grandtotal) : '0h 0m';
        },
        dailyTimeLogs() {
            let dailyTimeLogs = this.$store.getters.DAILY_TIMELOGS || [];
            return dailyTimeLogs.grandtotal ? this.customHourFormat(dailyTimeLogs.grandtotal) : '0h 0m';
        }
    }
}
</script>