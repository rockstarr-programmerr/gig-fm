<template>
  <div>
    <h1>Igor is urod</h1>
    <p>{{ text }}</p>
    <v-btn
      color="primary"
    >Hello</v-btn>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data: () => ({
    text: 'vadim blyat'
  })
}
</script>

<style scoped>
p {
  color: red;
}
</style>
