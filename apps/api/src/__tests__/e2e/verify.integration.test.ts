import supertest from "supertest";
import valid_OA_V3_doc from "../fixtures/OA_v3/did-signed.json";
import invalid_OA_V3_doc from "../fixtures/OA_v3/did-invalid-signed.json";
import broken_doc from "../fixtures/OA_v3/broken.json";

const API_ENDPOINT = process.env.API_ENDPOINT; // || apiUrl;
console.log(`TESTING AGAINST: ${API_ENDPOINT}\n`);
const request = supertest(API_ENDPOINT);

expect.extend({
  toContainOnlyEntriesIn(received: Array<any>, values: Array<any>) {
    const unMatchedValues = received.filter((entry) => values.includes(entry));
    const pass = unMatchedValues.length == 0;
    if (pass) {
      return {
        message: () => `expected all of ${received} to be in ${values}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected all of ${received} to be in ${values}`,
        pass: false,
      };
    }
  },
});

describe("verify", () => {
  it("should verify a valid OA document", async () => {
    await request
      .post("/credentials/verify")
      .send({
        verifiableCredential: valid_OA_V3_doc,
      })
      .expect("Content-Type", /json/)
      .expect(200) //OK
      .expect((res) => {
        console.log("\n\n");
        console.log(res.body);
        expect(res.body.data).toHaveProperty("checks");
        expect(res.body.data.checks).toContain("proof");
        console.log("\n\n");
      });
  });
  // This currently fails due to OA.
  // eslint-disable-next-line jest/no-commented-out-tests
  //it("should verify valid non-OA document", async () => {
  //  await request
  //    .post("/credentials/verify")
  //    .send({
  //      verifiableCredential: valid_simple_vc,
  //    })
  //    .expect("Content-Type", /json/)
  //    .expect(200) //OK
  //    .expect((res) => {
  //      console.log("\n\n");
  //      console.log(res.body);
  //      expect(res.body).toHaveProperty("checks");
  //      expect(res.body.checks).toContain("proof");
  //      console.log("\n\n");
  //    });
  //});
  it("should give BadRequest if given a non-valid VC", async () => {
    await request
      .post("/credentials/verify")
      .send({
        verifiableCredential: broken_doc,
      })
      .expect("Content-Type", /json/)
      .expect(400) //BadRequest response
      .expect((res) => {
        expect(res.body.data).toHaveProperty("errors");
        expect(res.body.data.errors).toContain("proof");
      });
  });
  it("should fail to validate a doc with fiddled signature", async () => {
    await request
      .post("/credentials/verify")
      .send({
        verifiableCredential: invalid_OA_V3_doc,
      })
      .expect("Content-Type", /json/)
      .expect(400) // BAD REQUEST
      .expect((res) => {
        expect(res.body.data).toHaveProperty("errors");
        expect(res.body.data.errors).toContain("proof");
      });
  });
});
