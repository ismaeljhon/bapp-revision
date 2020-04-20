<template>
    <b-modal :visible="showModal" @hide="showModal = false" @hidden="reset" title="Adding new sub task" hide-footer>
        <b-form-group label="Name:" :invalid-feedback="veeErrors.first('name')" :state="!veeErrors.has('name')">
            <b-input v-model="form.name" name="name" v-validate="'required'"></b-input>
        </b-form-group>
        <b-form-group>
            <template slot="label">
                Short Description: <small>(optional)</small>
            </template>
            <b-input v-model="form.description"></b-input>
        </b-form-group>
        <b-button @click.prevent="onSubmit" :disabled="isLoading" variant="success">{{ isLoading ? 'Saving...' : 'Save' }}</b-button>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import RestApiService from '../../services/RestApiService';
import Log from '@/shared/Log'

export default {
    name: 'sub-task-form-modal',
    data() {
        return {
            showModal: false,
            form: {},
            item: {},
            isLoading: false
        }
    },
    methods: {
        show(item = {}) {
            _assign(this, {
                showModal: true,
                item: item
            })
        },
        reset() {
            _assign(this, {
                item: {},
                form: {},
                isLoading: false
            })
        },
        onSubmit() {
            this.isLoading = true;
            let currentUser = this.getCurrentUser();
            this.form.person_responsible = currentUser.id

            Log.info("Adding new task...", { processType: 'request' })

            return new RestApiService('/portal/' + process.env.ZOHO_PORTAL_ID + "/projects/" + this.item.project.id + "/tasks/" + this.item.task.id + "/subtasks/").save({ params: this.form }, true)
            .then(response => {
                this.$emit('saved'),
                this.showModal = false
                this.isLoading = false
                Log.success("New Sub Task has been successfully saved", { withPrompt: true, processType: 'response', rawData: response.data })
            }).catch(error => {
                this.isLoading = false;
                Log.error(error.response.data.error.message, { processType: 'response' })
            })
        }
    }
}
</script>