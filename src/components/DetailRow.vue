<template>
    <div class="mx-1">
        <strong class="text-deep-orange"><h3>{{ labels }}: </h3></strong>
        <div class="text-body-1">{{ value }}</div>
    </div>
</template>
  
<script>
export default {
    name: 'DetailRow',
    props: {
        labels: {
            type: [String]
        },
        value: {
            type: [String]
        }
    },
    data() {
        return {
            
        };
    },
    watch: {
        
    },
    mounted() {

    },
    methods: {
        
    },
};
</script>
  