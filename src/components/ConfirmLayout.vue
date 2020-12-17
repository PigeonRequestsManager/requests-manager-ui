<template>
  <div class="confirmBox">
    <p>{{ text }}</p>
    <button
      ref="cancelButton"
      @click="onCancel"
    >
      {{ cancel }}
    </button>
    <button @click="onConfirm">
      {{ confirm }}
    </button>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'

@Options({
  props: {
    onConfirm: Function,
    onCancel: Function,
    text: String,
    confirm: String,
    cancel: String
  }
})
export default class ConfirmLayout extends Vue {
  onConfirm!: Function
  onCancel?: Function
  text!: string
  confirm!: string
  cancel!: string
}

</script>

<style scoped lang="scss">
  @import 'src/styles/_colors.scss';
  .confirmBox{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
    color: $primary;
    background: $background;
    max-width: 400px;
    display: inline-block;
    border: 1px solid $light_logo;
    text-align: center;
    p{
      text-align: left;
      padding: 5px 20px;
      margin-bottom: 20px;
    }
    button {
      justify-content: flex-end;
      margin-inline: 5px;
      margin-bottom: 5px;
      display: inline-block;
    }
  }
</style>
