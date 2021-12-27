function getTitle ({title}) {
    if (title) {
        return typeof title === 'function'
        ? title.call(vm)
        : title
    }
}

export default {
    created() {
        if (['RouterLink', 'RouterView'].indexOf(this.$options.name) >= 0) return;
        const title = getTitle(this)
        if (title) {
          document.title = `Document Forge | ${title}`;
        } else {
            document.title = 'Document Forge';
        }
    }
};
