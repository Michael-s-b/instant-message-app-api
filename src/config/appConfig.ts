import express from "express";
import { authTokenMiddleware } from "../middlewares";
const app = express();
// global middlewares
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(authTokenMiddleware); // for decoding jwt token and authenticating user

export default app;
