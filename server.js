const app = require("./app");
require("./utilities/cleaner");

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`server is running on port ${port}. app name: crypto`);
});
