<script setup lang=ts>
import { useRouter } from 'vue-router'; 
const title = 'Home';
const $router = useRouter();

// todo: Consider creating a homepage. For now, we can redirect to the workbench.
$router.push('/workbench');
</script>

<template></template>