<template>
    <b-modal :visible="showModal" @hide="showModal = false" @hidden="reset" title="Adding new sub task">
        <b-form-group label="Name:" :invalid-feedback="veeErrors.first('name')" :state="!veeErrors.has('name')">
            <b-input v-model="form.name" name="name" v-validate="'required'"></b-input>
        </b-form-group>
        <b-form-group>
            <template slot="label">
                Short Description: <small>(optional)</small>
            </template>
            <b-input v-model="form.description"></b-input>
        </b-form-group>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import RestApiService from '../../services/RestApiService';

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

            return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + this.item.project.id + "/tasks/" + this.item.task.id + "/subtasks/").save({ params: this.form }, true)
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