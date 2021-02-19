import express from "express";
const app = express();
import * as appRoot from 'app-root-path'
const config = require('config')
const path = require("path");

app.get("/health", function (req, res) {
  console.log({
    origin: config.get('origin'),
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    m_db_cluster: process.env.MONGO_CLUSTER,
    m_db_name: config.get('db.name'),
    r_host: process.env.REDIS_HOST,
    r_port: process.env.REDIS_PORT
  });
  res.json({
    success: true,
  });
});

app.get("/logs", function (req, res) {
  let filePath = ".." + "\\" + "access.log";
  console.log();
  res.sendFile(path.join(appRoot.path, 'access.log'));
});

module.exports = app;
