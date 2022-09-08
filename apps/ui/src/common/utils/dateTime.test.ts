import { formatTime } from "./dateTime";

describe("DateTime", () => {
  it("should render time to default Asia/Singapore timezone correctly", () => {
    const time = formatTime("2021-03-19T07:00:00.000Z", "HH:mm");
    expect(time).toBe("15:00");
  });

  it("should render time to default GMT correctly", () => {
    const time = formatTime("2021-03-19T07:00:00.000Z", "zzz");
    expect(time).toBe("GMT+8");
  });

  it("should render time to custom America/New_York timezone correctly", () => {
    const time = formatTime("2021-03-19T07:00:00.000Z", "HH:mm", "America/New_York");
    expect(time).toBe("03:00");
  });
});
