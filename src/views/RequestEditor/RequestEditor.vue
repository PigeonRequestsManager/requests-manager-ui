<template>
  <vue-final-modal
    v-model="showConfirm"
    name="deleteConfirmationRequestEditor"
  >
    <ConfirmLayout
      :on-cancel="closeDeleteRequestConfirm"
      :on-confirm="deleteRequest"
      :text="'Are you sure about deleting this request?'"
      :confirm="'Yes'"
      :cancel="'Cancel'"
    />
  </vue-final-modal>
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
      <button
        class="deleteButton"
        @click="openDeleteRequestConfirm"
      >
        <PhTrashSimple
          :size="24"
        />
      </button>
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
      :provided-data="editedJson"
      :update-provided-data="updateJsonObject"
    />
    <div class="actions">
      <button
        :class="{flashing: animated}"
        @animationend="animated = false"
        @click="sendRequest(request)"
      >
        Send from local client
      </button>
      <button disabled>
        Send from remote server
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
import ConfirmLayout from 'components/ConfirmLayout.vue'

const editorsDict = {
  headers: 'headers',
  body: 'body'
}

type EditorsType = keyof typeof editorsDict

const EditorsArray = Object.keys(editorsDict) as EditorsType[]

@Options({
  props: {
    request: Object as () => Request
  },
  watch: {
    request: function () {
      // On request change wipe response information
      this.response = {}
    }
  },
  components: {
    JsonEditor,
    ConfirmLayout,
    RequestResult,
    PhTrashSimple
  }
})

export default class RequestEditor extends Vue {
  showConfirm = false
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
    const result = await SendHTTPrequest(request.endpoint, request.method, 'application/json', request.data, request.headers, request.endpoint)
    this.response = result
  }

  openDeleteRequestConfirm () {
    this.$vfm.show('deleteConfirmationRequestEditor')
  }

  closeDeleteRequestConfirm () {
    this.$vfm.hide('deleteConfirmationRequestEditor')
  }

  deleteRequest () {
    this.$vfm.hide('deleteConfirmationRequestEditor')
  }
}
</script>

<style scoped lang="scss">
  @import './RequestEditor.scss';
</style>
