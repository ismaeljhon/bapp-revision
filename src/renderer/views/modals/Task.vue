<template>
    <b-modal :visible="showModal" @hide="showModal = false" @hidden="reset" hide-footer centered title="Adding New Task">
        <h6>Project: {{ item.name }}</h6>
        <b-form-group label="Task name:" :invalid-feedback="veeErrors.first('name')" :state="!veeErrors.has('name')">
            <b-input v-model="form.name" name="name" v-validate="'required'"></b-input>
        </b-form-group>
        <b-form-group>
            <template slot="label">
                Short Description: <small>(optional)</small>
            </template>
            <b-input v-model="form.description"></b-input>
        </b-form-group>
        <b-form-group>
            <template slot="label">
                TaskList: <small>(optional)</small>
            </template>
            <v-select label="name" :options="taskLists" v-model="taskListSelected" placeholder="Pick a Task List" @input="form.tasklist_id = taskListSelected ? taskListSelected.id_string : null"></v-select>
        </b-form-group>
        <b-button class="float-right" variant="success" @click.prevent="onSubmit" :disabled="isLoading">{{ isLoading ? 'Saving...' : 'Save' }}</b-button>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import RestApiService from '@/services/RestApiService.js';
import Log from '@/shared/Log'

export default {
    name: 'task-form-modal',
    data() {
        return {
            showModal: false,
            item: {},
            form: {},
            taskLists: [],
            taskListSelected: null,
            isLoading: false
        }
    },
    methods: {
        async show(item = {}) {
            _assign(this, {
                item: item,
                showModal: true,
            })

            await this.fetchProjectTaskLists(true);
            this.taskLists = this.$store.getters.PROJECT_TASK_LISTS;
        },
        reset() {
            _assign(this, {
                item: {},
                showModal: false,
                taskListSelected: null,
                form: {},
                isLoading: false
            })
        },
        onSubmit() {
            this.$validator.validateAll().then(noerrors => {
                if (noerrors) {
                    this.isLoading = true;
                    let currentUser = this.getCurrentUser();
                    this.form.person_responsible = currentUser.id

                    Log.info("Adding new task...", { processType: 'request' })

                    return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + this.item.id + "/tasks/").save({ params: this.form }, true)
                        .then(response => {
                            this.isLoading = false;
                            Log.success("New Task has been successfully saved", { withPrompt: true, processType: 'response', rawData: response.data })
                            this.showModal = false;
                            this.$emit('saved');
                        }).catch(error => {
                            this.isLoading = false;
                            Log.error(error.response.data.error.message, { processType: 'response' })
                        })
                }
            })
        }
    },
    computed: {
        title() {
            return this.item ? "Project: " + this.item.name : "";
        }
    }
}
</script>