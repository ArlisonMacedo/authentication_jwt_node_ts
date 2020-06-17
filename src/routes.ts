import express from "express";
import UserControlle from "./controllers/UserControlle";
import Auth from "./middlewares/auth";

const routes = express.Router();

const userControlle = new UserControlle();
const auth = new Auth();

routes.post("/session", userControlle.login);

routes.use(auth.auth);
routes.get("/users", userControlle.index);
routes.post("/users", userControlle.store);

export default routes;
