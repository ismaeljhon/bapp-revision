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
        <b-form-group label-for="task-list">
            <template slot="label">
                TaskList: <small>(optional)</small>
                <div class="float-right">
                    <a href="#" @click.prevent="$refs.tasklistFormModal.show(item)"><small><font-awesome-icon icon="plus"></font-awesome-icon> Add new tasklist</small></a>
                </div>
            </template>
            <v-select label="name" id="task-list" :options="taskLists" v-model="taskListSelected" placeholder="Pick a Task List" @input="form.tasklist_id = taskListSelected ? taskListSelected.id_string : null"></v-select>
        </b-form-group>
        <b-button class="float-right" variant="success" @click.prevent="onSubmit" :disabled="isLoading">{{ isLoading ? 'Saving...' : 'Save' }}</b-button>

        <tasklist-form-modal ref="tasklistFormModal" @saved="fetchProjectTaskLists(true)" />
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import RestApiService from '@/services/RestApiService.js';
import Log from '@/shared/Log'
import TasklistFormModal from '@/views/modals/Tasklist';

export default {
    name: 'task-form-modal',
    components: {
        TasklistFormModal
    },
    data() {
        return {
            showModal: false,
            item: {},
            form: {},
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

                    return new RestApiService('/portal/' + process.env.ZOHO_PORTAL_ID + "/projects/" + this.item.id + "/tasks/").save({ params: this.form }, true)
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
        },
        taskLists() {
            return this.$store.getters.PROJECT_TASK_LISTS;
        }
    }
}
</script>