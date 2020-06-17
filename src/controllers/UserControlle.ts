import { Request, Response } from "express";
import knex from "../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  async index(request: Request, response: Response) {
    const users = await knex("users").select("*");

    return response.json(users);
  }
  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;

    const passwordHash = await bcrypt.hash(password, 8);

    const user = await knex("users").insert({
      name,
      email,
      password: passwordHash,
    });

    return response.json(user);
  }

  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await knex("users").where("email", email).select("*");

    if (user.length === 1) {
      if (await bcrypt.compare(password, user[0].password)) {
        const token = jwt.sign(
          { id: user[0].id },
          String(process.env.APP_SECRET_KEY),
          {
            expiresIn: "1d",
          }
        );

        const data = {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email,
          token,
        };

        return response.json(data);
      } else {
        return response.status(404).json({ msg: "User not found" });
      }
    } else {
      return response.status(404).json({ msg: "User not found" });
    }
  }
}

export default UserController;
