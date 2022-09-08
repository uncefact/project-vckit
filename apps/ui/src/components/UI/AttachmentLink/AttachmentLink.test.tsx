import React from "react";
import { render } from "@testing-library/react";
import { AttachmentLink } from "./AttachmentLink";

const sampleData = `eyJ2ZXJzaW9uIjoiaHR0cHM6Ly9zY2hlbWEub3BlbmF0dGVzdGF0aW9uLmNvbS8yLjAvc2NoZW1hLmpzb24iLCJkYXRhIjp7InNoaXBwZXIiOnsiYWRkcmVzcyI6e319LCJjb25zaWduZWUiOnt9LCJub3RpZnlQYXJ0eSI6e30sIiR0ZW1wbGF0ZSI6eyJ0eXBlIjoiYzRkNDVkNTktZjJjOS00OGJhLWI2MzMtNzBiNTg0N2QzN2IzOnN0cmluZzpFTUJFRERFRF9SRU5ERVJFUiIsIm5hbWUiOiJlZmM0ZWQ3Zi05MDZmLTRkOWUtOTgxYi1mMmE3MThmZDExYzQ6c3RyaW5nOkJJTExfT0ZfTEFESU5HIiwidXJsIjoiODZmOGQzMWQtY2YxMC00N2RhLTg3NTYtZTNmZGRkNzkxZDYyOnN0cmluZzpodHRwczovL2RlbW8tY25tLm9wZW5hdHRlc3RhdGlvbi5jb20ifSwiaXNzdWVycyI6W3siaWRlbnRpdHlQcm9vZiI6eyJ0eXBlIjoiNmE3NzA1ZjMtMzBjZi00NjZhLTg1OTUtZmExMjk5ZjQ4Y2RlOnN0cmluZzpETlMtVFhUIiwibG9jYXRpb24iOiJiZmFlNGU2Ni1jZWZjLTRhYzgtODk1YS0zZWJjNzkxOWNhYzY6c3RyaW5nOmRlbW8tdHJhZGV0cnVzdC5vcGVuYXR0ZXN0YXRpb24uY29tIn0sIm5hbWUiOiJmYTNmMTc3MC05M2YzLTRlYTAtODczNC0wMGIwOWQxZDM5ODA6c3RyaW5nOkRFTU8gU1RPUkUiLCJ0b2tlblJlZ2lzdHJ5IjoiMjYxNWMzZTMtYWU4Ni00MjJlLTg0ZjQtZTNiYjhhMTFmYzZlOnN0cmluZzoweDU5YjY4MzgwRWY2MDRjMTFDNDkxMTVCNEU4MjkwQkM4YzM1NDQyNTQifV0sIm5hbWUiOiI1OGEyNzQxNC1lZWMzLTRkYzAtOTkzYi1mMWEyYjUxNDE4OTg6c3RyaW5nOk1hZXJzayBCaWxsIG9mIExhZGluZyIsImJsTnVtYmVyIjoiMzk4YTUwNjYtZGQ1Ni00ZmUzLWJkNzgtOGZhMGI4ZTliZDI5OnN0cmluZzoxMjMiLCJsaW5rcyI6eyJzZWxmIjp7ImhyZWYiOiIxNGQ0NTJjMi1hNDRiLTRkNDktOTI0ZS1iZDVkMTI0M2M2ODg6c3RyaW5nOmh0dHBzOi8vYWN0aW9uLm9wZW5hdHRlc3RhdGlvbi5jb20vP3E9JTdCJTIydHlwZSUyMiUzQSUyMkRPQ1VNRU5UJTIyJTJDJTIycGF5bG9hZCUyMiUzQSU3QiUyMnVyaSUyMiUzQSUyMmh0dHBzJTNBJTJGJTJGYXBpLXJvcHN0ZW4udHJhZGV0cnVzdC5pbyUyRnN0b3JhZ2UlMkYzYTgxZjM5OS1iZGU1LTRmMWYtYjM2MS00ZDEyN2FkZmYzYjMlMjIlMkMlMjJrZXklMjIlM0ElMjJkMTM5ZjE5NmQ3NjQ5MmExZTViMmI3MGQ3OTNlNTUyY2E0ZTRkMjgxZmY0YmQ4ZDQyNzg3NDE5NWQwMDg0ZTNkJTIyJTJDJTIycGVybWl0dGVkQWN0aW9ucyUyMiUzQSU1QiUyMlNUT1JFJTIyJTVEJTJDJTIycmVkaXJlY3QlMjIlM0ElMjJodHRwcyUzQSUyRiUyRmRldi50cmFkZXRydXN0LmlvJTJGJTIyJTdEJTdEIn19fSwic2lnbmF0dXJlIjp7InR5cGUiOiJTSEEzTWVya2xlUHJvb2YiLCJ0YXJnZXRIYXNoIjoiMmI2OGY5Y2Y2ZTYyNGJjYzQxODE4NTQxYWQwZDc4MTgzYTU3N2UyYTY3YTg0MDU3ZDU5MzZhMzU1MWIwNWFmNSIsInByb29mIjpbXSwibWVya2xlUm9vdCI6IjJiNjhmOWNmNmU2MjRiY2M0MTgxODU0MWFkMGQ3ODE4M2E1NzdlMmE2N2E4NDA1N2Q1OTM2YTM1NTFiMDVhZjUifX0=`;

describe("AttachmentLink", () => {
  it("should render filename correctly", () => {
    const container = render(<AttachmentLink filename="TradeTrust Tech Webinar 2.pdf" data={sampleData} />);
    expect(container.getByText("TradeTrust Tech Webinar 2.pdf")).not.toBeNull();
  });

  it("should render download link with base64 correctly", () => {
    const container = render(
      <AttachmentLink filename="TradeTrust Tech Webinar 2.pdf" data={`123`} type="application/pdf" />
    );
    expect(container.getByText("Download")).not.toBeNull();
  });

  it("should render open link with base64 correctly if tt file", () => {
    const container = render(
      <AttachmentLink filename="document.tt" data={sampleData} type="application/octet-stream" />
    );
    expect(container.getByText("Download")).not.toBeNull();
    expect(container.getByText("Open")).not.toBeNull();
  });

  it("should render a uploaded pdf file correctly", () => {
    const container = render(<AttachmentLink filename="asdfdfs.pdf" data="asdfasdf" type="application/pdf" />);
    expect(container.queryByText("asdfdfs.pdf")).not.toBeNull();
    expect(container.queryByText("(6 B)")).not.toBeNull();
    expect(container.getByText("Download")).not.toBeNull();
  });

  it("should render a uploaded file icons correctly", () => {
    const container = render(
      <>
        <AttachmentLink filename="asdfdfs.pdf" data="asdfasdf" type="application/pdf" />
        <AttachmentLink filename="asdfdfs.csv" data="asdfasdf" type="text/csv" />
        <AttachmentLink filename="asdfdfs.xls" data="asdfasdf" type="application/vnd.ms-excel" />
        <AttachmentLink
          filename="asdfdfs.xlsx"
          data="asdfasdf"
          type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        />
        <AttachmentLink filename="asdfdfs.txt" data="asdfasdf" type="text/plain" />
        <AttachmentLink
          filename="asdfdfs.docx"
          data="asdfasdf"
          type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
        <AttachmentLink filename="asdfdfs.doc" data="asdfasdf" type="application/msword" />
        <AttachmentLink filename="asdfdfs.jpg" data="asdfasdf" type="image/jpeg" />
        <AttachmentLink filename="asdfdfs.png" data="asdfasdf" type="image/png" />
        <AttachmentLink filename="asdfdfs.json" data="asdfasdf" type="application/json" />
      </>
    );
    expect(container.queryByTestId("attachment-icon-pdf")).not.toBeNull();
    expect(container.getAllByTestId("attachment-icon-csv")).toHaveLength(3);
    expect(container.queryByTestId("attachment-icon-txt")).not.toBeNull();
    expect(container.getAllByTestId("attachment-icon-doc")).toHaveLength(2);
    expect(container.queryByTestId("attachment-icon-jpg")).not.toBeNull();
    expect(container.queryByTestId("attachment-icon-png")).not.toBeNull();
    expect(container.queryByTestId("attachment-icon-paperclip")).not.toBeNull();
  });
});
