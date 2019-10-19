import Vue from 'vue'
import modules from './modules';
import _forEach from 'lodash/forEach';

_forEach(modules, module => {
    Vue.mixin(module)
})
