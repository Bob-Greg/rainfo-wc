import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";

function App() {

    const [stateInfo, setStateInfo] = useState("")
    const topBar = useRef<HTMLDivElement>(null)
    const iframe = useRef<HTMLIFrameElement>(null)

    setInterval(() => {
        if (iframe.current) {
            iframe.current.scrollTop = 120
        }
    }, 50)

    function getStateCode() {
        if (stateInfo.length > 2) {
            switch (stateInfo) {
                case "Alabama":
                    return "AL"
                case "Alaska":
                    return "AK"
                case "Arizona":
                    return "AZ"
                case "Arkansas":
                    return "AR"
                case "California":
                    return "CA"
                case "Colorado":
                    return "CO"
                case "Connecticut":
                    return "CT"
                case "Delaware":
                    return "DE"
                case "Florida":
                    return "FL"
                case "Georgia":
                    return "GA"
                case "Hawaii":
                    return "HI"
                case "Idaho":
                    return "ID"
                case "Illinois":
                    return "IL"
                case "Indiana":
                    return "IN"
                case "Iowa":
                    return "IA"
                case "Kansas":
                    return "KS"
                case "Kentucky":
                    return "KY"
                case "Louisiana":
                    return "LA"
                case "Maine":
                    return "ME"
                case "Maryland":
                    return "MD"
                case "Massachusetts":
                    return "MA"
                case "Michigan":
                    return "MI"
                case "Minnesota":
                    return "MN"
                case "Mississippi":
                    return "MS"
                case "Missouri":
                    return "MO"
                case "Montana":
                    return "MT"
                case "Nebraska":
                    return "NE"
                case "Nevada":
                    return "NV"
                case "New Hampshire":
                    return "NH"
                case "New Jersey":
                    return "NJ"
                case "New Mexico":
                    return "NM"
                case "New York":
                    return "NY"
                case "North Carolina":
                    return "NC"
                case "North Dakota":
                    return "ND"
                case "Ohio":
                    return "OH"
                case "Oklahoma":
                    return "OK"
                case "Oregon":
                    return "OR"
                case "Pennsylvania":
                    return "PA"
                case "Rhode Island":
                    return "RI"
                case "South Carolina":
                    return "SC"
                case "South Dakota":
                    return "SD"
                case "Tennessee":
                    return "TN"
                case "Texas":
                    return "TX"
                case "Utah":
                    return "UT"
                case "Vermont":
                    return "VT"
                case "Virginia":
                    return "VA"
                case "Washington":
                    return "WA"
                case "West Virginia":
                    return "WV"
                case "Wisconsin":
                    return "WI"
                case "Wyoming":
                    return "WY"
                default:
                    return "Invalid State"
            }
        } else if (stateInfo.length === 2) {
            return stateInfo
        }
        return "Invalid State"
    }

    return (
        <div className="w-screen h-screen bg-white fixed">
            <div className={"bg-blue-500 w-screen h-44 absolute -z-10"}/>
            <div
                className={"bg-white w-screen h-20 absolute -z-10"}
                style={{
                    top: window.visualViewport.height - 72
                }}
            />
            <div ref={topBar}>
                <div className={"mt-3"}/>
                <div className={"text-4xl text-sky-100 text-center"}>
                    Water Conditions
                </div>
                <div className={"mt-3"}/>
                <TextBox defaultText={"Input your state name or code here!"} className={"rounded-sm main-text-box"} onChange={str => setStateInfo(str.replace(".", "").toUpperCase())}/>
            </div>
            { getStateCode() !== "Invalid State" &&
                <div
                    onClick={(ev) => {
                        ev.stopPropagation()
                        ev.preventDefault()
                    }}
                >
                    <div
                        className={"bg-white w-screen h-14 z-10 absolute bg-sky-50"}
                        style={{
                            top: 120
                        }}
                    />
                    <iframe
                        ref={iframe}
                        title={"drought mon"}
                        className={"w-screen pointer-events-none overflow-hidden absolute"}
                        scrolling={"no"}
                        height={window.visualViewport.height - topBar.current!.offsetTop - topBar.current!.clientHeight + 36}
                        style = {{
                            top: topBar.current!.offsetTop + topBar.current!.clientHeight - 36,
                            zIndex: -15
                        }}
                        src={`https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?${getStateCode()}`}
                    />
                </div>
            }
        </div>
    );
}

export default App;
