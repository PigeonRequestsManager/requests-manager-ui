<template>
  <div class="editor">
    <div>
      <h2 style="padding: 10px">
        Requests
      </h2>
      <div class="foldersList">
        <button
          @click="addNewFolder"
        >
          Add new folder
        </button>
        <ul>
          <li
            v-for="(folder, index) in requestsFolders"
            :key="index"
          >
            <div class="folder">
              <div class="folderName">
                <input
                  v-model="folder.folderName"
                  type="text"
                >
                <button @click="toggleFolder(folder._id)">
                  <PhCaretDown
                    v-show="!foldedFolders.includes(folder._id)"
                    :size="17"
                  />
                  <PhCaretRight
                    v-show="foldedFolders.includes(folder._id)"
                    :size="17"
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
              <div class="request">
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
                  <div class="request">
                    <div class="method">
                      {{ element.method }}:
                    </div>
                    <div class="endpoint">
                      {{ element.endpoint.substring(0,23) }}
                    </div>
                    <button
                      class="point"
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
    <RequestEditor :request="editedRequest" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import draggable from 'vuedraggable'
import RequestEditor from 'views/RequestEditor/RequestEditor.vue'
import { Request } from 'components/sharedInterfaces.ts'
import { PhCaretRight, PhCaretDown } from 'phosphor-vue3'
type RequestInFolders = {_id: number} & Request
export type RequestsFolders = Array<
  {
  _id: number;
  folderName: string;
  requests: Array<RequestInFolders>;
  }
  >

@Options({
  props: {
    requestsFolders: Array
  },
  components: {
    draggable,
    RequestEditor,
    PhCaretRight,
    PhCaretDown
  }
})

export default class RequestsList extends Vue {
  requestsFolders!: RequestsFolders
  editedRequest: Request = this.requestsFolders[0].requests[0]
  foldedFolders: Array<number> = []

  private moveRequest () {
    console.log('Przeniesiono')
  }

  private selectRequest (request: Request) {
    this.editedRequest = request
  }

  private toggleFolder (folderId: number) {
    if (this.foldedFolders.includes(folderId)) {
      this.foldedFolders = this.foldedFolders.filter(id => id !== folderId)
    } else {
      console.log('pushed', folderId)

      this.foldedFolders.push(folderId)
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
}
</script>

<style scoped lang="scss">
  @import './RequestsList.scss';
  .editor {
    display: flex;
  }
</style>
