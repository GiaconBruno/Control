export default {
  auth() {
    try {
      let auth = JSON.parse(localStorage.getItem("auth"));
      if (auth.id && auth.token) {
        return auth;
      }
    } catch {
      return false;
    }
  }
}