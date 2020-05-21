<template>
    <b-modal :visible="showModal" no-close-on-backdrop hide-header-close no-close-on-esc centered border-variant="warning" title="Pending Timelog" header-bg-variant="warning" header-text-variant="white">
        
        
        {{ pendingTimelogProjectName }}<br><br>
        {{ pendingTimelogTaskName }} <br><br>
        Time Spent: {{ pendingTimelogHours }}

        <template slot="modal-footer">
            <div>
                <b-button variant="danger" class="mr-2" @click.prevent="resetPendingTimelog()">Do not Push</b-button>
                <b-button variant="primary" @click.prevent="pushTimelog(pendingTimelog); resetPendingTimelog()">Push Timelog</b-button>
            </div>
        </template>
    </b-modal>
</template>
<script>
export default {
    name: 'pending-timelog-modal',
    data() {
        return {
            showModal: false,
            pendingTimelog: false
        }
    },
    methods: {
        resetPendingTimelog() {
            localStorage.ZOHO_LAST_TIME_LOG = ''
            this.pendingTimelog = false
            this.showModal = false
        }
    },
    watch: {
        pendingTimelog(timelog) {
            if (timelog) {
                this.showModal = true
            }
        }
    },
    mounted() {
        this.pendingTimelog = this.getPendingTimelog()
    },
    computed: {
        pendingTimelogProjectName() {
            return this.pendingTimelog ? this.pendingTimelog.project.name : ""
        },
        pendingTimelogTaskName() {
            return this.pendingTimelog ? this.pendingTimelog.task.name : ""
        },
        pendingTimelogHours() {
            return this.pendingTimelog ? this.pendingTimelog.hours : ""
        }
    }
}
</script>