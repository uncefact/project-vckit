import supertest from "supertest";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import simple_unsigned_cred from "../fixtures/generic_VC/degree_unsigned.json"; //Used in failing test
import unsigned_OA_V3 from "../fixtures/OA_v3/did.json";
import already_signed_OA_V3 from "../fixtures/OA_v3/did-signed.json";
import broken_doc from "../fixtures/OA_v3/broken.json";

const API_ENDPOINT = process.env.API_ENDPOINT;
console.log(`TESTING AGAINST: ${API_ENDPOINT}\n`);
const request = supertest(API_ENDPOINT);

describe("issue", () => {
  it("should sign a valid OA V3 document with default arguments", async () => {
    await request
      .post("/credentials/test/issue")
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
      .send({
        credential: unsigned_OA_V3,
      })
      .expect("Content-Type", /json/)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("proof");
        expect(res.body).toHaveProperty("credentialSubject");
      });
  });
  //currently fails due to OA's lack of support for arbitrary VCs
  // eslint-disable-next-line jest/no-commented-out-tests
  //it("should sign a standard W3C VC with default arguments", async () => {
  //  await request
  //    .post("/credentials/issue")
  //    .set("Content-Type", "application/json")
  //    .set("Accept", "application/json")
  //    .send({
  //      credential: simple_unsigned_cred,
  //    })
  //    .expect("Content-Type", /json/)
  //    .expect(201)
  //    .expect((res) => {
  //      expect(res.body).toHaveProperty("proof");
  //    });
  //});
  // eslint-disable-next-line jest/expect-expect
  it("should throw an error on an already signed credential?", async () => {
    await request
      .post("/credentials/test/issue")
      .send({
        credential: already_signed_OA_V3,
      })
      .expect(400);
    //Lint complains of no assertions- but aren't we asserting statusCode=400?
  });
  // eslint-disable-next-line jest/expect-expect
  it("should throw an error on an invalid credential", async () => {
    await request
      .post("/credentials/test/issue")
      .send({
        credential: broken_doc,
      })
      .expect(400);
  });
});
