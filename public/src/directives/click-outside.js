import Vue from 'vue';

Vue.directive('click-outside', {
    bind(el, binding, vnode) {
        this.event = function(event) {
            if (!(el == event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', this.event)
    },
    unbind(el) { document.body.removeEventListener('click', this.event) },
});
