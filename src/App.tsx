import React, {createContext, CSSProperties, ReactElement, useContext, useRef, useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";
import home from './home.svg';
import raindrop from './raindrop.svg';

enum Screen {
    title, droughtMonitor, rainfallLevels, usageRecorder,  howToHelp
}

type Usage = {
    gals: number
    date: Date
    name: string
}

type GlobalState_t = {
    screen: Screen
    setScreen: (screen: Screen) => void
    location: string
    setLocation: (location: string) => void
    usages: Usage[]
    setUsages: (usages: Usage[]) => void
}

const textBoxCSS = {backgroundColor: "#aae1e9", outlineColor: "#2d213f", outlineWidth: 1, outlineStyle: "solid"} as CSSProperties

export const mapStateNameToCode = new Map([
    ["alabama", "AL"],
    ["alaska", "AK"],
    ["arizona", "AZ"],
    ["arkansas", "AR"],
    ["california", "CA"],
    ["colorado", "CO"],
    ["connecticut", "CT"],
    ["delaware", "DE"],
    ["florida", "FL"],
    ["georgia", "GA"],
    ["hawaii", "HI"],
    ["idaho", "ID"],
    ["illinois", "IL"],
    ["indiana", "IN"],
    ["iowa", "IA"],
    ["kansas", "KS"],
    ["kentucky", "KY"],
    ["louisiana", "LA"],
    ["maine", "ME"],
    ["maryland", "MD"],
    ["massachusetts", "MA"],
    ["michigan", "MI"],
    ["minnesota", "MN"],
    ["mississippi", "MS"],
    ["missouri", "MO"],
    ["montana", "MT"],
    ["nebraska", "NE"],
    ["nevada", "NV"],
    ["new hampshire", "NH"],
    ["new jersey", "NJ"],
    ["new mexico", "NM"],
    ["new york", "NY"],
    ["north carolina", "NC"],
    ["north dakota", "ND"],
    ["ohio", "OH"],
    ["oklahoma", "OK"],
    ["oregon", "OR"],
    ["pennsylvania", "PA"],
    ["rhode island", "RI"],
    ["south carolina", "SC"],
    ["south dakota", "SD"],
    ["tennessee", "TN"],
    ["texas", "TX"],
    ["utah", "UT"],
    ["vermont", "VT"],
    ["virginia", "VA"],
    ["washington", "WA"],
    ["west virginia", "WV"],
    ["wisconsin", "WI"],
    ["wyoming", "WY"]
])
export const mapStateToRainfall = new Map([
    ["alabama", 58.3],
    ["alaska", 22.5],
    ["arizona", 13.6],
    ["arkansas", 50.6],
    ["california", 22.2],
    ["colorado", 15.9],
    ["connecticut", 50.3],
    ["delaware", 45.7],
    ["florida", 54.5],
    ["georgia", 50.7],
    ["hawaii", 63.7],
    ["idaho", 18.9],
    ["illinois", 39.2],
    ["indiana", 41.7],
    ["iowa", 34.0],
    ["kansas", 28.9],
    ["kentucky", 48.9],
    ["louisiana", 60.1],
    ["maine", 42.2],
    ["maryland", 44.5],
    ["massachusetts", 47.7],
    ["michigan", 32.8],
    ["minnesota", 27.3],
    ["mississippi", 59.0],
    ["missouri", 42.2],
    ["montana", 15.3],
    ["nebraska", 23.6],
    ["nevada", 9.5],
    ["new Hampshire", 43.4],
    ["new Jersey", 47.1],
    ["new Mexico", 14.6],
    ["new York", 41.8],
    ["north Carolina", 50.3],
    ["north Dakota", 17.8],
    ["ohio", 39.1],
    ["oklahoma", 36.5],
    ["oregon", 27.4],
    ["pennsylvania", 42.9],
    ["rhode Island", 47.9],
    ["south Carolina", 49.8],
    ["south Dakota", 20.1],
    ["tennessee", 54.2],
    ["texas", 28.9],
    ["utah", 12.2],
    ["vermont", 42.7],
    ["virginia", 44.3],
    ["washington", 38.4],
    ["west Virginia", 45.2],
    ["wisconsin", 32.6],
    ["wyoming", 12.9]
])
export const globalContext = createContext({} as GlobalState_t);

const width = window.innerWidth
const height = window.innerHeight

function App() {

    const [screen, setScreen] = useState(Screen.title);
    const [location, setLocation] = useState("");
    const [usages, setUsages] = useState([] as Usage[])

    return (
        <div className={"filter1"}>
            <globalContext.Provider value={{screen, setScreen, location, setLocation, usages, setUsages}}>
                <div
                    className={"filter absolute -z-10"}
                    style={{
                        top: height / 2 - (width / 400) * 200,
                        left: width / 2 - 200,
                        width: 400,
                        height: 400
                    }}
                >
                    <img
                        src={raindrop}
                        alt={""}
                    />
                </div>
                { screen !== Screen.title && <BackButton/> }
                <div style={{color: "#2d213f"}} className={"poppins"}>
                    { screen === Screen.title && <TitleScreen/> }
                    { screen === Screen.droughtMonitor && <DroughtMonitorScreen/> }
                    { screen === Screen.rainfallLevels && <RainfallLevelsScreen/> }
                    { screen === Screen.howToHelp && <HowToHelpScreen/> }
                    { screen === Screen.usageRecorder && <UsageRecorderScreen/> }
                </div>
            </globalContext.Provider>
        </div>
    )
}

function BackButton() {
    const global = useContext(globalContext)

    return (
        <button
            onClick={() => global.setScreen(Screen.title)}
            style={{
                left: 4,
                top: 4,
                backgroundColor: "#aae1e9",
                outlineColor: "#2d213f",
                outlineWidth: 1,
                outlineStyle: "solid"
            }}
            className={"absolute w-10 h-10 z-50"}
        >
            <img src={home} alt={"Back"}/>
        </button>
    )
}

function TitleScreen() {
    const global = useContext(globalContext)

    return (
        <div className={"text-center"}>
            <div style={{color: "#2d213f"}} className={"text-3xl text-sky-500 text-center mt-3"}>
                Rainfo
            </div>
            <div className={"pt-8"}/>
            Location:
            <span className={"pl-3"}>
                <TextBox className={"pl-2 pr-2 w-1/2"} style={textBoxCSS} defaultText={global.location === "" ? "Your state name/code" : global.location} onChange={global.setLocation}/>
            </span>
            <div className={"pt-0.5 text-sm"}>
                ^^^ Which state are you in? ^^^
            </div>
            <div style={{top: height / 2 - height * 0.0774 + 30, left: width / 2 - 100, width: 200}} className={"absolute"}>
                <button
                    onClick={() => global.setScreen(Screen.rainfallLevels)}
                    className={"relative pl-2 pr-2"}
                    style={{
                        backgroundColor: "#aae1e9",
                        outlineColor: "#2d213f",
                        outlineWidth: 1,
                        outlineStyle: "solid"
                    }}
                >
                    Rainfall Levels
                </button>
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.droughtMonitor)}
                    className={"relative pl-2 pr-2"}
                    style={{
                        backgroundColor: "#aae1e9",
                        outlineColor: "#2d213f",
                        outlineWidth: 1,
                        outlineStyle: "solid"
                    }}
                >
                    Drought Monitor
                </button>
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.usageRecorder)}
                    className={"relative pl-2 pr-2"}
                    style={{
                        backgroundColor: "#aae1e9",
                        outlineColor: "#2d213f",
                        outlineWidth: 1,
                        outlineStyle: "solid"
                    }}
                >
                    Usage Recorder
                </button>
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.howToHelp)}
                    className={"relative pl-2 pr-2"}
                    style={{
                        backgroundColor: "#aae1e9",
                        outlineColor: "#2d213f",
                        outlineWidth: 1,
                        outlineStyle: "solid"
                    }}
                >
                    How to Help
                </button>
            </div>
        </div>
    )
}

function containsValue<K, V>(map: Map<K, V>, value: V): ((K | V)[]) | null {
    for (const val of map.entries()) {
        if (val[1] === value) {
            return val
        }
    }
    return null
}

function getStateCode(global: GlobalState_t): string {
    return getStateCode1(global.location)
}

function getStateCode1(loc: string): string {
    if (mapStateNameToCode.has(loc.toLowerCase())) {
        return mapStateNameToCode.get(loc.toLowerCase()) as string
    } else if (containsValue(mapStateNameToCode, loc.toUpperCase())) {
        return loc.toUpperCase()
    } else {
        return "Invalid State"
    }
}

function getStateName(location: string) {
    const entry = containsValue(mapStateNameToCode, location.toUpperCase())
    if (entry) {
        return entry[0] as string
    } else if (mapStateNameToCode.has(location.toLowerCase())) {
        return location
    } else {
        return "Invalid State"
    }
}

function DroughtMonitorScreen() {
    const global = useContext(globalContext)
    const iframe = useRef<HTMLIFrameElement>(null)

    return (
        <div className={`text-center ${getStateCode(global) !== "Invalid State" ? "bg-white" : ""}`}>
            <div className={"mt-3"}/>
            { getStateCode(global) !== "Invalid State" &&
                <div className={"fixed"}>
                    <div className={"w-screen bg-white h-40 absolute -z-10"}/>
                    <iframe
                        ref={iframe}
                        title={"drought mon"}
                        className={"w-screen pointer-events-none overflow-hidden absolute filter2"}
                        scrolling={"no"}
                        height={height - 150}
                        style = {{
                            top: 80 - 36,
                            zIndex: -15
                        }}
                        src={`https://droughtmonitor.unl.edu/CurrentMap/StateDroughtMonitor.aspx?${getStateCode(global)}`}
                    />
                </div>
            }
            <div className={"relative text-3xl text-center"}>
                Drought Monitor
            </div>
            <div className={"pt-8"}/>
            <span className={"relative"}>Location:</span>
            <span className={"relative pl-3"}>
                <TextBox className={"relative pl-2 pr-2 w-1/2"} style={textBoxCSS} defaultText={global.location === "" ? "Your state name/code" : global.location} onChange={global.setLocation}/>
            </span>
            <div className={"relative pt-0.5 text-sm"}>
                ^^^ Which state do you want to see? ^^^
            </div>
        </div>
    );
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function RainfallLevelsScreen() {
    const global = useContext(globalContext)

    return (
        <div className={"text-center"}>
            <div className={"mt-3"}/>
            <div className={"text-3xl"}>
                Rainfall Levels
            </div>
            <div className={"pt-8"}/>
            Location:
            <span className={"pl-3"}>
                <TextBox className={"pl-2 pr-2 w-1/2"} style={textBoxCSS} defaultText={global.location === "" ? "Your state name/code" : global.location} onChange={global.setLocation}/>
            </span>
            <div className={"pt-0.5 text-sm"}>
                ^^^ Which state do you want to see? ^^^
            </div>
            { getStateName(global.location) !== "Invalid State" &&
                <div style={{top: height / 2 - height * 0.0645, left: width / 2 - 100, width: 200}} className={"absolute"}>
                    <div className={"relative"}>
                        {capitalize(getStateName(global.location))} had
                    </div>
                    <div style={{color: "#92c1ca"}} className={"stroke text-2xl font-bold relative"}>
                        {mapStateToRainfall.get(getStateName(global.location).toLowerCase())}
                    </div>
                    <div className={"relative"}>
                        inches of rainfall this year.
                    </div>
                </div>
            }
        </div>
    )
}

type DropDownProps = {
    display: string
    options: ReactElement[]
}

function DropDown(props: DropDownProps) {
    const [open, setOpen] = useState(false)

    function toggle() {
        setOpen(!open)
    }

    return (
        <div className={"relative pl-2 pr-2"} style={textBoxCSS}>
            <button className={"relative text-xl"} onClick={toggle}>
                {open ? "+" : "-"} {props.display}
            </button>
            <div className={"relative ml-5"}>
                { open &&
                    props.options
                }
            </div>
        </div>
    )
}

function HowToHelpScreen() {
    const global = useContext(globalContext)

    return (
        <div>
            <div className={"mt-3"}/>
            <div className={"text-3xl text-center"}>
                How to Help
            </div>
            <div className={"pt-8"}/>
            <div className={"hth-screen"}>
                <DropDown
                    display={"Showers"}
                    options={
                        [
                            <div>Take shorter showers - they can use 5-10 gallons per minute.</div>,
                            <div>Use special shower heads to restrict the flow of water.</div>,
                            <div>Avoid taking baths, and when you do, don't fill the tub.</div>
                        ]
                    }
                />
                <div className={"mt-2"}/>
                <DropDown
                    display={"Faucets"}
                    options={
                        [
                            <div>Turn the faucet off while brushing.</div>,
                            <div>Wash your dishes using tubs.</div>,
                            <div>Fix leaking faucets and pipes.</div>
                        ]
                    }
                />
                <div className={"mt-2"}/>
                <DropDown
                    display={"Outdoors"}
                    options={
                        [
                            <div>Only water lawns when necessary.</div>,
                            <div>Only water when it's cold enough for the water not to evaporate.</div>,
                            <div>Use drought-resistant plants.</div>,
                            <div>Avoid playing with hoses and sprinklers.</div>,
                            <div>If it's rainy, use a bucket to catch rainwater.</div>
                        ]
                    }
                />
                <div className={"mt-2"}/>
                <DropDown
                    display={"Extra"}
                    options={
                        [
                            <div><span onClick={() => global.setScreen(Screen.usageRecorder)} className={"underline"}>Record your water usage</span> and set limits.</div>,
                            <div>Know what is using the most water in your household.</div>,
                            <div>Follow your local water restrictions closely.</div>,
                        ]
                    }
                />
            </div>
        </div>
    )
}

function sum<T>(arr: T[], f: (x: T) => number) {
    return arr.reduce((acc, x) => acc + f(x), 0)
}

function UsageRecorderScreen() {
    const global = useContext(globalContext)
    
    const [name, setName] = useState("")
    const [gals, setGals] = useState(0)

    return (
        <div className={"text-center"}>
            <div className={"mt-3"}/>
            <div className={"text-3xl text-center"}>
                Usage Recorder
            </div>
            <div className={"pt-6"}/>
            <div>
                You've used
            </div>
            <div style={{color: "#92c1ca"}} className={"stroke text-2xl font-bold"}>
                {sum(global.usages, x => x.gals)}
            </div>
            <div>
                gallons of water since
            </div>
            <div>
                you've started recording.
            </div>
            <div style={{top: height / 2 - height * 0.0774 + 30, left: width / 2 - 100, width: 200}} className={"absolute"}>
                <TextBox defaultText={name === "" ? "Name of task" : name} className={"w-2/3 pl-2 pr-2"} onChange={setName} style={textBoxCSS}/>
                <div className={"pt-2"}/>
                <span>
                    <TextBox defaultText={gals === 0 ? "Gallons used" : name} className={"w-16 pl-2 pr-2"} onChange={it => setGals(parseInt(it))} style={textBoxCSS} dataType={"number"}/>
                    <span className={"pl-2"}/>
                    Gallons
                </span>
                <div className={"pt-2"}/>
                <button style={textBoxCSS} className={"w-8 h-8"} onClick={() => {
                    const newArr = [...global.usages, {name: name, gals: gals, date: new Date()}]
                    global.setUsages(newArr)
                }}>+</button>
            </div>
            <div
                style={{
                    top: height - (width / 400) * 200 + 5,
                    left: 20,
                    width: width - 40,
                    height: height - (height - (width / 400) * 200 + 20) - 20,
                    backgroundColor: "#aae1e9",
                    outlineColor: "#2d213f",
                    outlineWidth: 1,
                    outlineStyle: "solid",
                    position: "absolute"
                }}
                className={"text-start"}
            >
                <div className={"relative pl-2"} style={{height: 24, backgroundColor: "#92c1ca"}}>
                    Log
                </div>
                <div className={"pl-5 pr-5 overflow-y-auto overflow-x-hidden"} style={{maxHeight: height - (height - (width / 400) * 200 + 20) - 44}}>
                    {global.usages.map(it => <div>{it.name}: {it.gals} gallons on {it.date.toDateString()}</div>)}
                </div>
            </div>
        </div>
    )
}

export default App;
