<template>
  <v-container>
    <h1>Welcome to GigFM</h1>
    <v-divider></v-divider>
    <section class="mt-5">
      <p>GigFM helps you control versions of your project.</p>
      <p>Has your project ever looked like this?</p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-1.png')"
          max-width="300"
          max-height="200"
          contain
        ></v-img>
      </p>
      <p>That's stupid, stop doing it. With GigFM, your project will simply be:</p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-2.png')"
          max-width="300"
          max-height="200"
          contain
        ></v-img>
      </p>
      <p>
        Then, inside GigFM<span v-if="!$vuetify.theme.dark"> (yes we have dark mode)</span>:
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-3.png')"
          max-width="500"
          max-height="500"
          contain
          class="add-border"
        ></v-img>
      </p>
      <p>
        After making any changes, click "Commit" button to record another version of your project:
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-7.png')"
          max-width="500"
          max-height="500"
          contain
        ></v-img>
      </p>
      <p>
        Want to compare between "Update: add reverb" and "Final mix"? <br> You can "Checkout" any version,
        and then your entire project folder will be exactly like it was at that point in time
        <span class="caption">(still think time travel is impossible?).</span>
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-4.png')"
          max-width="500"
          max-height="500"
          contain
          class="add-border"
        ></v-img>
      </p>
      <p>
        Look around and make comparison, after that, just checkout to the most recent version and continue working.
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-5.png')"
          max-width="500"
          max-height="500"
          contain
          class="add-border"
        ></v-img>
      </p>
      <blockquote class="blockquote">
        <strong>Warning!</strong> Don't make any changes to your project while you're checking out past version.
        Basic rule when time travelling: <strong>Don't alter the past!</strong>
      </blockquote>
      <p>
        After comparing "Update: add reverb" and "Final mix", you realize that the reverb you added was shit. <br>
        You want to go back to "Final mix" and move forward from there. <br>
        What you need is "Reset to this version":
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-6.png')"
          max-width="500"
          max-height="500"
          contain
          class="add-border"
        ></v-img>
      </p>
      <blockquote class="blockquote">
        <strong>Warning!</strong> By resetting to "Final mix", you lose changes made in "Update: add reverb"
        <strong>permanently</strong>. Think twice before clicking the confirm button.
      </blockquote>
      <p>
        <strong>Important!</strong> You may (or may not) see a folder called ".git" created inside your project. <br>
        GigFM need this folder to work, <strong>don't delete it</strong>.
      </p>
      <p>
        <v-img
          :src="require('@/assets/intro-img-8.png')"
          max-width="300"
          max-height="200"
          contain
          class="add-border"
        ></v-img>
      </p>
      <p>
        That's it, now click "New repo" and start version controlling your project
        {{ randomHappyEmoji() }}.
      </p>
    </section>
    <section>
      <p class="caption">Made by <strong>TtheTtruth</strong> with lots of passion.</p>
    </section>
  </v-container>
</template>

<script>
import { randomHappyEmoji } from '@/utils/message.js'

export default {
  name: 'Home',
  methods: {
    randomHappyEmoji
  }
}
</script>

<style scoped>
.add-border {
  border: 1px solid grey;
}
</style>
