<template>
  <div class="account">
    <div class="form">
      <Form
        :validation-schema="schema.validation"
        :initial-values="schema.values"
        @submit="onLogin($event, onSubmit)"
      >
        <div
          v-for="field in schema.fields"
          :key="field.name"
          class="formInput"
        >
          <label :for="field.name">{{ field.label }}</label>
          <Field
            :id="field.name"
            :as="field.as"
            :name="field.name"
            :type="field.name"
            :placeholder="field.label"
          />
          <ErrorMessage
            class="errorMessage"
            :name="field.name"
          />
        </div>
        <button>Update account</button>
      </Form>
    </div>
    <div class="otherActions">
      <button @click="logout">
        Logout
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'

import * as Yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import Cookies from 'universal-cookie'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  }
})

export default class Account extends Vue {
  schema = {
    fields: [
      {
        label: 'Email',
        name: 'email',
        as: 'input'
      },
      {
        label: 'Nickname',
        name: 'nickname',
        as: 'input'
      }
    ],
    validation: Yup.object().shape({
      email: Yup.string().email(),
      nickname: Yup.string()
    }),
    values: {
      email: '',
      nickname: ''
    }
  }

  logout () {
    const cookies = new Cookies()
    cookies.remove('authToken')
    this.$router.push('Dashboard')
  }
}
</script>

<style scoped lang="scss">
.otherActions {
  margin: 10vh 0;
  text-align: center;
}
</style>
