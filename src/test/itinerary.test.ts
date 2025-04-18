import request from "supertest";
import app from "../app.js";
import { expect, test } from "vitest";

test("GET /itineraries", async () => {
  const responseLogin = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "VittoRC",
    password: "Vitto123",
  });
  console.log(responseLogin.headers, "responseLogin.headers");
  if (responseLogin.status === 200) {
    const setCookie = responseLogin.headers["set-cookie"];
    const token = setCookie[0].split(";")[0].split("=")[1];
    const response = await request(app)
      .get("/api/itineraries")
      .set("Cookie", [`token=${token}`]);
    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  }
});

test("GET /itineraries with user not created", async () => {
  const responseLogin = await request(app).post("/api/auth/login").send({
    Content: "application/json",
    username: "fakeUser",
    password: "fakePassword",
  });
  if (responseLogin.status === 200) {
    const setCookie = responseLogin.headers["set-cookie"];
    const token = setCookie[0].split(";")[0].split("=")[1];
    const response = await request(app)
      .get("/api/itineraries")
      .set("Cookie", [`token=${token}`]);
  }
  expect(responseLogin.status).toBe(400);
});
