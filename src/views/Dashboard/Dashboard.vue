<template>
  <div>
    <RequestsList
      :requests-folders="requestsFoldersList"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import RequestsList, { RequestsFolders } from 'views/RequestsList/RequestsList.vue'

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
        },
        {
          _id: 1,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      ]
    },
    {
      _id: 1,
      folderName: 'Second Folder',
      requests: [
        {
          _id: 2,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        },
        {
          _id: 3,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      ]
    },
    {
      _id: 2,
      folderName: 'Second Folder',
      requests: [
        {
          _id: 4,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        },
        {
          _id: 5,
          endpoint: 'http://192.168.1.1/api/endpoint',
          headers: { 'Content-Type': 'application/json' },
          method: 'GET'
        }
      ]
    }
  ]
}
</script>
