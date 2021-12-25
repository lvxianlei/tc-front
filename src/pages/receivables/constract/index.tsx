import React from "react"
const iframeSrc: any = {
    "development": "http://39.106.2.24:8088/link/1",
    "test": "http://39.106.2.24:8088/link/1",
    "uat": "http://39.106.2.24:8088/link/2",
}
export default function Constract(): JSX.Element {
    console.log(process.env.NODE_ENV)
    return <iframe style={{ width: "100%", height: "100%", border: "none" }} src={iframeSrc[process.env.NODE_ENV]} />
}