import {init} from "./script.js";

init()
  .then(() => {
    console.log('Init completed successfully');
  })
  .catch((error) => {
    console.error('An error occurred during init:', error);
  });
