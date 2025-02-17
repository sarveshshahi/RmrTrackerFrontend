<template>
  <footer class="footer">
    <div class="footer__text center">© 2023 DS Group. All rights reserved.</div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #090a0a;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.footer__text {
  font-size: 14px;
  margin: 0;
  color: #c5c5c5;
  text-align: center;
}
.center {
  margin: auto;
  width: 50%;
}
</style>

<script>
export default {
  data() {
    return {
      year: new Date().getFullYear(), 
    };
  },
};
</script>
