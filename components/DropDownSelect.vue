<template>
    <div>

    
        <select
            class=" tom-select w-full rounded-r-lg border-0 text-slate-600"  :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
            <option  disabled selected class="text-gray-700">{{title}}</option>
            <option  v-for="opt in optionslist" :key="opt.id" :value="opt.id" >{{ opt.name?.length > 18
            ? opt.name?.substring(0, 18) + "..."
            : opt.name }}</option>
        
        </select>
     
    </div>

</template>
<script>
export default {
    name: 'DropDownSelect',
    props: {
        optionslist: Array,
        modelValue: {
            type: String,
            default: '',
            required: true
        },
        title: String
    

    },
    components: {},
    data() {
        return {

        }

    },
    methods: {
     
    
    }


}
</script>
