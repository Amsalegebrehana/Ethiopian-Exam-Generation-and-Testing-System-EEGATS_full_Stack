<script setup>
const props = defineProps(['path'])
const { path } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref('')
const files = ref()


const uploadFile = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('You must select a csv file to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    if(fileExt== "csv"){
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
  
      let { error: uploadError } = await supabase.storage.from('eegts-files').upload(filePath, file)
  
      if (uploadError) throw uploadError
  
      emit('update:path', filePath)
      emit('upload')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}

</script>

<template>
  <div>
   
    <div style="width: 10em; position: relative;">
      
      
      <label class="button primary block" for="single">
        <div v-if="uploading">
        <span>Uploading ...</span>
      </div>
      <div v-else>
        <div class="flex flex-row">
          <span class="font-medium text-base"> Upload File</span>
          <Icon name="material-symbols:attach-file-add" class="w-6 h-6"></Icon>
        </div>

      </div>
      </label>
      <input
        style="position: absolute; visibility: hidden;"
        type="file"
        id="single"
        accept=".csv"
        @change="uploadFile"
        :disabled="uploading"
      />
    </div>
  </div>
</template>
