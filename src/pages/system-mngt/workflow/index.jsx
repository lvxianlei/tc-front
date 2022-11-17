import React from "react";
const baseUrl = process.env.IFRAME_BASE_URL;
export default function Workflow() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        style={{ width: "100%", height: "100%", border: "none" }}
        src={`${baseUrl}/#/tower/engine`}
      />
    </div>
  );
}
