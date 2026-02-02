const { BASE_URL } = require("./getEnv");

setInterval(() => {
  fetch(BASE_URL)
    .then(() => console.info("wake up bro"))
    .catch((e) => console.error("keep alive err: ", e));
}, 15 * 60 * 1000);
