<template>
  <v-container>
    <h1>Help</h1>
    <span class="caption font-weight-light">I need somebody, not just anybody.</span>
    <v-divider></v-divider>
    <section class="mt-5">
      <h2>Add new repo</h2>
      <p>
        Click "New repo" button on the left. Then choose the folder containing the project you want to control version.
      </p>
      <p>
        Repos you added are listed on the left. Click one of them to view its versions.
      </p>
    </section>
    <section>
      <h2>Repo</h2>
      <p>
        A repo is a place to control versions of your project.
      </p>
      <h3>Files changed</h3>
      <p>
        Here you can see files that have been changed from your last commit.
        It includes "New files", "Changed files", and "Deleted files".
      </p>
      <h3>"Commit" button</h3>
      <p>
        Commit the current state of your project as a new version.
        You can write a commit message to describe what this version is about, what changes was made, .etc
      </p>
      <h3>Commit history</h3>
      <p>
        Here you see history of versions you've committed.
        Clicking the icon to the right will open actions menu of each version
      </p>
      <h4>Version actions</h4>
      <h5>Checkout</h5>
      <p>
        Time travel back to this version, your entire project will be exactly like it was at that point in time,
        even if that's years ago.
      </p>
      <h5>Reset to this version</h5>
      <p>
        Reset your project <strong>permanently</strong> to this version. Any other versions after it will be <strong>completely lost</strong>
        and <strong>not recoverable</strong>. Use this action with care.
      </p>
      <h5>Change message</h5>
      <p>
        Change the commit message of this version. This action is only available for the most recent version.
        Remember the rule: <strong>Don't alter the past.</strong>
      </p>
      <h3>Repo settings</h3>
      <p>Access repo settings by clicking the settings icon to the right.</p>
      <p>
        Here you can change repo name, your name and your email, so that if a commit screws up the whole project,
        everybody knows who to blame.
      </p>
    </section>
  </v-container>
</template>

<script>
export default {
  name: 'Help'
}
</script>

<style scoped>

</style>
