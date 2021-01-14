<template>
  <div class="App">
    <div class="navigationBar">
      <div class="logoBanner">
        <h1>Pigeon<span class="octicon octicon-mail" /></h1>
      </div>
      <nav>
        <router-link
          v-for="(link, index) in routes"
          :key="index"
          :to="link.to"
        >
          <button v-if="guard(link.afterAuth)">
            <div>
              {{ link.name }}
            </div>
          </button>
        </router-link>
      </nav>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component'
import Cookies from 'universal-cookie'

export default class App extends Vue {
  beforeCreate () {
    document.body.className = 'body'
  }

  private guard (afterAuth: boolean) {
    const cookies = new Cookies()
    const token: boolean = cookies.get('authToken')
    if (afterAuth) {
      if (token) {
        return true
      } else {
        return false
      }
    } else {
      if (!token) {
        return true
      }
    }
  }

  routes: Array<{to: string; name: string; afterAuth: boolean}> = [
    {
      to: '/',
      name: 'Login',
      afterAuth: false
    },
    {
      to: '/dashboard',
      name: 'Dashboard',
      afterAuth: true
    },
    {
      to: '/account',
      name: 'Account',
      afterAuth: true
    }
  ]
}
</script>

<style lang="scss">
@import '~@/styles/_colors';
@import '~@/styles/inputs';
@import '~@/styles/forms';
@import '~@/styles/navigation';

.body{
  @import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500&display=swap");
  padding: 0;
  margin: 0;
  color: $primary;
  background: $background;
}

#app {
  font-family: 'Work Sans', sans-serif;
  font-weight: 300;
  font-size: 20px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
