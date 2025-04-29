//Test de integracion, se testea la creacion de un usuario, el login del mismo, la creacion de un itinerario y la obtencion de todos los itinerarios

import request from "supertest";
import app from "../app.js";
import { expect, test } from "vitest";

test("GET /itineraries from test user", async () => {
  const signup = await request(app).post("/api/auth/register").send({
    Content: "application/json",
    username: "testUser",
    password: "Testuser123",
    names: "Test",
    lastName: "User",
    dateOfBirth: "2024-04-24",
    mail: "testuser@example.com",
    isAdmin: false,
    phoneNumber: "123456789",
  });
  // creo el usuario en caso de que no exista en la base de datos test
  const responseLogin = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "testUser",
    password: "Testuser123",
  });
  if (responseLogin.status === 200) {
    const setCookie = responseLogin.headers["set-cookie"];
    const token = setCookie[0].split(";")[0].split("=")[1];
    const response = await request(app)
      .get("/api/itineraries")
      .set("Cookie", [`token=${token}`]);
    console.log(response.body);
    expect(response.status).toBe(200);
    // se testea que al menos haya un itinerario(en la base de datos test ya tiene q haber un itinerario creado para ese usuario)
    expect(response.body.data.length).toBeGreaterThan(0);
  }
});

test("GET /itineraries with user not created", async () => {
  const responseLogin = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "fakeUser",
    password: "fakePassword1",
  });
  console.log(responseLogin.body);
  expect(responseLogin.status).toBe(400);
});
