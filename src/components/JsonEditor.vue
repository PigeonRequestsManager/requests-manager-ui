<template>
  <textarea
    ref="dataTextarea"
    v-model="parsedJson"
    spellcheck="false"
    @keyup="onBodyChanged($event)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { DataObject } from 'components/sharedInterfaces.ts'

@Options({
  props: {
    jsonObject: Object,
    updateJsonObject: {
      type: Function
    }
  },
  watch: {
    jsonObject: function () {
      this.parsedJson = JSON.stringify(this.jsonObject, null, 1)
    }
  }
})

export default class JsonEditor extends Vue {
  updateObject!: Function
  jsonObject!: DataObject
  parsedJson = ''
  autoFormat = true
  $refs!: {
    dataTextarea: HTMLInputElement;
  }

  updateJsonObject!: Function

  beforeMount () {
    this.parsedJson = JSON.stringify(this.jsonObject, null, 1)
  }

  onBodyChanged (e: DataObject) {
    if (this.autoFormat) {
      try {
        const lastCursorPosition: number = e.target.selectionStart
        const beforeDataObject = JSON.stringify(JSON.parse(this.parsedJson), null, 1)
        this.parsedJson = JSON.stringify(JSON.parse(this.parsedJson), null, 1)
        // Update json prop
        if (this.updateJsonObject) {
          this.updateJsonObject(JSON.parse(this.parsedJson))
        }
        if (beforeDataObject !== this.parsedJson) {
          const id = this.$refs.dataTextarea
          id.focus()
          id.setSelectionRange(lastCursorPosition - 2, lastCursorPosition - 2)
        }
      } catch (error) {
      }
    }
  }
}
</script>
