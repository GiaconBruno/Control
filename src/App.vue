<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  width: 100vw;
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  background: #093028;
  background: -webkit-linear-gradient(to bottom, #237a57, #093028);
  background: linear-gradient(to bottom, #237a57, #093028);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.overflow::-webkit-scrollbar {
  width: 5px;
}

.overflow::-moz-scrollbar {
  width: 5px;
}

.overflow::-ms-scrollbar {
  width: 5px;
}

.overflow::-o-scrollbar {
  width: 5px;
}

.overflow::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  -webkit-border-radius: 10px;
  -webkit-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
}

.overflow::-moz-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  -moz-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
  -ms-border-radius: 10px;
}

.overflow::-ms-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  -moz-border-radius: 10px;
  -ms-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
}

.overflow::-o-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  -o-border-radius: 10px;
  -o-box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.5);
}
</style>