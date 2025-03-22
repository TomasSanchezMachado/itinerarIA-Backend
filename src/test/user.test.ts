import request from "supertest";
import app from "../app.js";
import { test, expect } from "vitest";

test("Top-level await example", async () => {
  const response = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "facu",
    password: "1234Facu",
  });
  console.log(response.body)
  const setCookie = response.headers["set-cookie"];
  const token = setCookie[0].split(";")[0].split("=")[1];
  console.log(token);
  expect(response.status).toBe(200);
});

test("Top-level await example error", async () => {
  const response = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "usuarioNoExiste",
    password: "passwordIncorrecto",
  });
  expect(response.status).toBe(400);
});
