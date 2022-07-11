<template>
  <div class="d-flex justify-content-around">
    <nuxt-link exactActiveClass="exact-active" to="/">home</nuxt-link>
    <nuxt-link exactActiveClass="exact-active" to="/orm">orm</nuxt-link>
    <nuxt-link exactActiveClass="exact-active" to="/spExec">spExec</nuxt-link>
    <nuxt-link exactActiveClass="exact-active" to="/crud/create"
      >create</nuxt-link
    >
    <nuxt-link exactActiveClass="exact-active" to="/crud/read">read</nuxt-link>
    <nuxt-link exactActiveClass="exact-active" to="/crud/readOne"
      >readOne</nuxt-link
    >
    <nuxt-link exactActiveClass="exact-active" to="/crud/update"
      >update</nuxt-link
    >
    <nuxt-link exactActiveClass="exact-active" to="/crud/delete"
      >delete</nuxt-link
    >
  </div>
</template>

<script>
export default {}
</script>

<style>
.exact-active {
  font-size: 2rem;
}
a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  font-size: 1.2rem;
}
</style>
