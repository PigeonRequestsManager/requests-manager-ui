<template>
  <textarea
    ref="dataTextarea"
    v-model="parsedData"
    spellcheck="false"
    @keyup="onBodyChanged($event)"
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { DataObject } from 'components/sharedInterfaces.ts'

function providedDataParser (providedData: any) {
  const dataType = typeof providedData
  if (dataType !== 'undefined') {
    switch (dataType) {
      case 'object':
        return JSON.stringify(providedData, null, 1)
      case 'string':
        return providedData
      default:
        return ''
    }
  } else {
    return ''
  }
}

@Options({
  props: {
    providedData: [Object, String],
    updateProvidedData: {
      type: Function
    }
  },
  watch: {
    providedData: function () {
      this.parsedData = providedDataParser(this.providedData)
    }
  }
})

export default class JsonEditor extends Vue {
  updateObject!: Function
  providedData!: any
  parsedData = ''
  autoFormat = true
  $refs!: {
    dataTextarea: HTMLInputElement;
  }

  updateProvidedData!: Function

  beforeMount () {
    this.parsedData = providedDataParser(this.providedData)
  }

  onBodyChanged (e: DataObject) {
    if (this.autoFormat) {
      try {
        const lastCursorPosition: number = e.target.selectionStart
        const beforeDataObject = JSON.stringify(JSON.parse(this.parsedData), null, 1)
        this.parsedData = JSON.stringify(JSON.parse(this.parsedData), null, 1)
        // Update json prop
        if (this.updateProvidedData) {
          this.updateProvidedData(JSON.parse(this.parsedData))
        }
        if (beforeDataObject !== this.parsedData) {
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
