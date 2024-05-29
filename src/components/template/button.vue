<!-- <template>
  <div>
    <el-radio-group
      v-if="title.type == 1"
      v-model="title.optionId"
      @change="handleChangeOption(title.optionId, title)"
      @dblclick="handleEmptyRadio(title.optionId, title, 'inquiry')"
    >
      <el-radio-button
        :class="{
          serious: option.serious == '1',
          checked: option.choosen === true
        }"
        v-for="option in title.orthOptionsList"
        :key="option.id"
        :value="option.id"
      >
        {{ option.optionName }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: Object,
    default: () => {
      return {}
    }
  },
  pdfId: {
    type: String,
    default: ''
  }
})
async function handleChangeOption(optionId, title) {
  useChangeOption(optionId, title, appId, isShow, checkData)
  await useUpdateOption(title.optionId, title, '', appId)
  if ((res.code == 200) & (title.titleName == '骨龄')) {
    // getOrthCheckList()
  }
} -->
</script>

<style scoped></style>
