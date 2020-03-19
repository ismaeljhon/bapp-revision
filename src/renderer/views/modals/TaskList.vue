<template>
    <b-modal :visible="showModal" :title="title" @hide="showModal = false" @hidden="reset" hide-footer centered>
        <b-form-group label="Tasklist name:" :invalid-feedback="veeErrors.first('name')" :state="!veeErrors.has('name')">
            <b-input v-model="form.name" name="name" v-validate="'required'"></b-input>
        </b-form-group>
        <b-form-group label="Flag:" :invalid-feedback="veeErrors.first('flag')" :state="!veeErrors.has('flag')">
            <b-form-select :options="flagOptions" v-model="form.flag" name="flag" v-validate="'required'"></b-form-select>
        </b-form-group>
        <b-button class="float-right" variant="success" :disabled="isLoading" @click.prevent="onSubmit">{{ isLoading ? 'Saving...' : 'Save' }}</b-button>
    </b-modal>
</template>
<script>
import _assign from 'lodash/assign';
import Log from '@/shared/Log';
import RestApiService from '@/services/RestApiService';

export default {
    name: 'tasklist-form-modal',
    data() {
        return {
            item: {},
            isLoading: false,
            flagOptions: [
                {value: 'internal', text: 'Internal'},
                {value: 'external', text: 'External'}
            ],
            form: {},
            showModal: false
        }
    },
    methods: {
        show(item = {}) {
            _assign(this, {
                item: item,
                showModal: true
            })
        },
        reset() {
            _assign(this, {
                item: {},
                form: {},
            })
        },
        onSubmit() {
            this.$validator.validateAll().then(noerrors => {
                if (noerrors) {
                    this.isLoading = true;
                    Log.info('Saving Tasklist...', { processType: 'request' })

                    return new RestApiService('/portal/' + process.env.PORTAL_ID + "/projects/" + this.item.id + "/tasklists/")
                        .save({ params : this.form }, true)
                        .then(response => {
                            this.isLoading = false;
                            this.showModal = false
                            Log.success("New TaskList has been successfully saved", { withPrompt: true, processType: 'response', rawData: response.data })
                            this.$emit('saved');
                        }).catch(error => {
                            this.isLoading = false;
                            Log.error(error.response.data.error.message, { processType: 'response' })
                        })
                }
            });
        }
    },
    computed: {
        title() {
            return this.item && this.item.name ? this.item.name : '';
        }
    }
}
</script>