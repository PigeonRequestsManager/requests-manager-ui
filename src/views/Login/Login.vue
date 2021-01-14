<template>
  <div class="login">
    <h1>Login</h1>
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
        <button>Login</button>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import Cookies from 'universal-cookie'

import * as Yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'

import SendHTTPrequest from 'api'

@Options({
  components: {
    Form,
    Field,
    ErrorMessage
  }
})

export default class Login extends Vue {
  showModal = false

  schema = {
    fields: [
      {
        label: 'Email',
        name: 'email',
        as: 'input'
      },
      {
        label: 'Password',
        name: 'password',
        as: 'input'
      }
    ],
    validation: Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().min(8).required()
    }),
    values: {
      email: '',
      password: ''
    }
  }

  private async onLogin (values: {}) {
    // Login to local PigeonAPI
    const result = await SendHTTPrequest('user_session', 'POST', 'application/json', values)
    if (result.status === 201) {
      const cookies = new Cookies()
      cookies.set('authToken', result.data.session_token, { path: '/' })
      this.$router.push('Dashboard')
    }
  }
}
</script>

<style scoped lang="scss">
.login{
  text-align: center;
}
</style>
