import request from "supertest";
import app from "../app.js";
import { expect, test } from "vitest";

test("POST/ preferences", async () => {
  const signup = await request(app).post("/api/auth/register").send({
    Content: "application/json",
    username: "testUserAdmin",
    password: "Testuser123",
    names: "Test",
    lastName: "User",
    dateOfBirth: "2024-04-24",
    mail: "testuseradmin@example.com",
    isAdmin: true,
    phoneNumber: "123456789",
  }); //creo el usuario admin en caso de que no exista en la bd de testing
  const login = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "testUserAdmin",
    password: "Testuser123",
  });
  const setCookie = login.headers["set-cookie"];
  const token = setCookie[0].split(";")[0].split("=")[1];

  const createPreference = await request(app)
    .post("/api/preferences")
    .set("Cookie", [`token=${token}`])
    .send({
      name: "Preferencia",
      description: "Descripcion de preferencia 1",
    });
  const getPreferences = await request(app)
    .get("/api/preferences")
    .set("Cookie", [`token=${token}`]);
  expect(getPreferences.status).toBe(200);
  expect(getPreferences.body.data.length).toBeGreaterThan(0);
});
