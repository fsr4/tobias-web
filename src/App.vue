<template>
  <main>
    <router-view/>
  </main>
</template>

<style lang="scss">
:root {
  --color-main: #252223;
  --color-background: #f2f2f2;
  --color-offset: #dadada;
}

html {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-background);
  color: var(--color-main);
  scroll-behavior: smooth;
}

body {
  margin: 0;
}

#app {
  max-width: 650px;
  margin: 1em auto;
}

@media screen and (prefers-color-scheme: dark) {
  :root {
    --color-main: #f2f2f2;
    --color-background: #252223;
    --color-offset: #3d3a3b;
  }
}
</style>
