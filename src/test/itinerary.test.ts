// itinerary.test.ts
import request from "supertest";
import app from "../app.js";
import { itineraryRouter } from "../itinerary/itinerary.routes.js";
// import { connect, closeDatabase } from "../shared/db/orm.js"; // Assuming you have DB connection utilities

describe("GET /itineraries", () => {
  test("should respond with a 200 status code", async () => {
    const login = await request(app).post("/api/auth/login").send({
      username: "vitto1889",
      password: "Vitto123",
    });
    const token = login.body.token;
    const response = await request(app)
      .get("/api/itineraries")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);

    console.log(response, "response");
  });

  //   beforeAll(async () => {
  //     await connect(); // Connect to your test DB (can be in-memory)
  //   });

  //   afterAll(async () => {
  //     await closeDatabase(); // Close DB connection
  //   });

  // it("should return a list of itineraries", async () => {
  //   const response = await request(app).get("/itineraries");
  //   expect(response.status).toBe(200);
  //   expect(response.body).toBeInstanceOf(Array); // Assumes response is an array
  // });

  // it("should return 404 for a non-existent itinerary", async () => {
  //   const response = await request(app).get("/itineraries/999");
  //   expect(response.status).toBe(404);
  // });
});
