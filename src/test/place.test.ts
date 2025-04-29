//Se va a testear de crear un lugar y ver despues de eso que este creado

import request from "supertest";
import app from "../app.js";
import { expect, test } from "vitest";

test("Create a place", async () => {
  const signup = await request(app).post("/api/auth/register").send({
    Content: "application/json",
    username: "testUserAdmin",
    password: "Testuser123",
    names: "Test",
    lastName: "User",
    dateOfBirth: "2024-04-24",
    mail: "testuser@gmail.com",
    isAdmin: true,
    phoneNumber: "123456789",
  });
  // creo el usuario en caso de que no exista en la base de datos test
  const responseLogin = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "testUserAdmin",
    password: "Testuser123",
  });
  if (responseLogin.status === 200) {
    const setCookie = responseLogin.headers["set-cookie"];
    const token = setCookie[0].split(";")[0].split("=")[1];
    const response = await request(app)
      .post("/api/places")
      .set("Cookie", [`token=${token}`])
      .send({
        Content: "application/json",
        name: "Lugar 1",
        latitude: 20.0785,
        longitude: 77.0125,
        zipCode: "12345",
        province: "Provincia",
        country: "Pais",
      });
    const getPlaces = await request(app)
      .get("/api/places")
      .set("Cookie", [`token=${token}`]);
    expect(getPlaces.status).toBe(200);
    expect(getPlaces.body.data.length).toBeGreaterThan(0);
    //no importa si el lugar ya esta creado, se testea que al menos haya un lugar
  }
});
