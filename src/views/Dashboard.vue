<template>
  <div class="dashboard">
    <RequestsList :requests-folders="requestsFoldersList" />
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import RequestsList, { RequestsFolders } from './RequestsList/RequestsList.vue'

@Options({
  components: {
    RequestsList
  }
})

export default class Dashboard extends Vue {
  // Dev only
  requestsFoldersList: RequestsFolders = [
    {
      _id: 0,
      folderName: 'Initial Folder',
      requests: [
        {
          _id: 0,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      ]
    }
  ]
}
</script>
