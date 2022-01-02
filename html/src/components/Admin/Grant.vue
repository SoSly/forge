<script setup lang=ts>
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import { forge } from '../../types';

const props = defineProps<{user: forge.User}>();
const emits = defineEmits(['change', 'close']);
const $store = useStore();

const adminUser = ref({
    id: $store.state.user.id,
    rights: $store.state.user.rights
})

const targetUser = ref({
    id: props.user.id,
    rights: props.user.rights ?? {} as forge.UserRights
});

const disabled = ref(adminUser.value.id === targetUser.value.id);

function change() {
    emits('change', targetUser.value);
}
</script>

<style scoped lang="scss">
section {
    background: #EEE;
    border: 1px solid #AAA;
    height: 2.5in;
    width: 4in;

    header {
        background: rgba(0, 0, 0, .2);
        font-weight: bold;
        font-size: 1.2em;
        line-height: 1.2em;
        padding: 0.1in 0.25in 0.05in;

        span {
            color: #C00;
            cursor: pointer;
            float: right;
        }
    }

    fieldset {
        padding-top: 1em;
        margin: 0 auto;
        width: 50%;

        input[type=checkbox] {
            margin: 0 1em;
        }
    }
}

.dark section {
    background: #333;
    border: 1px solid #666;
}
</style>

<template>
<section>
    <header>
        Grant user rights for {{user.username}}
        <span @click="emits('close');">
            <font-awesome-icon icon="times" size="1x"></font-awesome-icon>
        </span>
    </header>
    <fieldset v-if="adminUser.rights.ban_user" :disabled="disabled">
        <input id="ban_user" type=checkbox v-model="targetUser.rights.ban_user" @change="change" />
        <label for="ban_user">Ban Users</label>
    </fieldset>
    <fieldset v-if="adminUser.rights.grant" :disabled="disabled">
        <input id="grant" type=checkbox v-model="targetUser.rights.grant" @change="change" />
        <label for="grant">Grant User Rights</label>
    </fieldset>
    <fieldset v-if="adminUser.rights.user_list" :disabled="disabled">
        <input id="user_list" type=checkbox v-model="targetUser.rights.user_list" @change="change" />
        <label for="user_list">View User List</label>
    </fieldset>
    <fieldset v-if="adminUser.rights.document_list" :disabled="disabled">
        <input id="document_list" type=checkbox v-model="targetUser.rights.document_list" @change="change" />
        <label for="document_list">View User Content</label>
    </fieldset>
    <fieldset v-if="adminUser.rights.delete_content" :disabled="disabled">
        <input id="delete_content" type=checkbox v-model="targetUser.rights.delete_content" @change="change" />
        <label for="delete_content">Delete User Content</label>
    </fieldset>
    <fieldset v-if="adminUser.rights.audit" :disabled="disabled">
        <input id="audit" type=checkbox v-model="targetUser.rights.audit" @change="change" />
        <label for="audit">View Audit Log</label>
    </fieldset>
</section>
</template>