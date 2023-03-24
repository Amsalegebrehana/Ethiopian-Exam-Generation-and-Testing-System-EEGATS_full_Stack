<script setup>
const props = defineProps(['path'])
const { path } = toRefs(props)

const emit = defineEmits(['update:path', 'upload'])

const supabase = useSupabaseClient()

const uploading = ref(false)
const src = ref('')
const files = ref()

const downloadImage = async () => {
  try {
    const { data, error } = await supabase.storage.from('eegts-images').download(path.value)
    if (error) throw error
    src.value = URL.createObjectURL(data)
  } catch (error) {
    console.error('Error downloading image: ', error.message)
  }
}

const uploadAvatar = async (evt) => {
  files.value = evt.target.files
  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('You must select an image to upload.')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop()
    if(fileExt== "png" || fileExt == "jpeg"){
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
  
      let { error: uploadError } = await supabase.storage.from('eegts-images').upload(filePath, file)
  
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

downloadImage()

watch(path, () => {
  if (path.value) {
    downloadImage()
  }
})
</script>

<template>
  <div>
    <img
      v-if="src"
      :src="src"
      alt="Avatar"
      class="avatar image"
      style="width: 10em; height: 10em;"
    />
    <div v-else>

    <div style="width: 10em; position: relative;">
      
      
      <label class="button primary block" for="single">
        <div v-if="uploading">
        <span>Uploading ...</span>
      </div>
      <div v-else>
        <div class="flex flex-row">
          <span class="font-medium text-base"> Add Image</span>
          <Icon name="material-symbols:add-photo-alternate-outline-rounded" class="w-6 h-6"></Icon>
        </div>

      </div>
      </label>
      <input
        style="position: absolute; visibility: hidden;"
        type="file"
        id="single"
        accept="image/*"
        @change="uploadAvatar"
        :disabled="uploading"
      />
    </div>
    </div>
  </div>
</template>