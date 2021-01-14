<template>
  <div class="requestResult">
    <h3>Response</h3>

    <!-- Method and endpoint editor -->
    <div class="editorTop">
      <!-- Response status -->
      <!-- Response selector -->
      <button
        v-for="(editor, index) in editors"
        :key="index"
        class="editorSelector"
        :class="{ active: editor==currentEditor}"
        @click="changeEditor(editor)"
      >
        {{ editor }}
      </button>
      <p>
        Status:
        <small
          :class="{
            status2xx: response.status>=200,
            status4xx: response.status>=400,
            status5xx: response.status>=500}"
        >
          {{ response.status }}
          -
          {{ response.statusText }}
        </small>
      </p>
    </div>
    <!-- Actually shown json object -->
    <JsonEditor
      :provided-data="editedJson"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { DataObject, MethodsArray } from 'components/sharedInterfaces.ts'
import JsonEditor from 'components/JsonEditor.vue'

const editorsDict = {
  headers: 'headers',
  body: 'body'
}

type EditorsType = keyof typeof editorsDict

const EditorsArray = Object.keys(editorsDict) as EditorsType[]

@Options({
  props: {
    response: Object
  },
  components: {
    JsonEditor
  }
})

export default class RequestResult extends Vue {
  currentEditor: EditorsType = 'headers'
  methods = MethodsArray
  response!: DataObject
  editedJson!: DataObject | undefined
  editors = EditorsArray

  beforeMount () {
    this.changeEditor(this.currentEditor)
  }

  beforeUpdate () {
    this.changeEditor(this.currentEditor)
  }

  changeEditor (editor: EditorsType) {
    this.currentEditor = editor
    switch (editor) {
      case 'headers':
        this.editedJson = this.response.headers
        break
      case 'body':
        this.editedJson = this.response.data
        break
      default:
        this.editedJson = this.response.headers
        break
    }
  }
}
</script>

<style scoped lang="scss">
  @import '~@/styles/codeEditor.scss';
  .status {
    background: black;
  }
  .status2xx{
    color: green;
  }
  .status4xx{
    color: orangered;
  }
  .status5xx{
    color: red;
  }
  .editorTop {
    margin-bottom: 0 !important;
    * {
    display: inline-block;
    }
  }

  .editorSelector{
    margin-inline: 10px;
  }
</style>
