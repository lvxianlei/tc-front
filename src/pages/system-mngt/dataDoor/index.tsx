import React from "react";
const baseUrl = process.env.IFRAME_DATA_DOOR_URL;
export default function DataDoor() {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <iframe
                style={{ width: "100%", height: "100%", border: "none" }}
                src={`${baseUrl}`}
            />
        </div>
    );
}
