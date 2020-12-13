<template>
  <div class="codeEditor">
    <h2>Edit request</h2>
    <!-- Method and endpoint editor -->
    <div class="editorTop">
      <label>
        <select
          v-model="request.method"
          class="method"
        >
          <option
            v-for="(method, index) in methods"
            :key="index"
            :value="method"
          >{{ method }}</option>
        </select>
      </label>
      <input
        v-model="request.endpoint"
        class="endpoint"
      >
      <PhTrashSimple
        :size="25"
        style="margin-left: 25px"
      />
    </div>
    <!-- Editors selector -->
    <button
      v-for="(editor, index) in editors"
      :key="index"
      class="editorSelector"
      :class="{ active: editor===currentEditor}"
      @click="changeEditor(editor)"
    >
      {{ editor }}
    </button>
    <!-- Actually edited json object -->
    <JsonEditor
      :json-object="editedJson"
      :update-json-object="updateJsonObject"
    />
    <div class="actions">
      <button
        :class="{flashing: animated}"
        @animationend="animated = false"
        @click="sendRequest(request)"
      >
        Send
      </button>
    </div>

    <RequestResult
      :response="response"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { DataObject, MethodsArray } from 'components/sharedInterfaces.ts'
import type { Request } from 'components/sharedInterfaces.ts'
import JsonEditor from 'components/JsonEditor.vue'
import RequestResult from 'views/RequestResult/RequestResult.vue'
import { PhTrashSimple } from 'phosphor-vue3'
import SendHTTPrequest from 'api'

const editorsDict = {
  headers: 'headers',
  body: 'body'
}

type EditorsType = keyof typeof editorsDict

const EditorsArray = Object.keys(editorsDict) as EditorsType[]

@Options({
  props: {
    request: Request
  },
  watch: {
    request: function () {
      // On request change wipe response information
      this.response = {}
    }
  },
  components: {
    JsonEditor,
    RequestResult,
    PhTrashSimple
  }
})

export default class RequestEditor extends Vue {
  currentEditor: EditorsType = 'headers'
  methods = MethodsArray
  request!: Request
  response: DataObject = {}
  editedJson!: DataObject | undefined
  editors = EditorsArray
  animated = false

  beforeMount () {
    this.currentEditor = 'headers'
    this.changeEditor(this.currentEditor)
  }

  beforeUpdate () {
    this.changeEditor(this.currentEditor)
  }

  updateJsonObject (data: DataObject) {
    switch (this.currentEditor) {
      case 'headers':
        this.request.headers = data
        break
      case 'body':
        this.request.data = data
        break
      default:
        this.request.headers = data
        break
    }
  }

  changeEditor (editor: EditorsType) {
    this.currentEditor = editor
    switch (editor) {
      case 'headers':
        this.editedJson = this.request.headers
        break
      case 'body':
        this.editedJson = this.request.data
        break
      default:
        this.editedJson = this.request.headers
        break
    }
  }

  async sendRequest (request: Request) {
    this.animated = true
    const result = await SendHTTPrequest(request.method, request.endpoint, 'application/json', request.data, request.endpoint)
    this.response = result
  }
}
</script>

<style scoped lang="scss">
  @import 'src/styles/codeEditor.scss';
  @import './RequestEditor.scss';
</style>
