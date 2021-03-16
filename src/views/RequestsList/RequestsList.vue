<template>
  <vue-final-modal
    v-model="showConfirm"
    name="deleteConfirmationRequestsList"
  >
    <ConfirmLayout
      :on-cancel="closeDeleteFolderConfirm"
      :on-confirm="deleteFolder"
      :text="'Are you sure about deleting this folder?'"
      :confirm="'Yes'"
      :cancel="'Cancel'"
    />
  </vue-final-modal>
  <div class="requestsListDisplay">
    <h2>
      Requests
    </h2>
    <div class="searchBox">
      <input
        v-model.trim="textToSearch"
        placeholder="Search requests and [Categories]"
        type="text"
        @keyup="checkWhatToSearch"
      >
      <button
        v-if="textToSearch.length > 0"
        @click="()=>{textToSearch = ''}"
      >
        <PhX
          :size="21"
        />
      </button>
    </div>
    <div class="foldersList">
      <button
        v-if="textToSearch.length === 0"
        @click="addNewFolder"
      >
        Add new folder
      </button>
      <p v-if="textToSearch.length > 0">
        {{ typeToSearch === 'request' ? 'Matching requests results:' : 'Matching folder results:' }}
      </p>
      <p
        v-if="
          textToSearch.length > 0 && typeToSearch === 'request' &&
            requestsFolders.flatMap((folder)=>{
              return folder.requests.filter((request) => {
                return request.endpoint.includes(textToSearch)
              })
            }).length === 0
            ||
            typeToSearch === 'folder' &&
            textToSearch.length >= 3 &&
            requestsFolders.filter((folder)=>{
              return folder.folderName.includes(textToSearch.substring(1, textToSearch.length - 1))
            }).length === 0
        "
        class="notfound"
      >
        Did not find anything 😞
      </p>
      <ul>
        <li
          v-for="(folder, index) in requestsFolders"
          :key="index"
        >
          <div
            v-if="
              textToSearch.length > 0 && typeToSearch === 'request' &&
                folder.requests.filter((request) => {
                  return request.endpoint.includes(textToSearch)
                }).length > 0
                ||
                textToSearch.length >= 3 &&
                typeToSearch === 'folder' && folder.folderName.includes(textToSearch.substring(1, textToSearch.length - 1))
                ||
                textToSearch.length === 0
            "
            class="folder"
          >
            <div class="folderName">
              <input
                v-model="folder.folderName"
                type="text"
              >
              <button
                class="folderPoint"
                @click="toggleFolder(folder._id)"
              >
                <PhCaretDown
                  v-show="!foldedFolders.includes(folder._id)"
                  :size="17"
                />
                <PhCaretRight
                  v-show="foldedFolders.includes(folder._id)"
                  :size="17"
                />
              </button>
              <button
                style="margin-right: 30px"
                @click="openDeleteFolderConfirm(folder._id)"
              >
                <PhTrashSimple
                  :size="24"
                />
              </button>
            </div>
            <hr>
          </div>
          <ul
            v-if="!foldedFolders.includes(folder._id)"
            class="requestsList"
          >
            <!-- Add new request -->
            <div
              v-if="folder.requests.filter((request) => {
                return request.endpoint.includes(textToSearch)
              }).length > 0"
              class="request"
            >
              <button
                @click="addNewRequest(folder._id)"
              >
                Add new request
              </button>
            </div>
            <draggable
              v-model="folder.requests"
              group="people"
              item-key="id"
              @start="drag=true"
              @end="drag=false"
              @change="moveRequest"
            >
              <template
                #item="{element}"
                class="request"
              >
                <div
                  v-if="
                    textToSearch.length > 0 && typeToSearch === 'request' &&
                      element.endpoint.includes(textToSearch)
                      ||
                      textToSearch.length >= 3 &&
                      typeToSearch === 'folder' && folder.folderName.includes(textToSearch.substring(1, textToSearch.length - 1))
                      ||
                      textToSearch.length === 0
                  "
                  class="request"
                >
                  <div class="method">
                    {{ element.method }}:
                  </div>
                  <div
                    class="endpoint"
                  >
                    {{ element.endpoint.substring(0,23) }}
                  </div>
                  <button
                    class="requestPoint"
                    @click="selectRequest(element)"
                  >
                    <PhCaretRight
                      :size="15"
                    />
                  </button>
                  <hr>
                </div>
              </template>
            </draggable>
          </ul>
        </li>
      </ul>
    </div>
    <hr>
  </div>
  <RequestEditor
    :request="editedRequest"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import draggable from 'vuedraggable'
import RequestEditor from 'views/RequestEditor/RequestEditor.vue'
import { Request } from 'components/sharedInterfaces'
import { PhCaretRight, PhCaretDown, PhTrashSimple, PhX } from 'phosphor-vue3'
import ConfirmLayout from 'components/ConfirmLayout.vue'

export type RequestsFolders = Array<
  {
  _id: number;
  folderName: string;
  requests: Array<Request>;
  }
  >

@Options({
  props: {
    changeEditedRequest: Function,
    requestsFolders: Array
  },
  components: {
    draggable,
    RequestEditor,
    ConfirmLayout,
    PhCaretRight,
    PhCaretDown,
    PhTrashSimple,
    PhX
  }
})

export default class RequestsList extends Vue {
  requestsFolders!: RequestsFolders
  changeEditedRequest!: Function
  showConfirm = false
  textToSearch = ''
  typeToSearch: 'request' | 'folder' = 'request'
  editedRequest: Request = this.requestsFolders[0].requests[0]
  foldedFolders: Array<number> = []

  private moveRequest () {
    console.log('Moved request')
  }

  private selectRequest (request: Request) {
    this.editedRequest = request
  }

  private toggleFolder (folderId: number) {
    if (this.foldedFolders.includes(folderId)) {
      this.foldedFolders = this.foldedFolders.filter(id => id !== folderId)
    } else {
      this.foldedFolders.push(folderId)
    }
  }

  private checkWhatToSearch () {
    const firstChar = this.textToSearch[0]
    const lastChar = this.textToSearch[this.textToSearch.length - 1]
    if (this.textToSearch.length >= 3 && firstChar === '[' && lastChar === ']') {
      this.typeToSearch = 'folder'
    } else {
      this.typeToSearch = 'request'
    }
  }

  addNewRequest (folderId: number) {
    const folderIndex = this.requestsFolders.map(folder => folder._id).indexOf(folderId)
    const lastRequestId = Math.max(...this.requestsFolders[folderIndex].requests.map(request => request._id), 0)
    this.requestsFolders[folderIndex].requests.push({ _id: lastRequestId + 1, endpoint: 'endpoint', method: 'GET' })
    const requestsLastElement = this.requestsFolders[folderIndex].requests.length - 1
    this.selectRequest(this.requestsFolders[folderIndex].requests[requestsLastElement])
  }

  addNewFolder () {
    const lastId = Math.max(...this.requestsFolders.map(folder => folder._id), 0)
    this.requestsFolders.push({ _id: lastId + 1, folderName: 'New folder', requests: [{ _id: 0, endpoint: 'Initial request', method: 'POST' }] })
  }

  openDeleteFolderConfirm () {
    this.$vfm.show('deleteConfirmationRequestsList')
  }

  closeDeleteFolderConfirm () {
    this.$vfm.hide('deleteConfirmationRequestsList')
  }

  deleteFolder () {
    this.$vfm.hide('deleteConfirmationRequestsList')
  }
}
</script>

<style scoped lang="scss">
  @import '~@/styles/colors.scss';
  @import './RequestsList.scss';
</style>
