import request from "supertest";
import app from "../app.js";
import { test, expect } from "vitest";

test("Top-level await example", async () => {
  const signup = await request(app).post("/api/auth/register").send({
    Content: "application/json",
    username: "facu",
    password: "1234Facu",
    names: "Jaminton",
    lastName: "Campaz",
    dateOfBirth: "2024-04-24",
    mail: "bichito@gmail.com",
    phoneNumber: "123456789",
    isAdmin: false,
  });
  const response = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "facu",
    password: "1234Facu",
  });
  const setCookie = response.headers["set-cookie"];
  const token = setCookie[0].split(";")[0].split("=")[1];
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
