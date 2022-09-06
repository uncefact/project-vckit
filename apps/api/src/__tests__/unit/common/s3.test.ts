import { get, put, getObjectHead, s3bucket } from "../../../common/services/s3";

const promiseMock = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn(() => {
      return {
        upload: jest.fn(() => ({
          promise: promiseMock,
        })),
        getObject: jest.fn(() => ({
          promise: promiseMock,
        })),
        headObject: jest.fn(() => ({
          promise: promiseMock,
        })),
      };
    }),
  };
});

const headObjectSuccessResponse = {
  AcceptRanges: "test",
  LastModified: "test",
  ContentLength: "test",
  ETag: "test",
  ContentType: "test",
  Metadata: {},
};

const s3Params = { Bucket: "", Key: "" };

describe("test s3 getObject", () => {
  it("should return expected object", async () => {
    promiseMock.mockResolvedValueOnce({
      Body: JSON.stringify({ data: "test" }),
    });
    const testGetObject = await get(s3Params);
    expect(testGetObject.data).toBe("test");
  });

  it("should throw an error when the response is empty", async () => {
    promiseMock.mockResolvedValueOnce({});
    await expect(get(s3Params)).rejects.toThrow("No Document Found");
  });

  it("should throw an error when the document key doesn't exist", async () => {
    promiseMock.mockRejectedValueOnce(
      new Error("The specified key does not exist.")
    );
    await expect(get(s3Params)).rejects.toThrow("No Document Found");
  });
});

describe("test s3 upload", () => {
  it("should call upload with the expected params", async () => {
    promiseMock.mockResolvedValueOnce({
      Location: "testUploadLocation",
      Bucket: "testUploadBucket",
      Key: "testUploadKey",
      ETag: "testUploadETag",
    });
    await put(s3Params);
    expect(s3bucket.upload).toBeCalledWith(s3Params);
  });
});

describe("test s3 getObjectHead", () => {
  it("should return an object if it exists", async () => {
    promiseMock.mockResolvedValueOnce(headObjectSuccessResponse);
    const objectHead = await getObjectHead(s3Params);
    expect(objectHead).toEqual(headObjectSuccessResponse);
  });

  it("should throw error if somthing goes wrong", async () => {
    promiseMock.mockRejectedValueOnce(new Error("test"));
    await expect(getObjectHead(s3Params)).rejects.toThrowError();
  });

  it("should return null if the object isn't found", async () => {
    promiseMock.mockRejectedValueOnce({ code: "NotFound" });
    const objectHead = await getObjectHead(s3Params);
    expect(objectHead).toBeNull();
  });
});
