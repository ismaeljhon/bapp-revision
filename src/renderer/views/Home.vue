<template>
    <b-row>
        <b-col cols="12" class="mt-3">
            <b-form-group label="Project">
                <v-select label="name" :options="projects" v-model="form.project_id" placeholder="Select a Project"></v-select>
            </b-form-group>
            <b-form-group label="Task">
                <v-select label="name" :options="tasks" v-model="form.task_id" placeholder="Pick a Task"></v-select>
            </b-form-group>
            <b-form-group label="Notes">
                <b-form-textarea v-model="form.notes" rows="3" max-rows="6"></b-form-textarea>
            </b-form-group>
        </b-col>
        <b-col cols="12">
            <b-button :variant="timerButtonVariant" size="m" @click.prevent="setupTimer" style="text-transform: uppercase">
                <font-awesome-icon :icon="timerButtonIcon" class="mr-1" />{{ timerButtonText }}
            </b-button>
            <span class="ml-2" v-show="$store.getters.TIMER_STARTED">00:00:00</span>
        </b-col>
    </b-row>
</template>
<script>
export default {
    name: 'home',
    data() {
        return {
            form: {},
            projects: [
                { id: 1, name: "Project 1" },
                { id: 2, name: "Project 2" },
            ],
            tasks: [
                { id: 1, name: "Task 1" },
                { id: 2, name: "Task 2" },
            ]
        }
    },
    methods: {
        setupTimer() {
            this.$store.commit('SET_TIMER_STATUS');
        }
    },
    computed: {
        timerButtonVariant() {
            return this.timerButton[this.getCurrentTimerStatus].variant;
        },
        timerButtonText() {
            return this.timerButton[this.getCurrentTimerStatus].text;
        },
        timerButtonIcon() {
            return this.timerButton[this.getCurrentTimerStatus].icon;
        } 
    }
}
</script>
<style scoped>

</style>