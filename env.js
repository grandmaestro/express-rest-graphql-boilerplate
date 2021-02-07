if (process.env.NODE_ENV == "production") {
  require('dotenv').config({
    path: './environments/.env.production'
  });
} else if (process.env.NODE_ENV == "staging") {
  require('dotenv').config({
    path: './environments/.env.staging'
  });
} else {
  require('dotenv').config({
    path: './environments/.env'
  });
}