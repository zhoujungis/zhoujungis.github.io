<template>
  <div class="not-found">
    <h1 class="not-found__code">404</h1>
    <p class="not-found__message">Page not found</p>
    <router-link to="/" class="not-found__link">Back to Home</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.not-found__code {
  font-size: 6rem;
  font-weight: 900;
  color: #00f0ff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2);
  margin: 0;
  line-height: 1.1;
}

.not-found__message {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 1rem 0 2rem;
}

.not-found__link {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  color: #00f0ff;
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s;
}

.not-found__link:hover {
  background: rgba(0, 240, 255, 0.08);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
}
</style>
