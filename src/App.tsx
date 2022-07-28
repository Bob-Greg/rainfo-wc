import React, {createContext, CSSProperties, ReactElement, useContext, useRef, useState} from 'react';
import './App.css';
import {TextBox} from "./text-box";
import home from './home.svg';
import raindrop from './raindrop.svg';

// Essentially my first time commenting in a project :(
// I typically like to think my code is self-documenting, but I think it'd be best to include these

// This enum is used for determining which screen is up. It is used in the App component.
enum Screen {
    title, droughtMonitor, rainfallLevels, usageRecorder,  howToHelp
}

//This type is used to describe a usage of water. It is used in the UsageRecorder component.
type Usage = {
    gals: number
    date: Date
    name: string
}


// This type is used to describe the global state of the app. It persists across all screens.
type GlobalState = {
    screen: Screen
    setScreen: (screen: Screen) => void
    location: string
    setLocation: (location: string) => void
    usages: Usage[]
    setUsages: (usages: Usage[]) => void
}

// the default css for boxes (blue background & purple-ish outline)
const textBoxCSS = {backgroundColor: "#aae1e9", outlineColor: "#2d213f", outlineWidth: 1, outlineStyle: "solid"} as CSSProperties

// this maps state names to their 2-letter codes
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

// this maps state names to their rainfall levels in inches. I would've liked to have gotten an API for this, but I couldn't find one.
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
// this ReactContext is used to share state between screens
export const globalContext = createContext({} as GlobalState)

// these two values keep width/height constant to avoid resizing when the keyboard pops up
const width = window.innerWidth
const height = window.innerHeight

// utility function that checks if a map contains a value and returns the entry if it does
function containsValue<K, V>(map: Map<K, V>, value: V): ((K | V)[]) | null {
    for (const val of map.entries()) {
        if (val[1] === value) {
            return val
        }
    }
    return null
}

// utility function that gets the state code from the location in the global state
function getStateCode(global: GlobalState): string {
    return getStateCode1(global.location)
}

// utility function that gets the state code from the location supplied
function getStateCode1(loc: string): string {
    if (mapStateNameToCode.has(loc.toLowerCase())) {
        return mapStateNameToCode.get(loc.toLowerCase()) as string
    } else if (containsValue(mapStateNameToCode, loc.toUpperCase())) {
        return loc.toUpperCase()
    } else {
        return "Invalid State"
    }
}

// utility function that gets the state name from the location supplied
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

// utility function that sums an array of any type using a selector function
function sum<T>(arr: T[], f: (x: T) => number) {
    return arr.reduce((acc, x) => acc + f(x), 0)
}

// utility functions that capitalizes a string
function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * This is the component that holds everything. It is the root of the app.
 * @returns {ReactElement} the app component
 */
function App() {

    // the current screen used being displayed
    const [screen, setScreen] = useState(Screen.title)
    // the state the user is in
    const [location, setLocation] = useState("")
    // the list of Usages the user has recorded
    const [usages, setUsages] = useState([] as Usage[])

    return (
        // this is the parent div of the whole thing. it has a filter on it that makes everything more 'purple' because I like it
        <div className={"filter1"}>
            {/* This is the provider of the global context we made on line 149 */}
            <globalContext.Provider value={{screen, setScreen, location, setLocation, usages, setUsages}}>
                {/* This is the little raindrop image that's in the center of every screen. */}
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
                {/* This is the back button in the top left corner of each screen (except the title screen) */}
                { screen !== Screen.title && <BackButton/> }
                {/* This is the containing div of all the screens. It changes the font to 'poppins' from Google because I like it */}
                <div style={{color: "#2d213f"}} className={"poppins"}>
                    {/* You can see how we map the global screen variable to each screen and display them accordingly. */}
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

/**
 * This is the back button. It's in the top left corner of each screen (except the title screen)
 * @returns {ReactElement} the back button
 */
function BackButton() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    return (
        // this is the back button. it's a button that goes to the title screen.
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
            {/* This is the little image of a home that I found. */}
            <img src={home} alt={"Back"}/>
        </button>
    )
}

/**
 * This is the title screen. It's the first screen the user sees.
 * @returns {ReactElement} the title screen
 */
function TitleScreen() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    return (
        // this is the container of the title screen. It's simple, with a white background and centered text.
        <div className={"text-center"}>
            {/* Here we go. You might ask, "Where'd you get this name?" Well, we were brainstorming names and I searched up synonyms of water. I found 'rain' and mashed it together with 'info.' */}
            {/* Anyways, it has the dark purple color and uses tailwind classes that are hopefully self-explanatory. 'mt-3' means margin-top: 3. */}
            <div style={{color: "#2d213f"}} className={"text-3xl text-center mt-3"}>
                Rainfo
            </div>
            {/* this div is just a spacer of height 2rem or 32px(?). */}
            <div className={"pt-8"}/>
            {/* This is the location input. I couldn't find a good place to put it, so I just shoved it at the top. Hopefully it's not that intrusive. */}
            Location:
            <span className={"pl-3"}>
                <TextBox className={"pl-2 pr-2 w-1/2"} style={textBoxCSS} defaultText={global.location === "" ? "Your state name/code" : global.location} onChange={global.setLocation}/>
            </span>
            <div className={"pt-0.5 text-sm"}>
                ^^^ Which state are you in? ^^^
            </div>
            {/* These are the buttons that lead to the various screens. */}
            <div style={{top: height / 2 - height * 0.0774 + 30, left: width / 2 - 100, width: 200}} className={"absolute"}>
                <button
                    onClick={() => global.setScreen(Screen.rainfallLevels)}
                    className={"relative pl-2 pr-2"}
                    style={textBoxCSS}
                >
                    Rainfall Levels
                </button>
                {/* a spacer of height 0.5rem or 8px(?). */}
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.droughtMonitor)}
                    className={"relative pl-2 pr-2"}
                    style={textBoxCSS}
                >
                    Drought Monitor
                </button>
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.usageRecorder)}
                    className={"relative pl-2 pr-2"}
                    style={textBoxCSS}
                >
                    Usage Recorder
                </button>
                <div className={"pt-2"}/>
                <button
                    onClick={() => global.setScreen(Screen.howToHelp)}
                    className={"relative pl-2 pr-2"}
                    style={textBoxCSS}
                >
                    How to Help
                </button>
            </div>
        </div>
    )
}

function DroughtMonitorScreen() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    return (
        // this is the container of the drought monitor screen. It's simple, with a white background and centered text.
        <div className={`text-center ${getStateCode(global) !== "Invalid State" ? "bg-white" : ""}`}>
            {/* This is a spacer of height 0.75rem. */}
            <div className={"mt-3"}/>
            {/* This is the iframe that displays the drought map. */}
            { getStateCode(global) !== "Invalid State" &&
                <div className={"fixed"}>
                    <div className={"w-screen bg-white h-40 absolute -z-10"}/>
                    <iframe
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
            {/* This is the text that says "Drought Monitor" */}
            <div className={"relative text-3xl text-center"}>
                Drought Monitor
            </div>
            {/* this is a spacer of height 2rem. */}
            <div className={"pt-8"}/>
            {/* This is the location input. I couldn't find a good place to put it, so I just shoved it at the top. Hopefully it's not that intrusive. */}
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

function RainfallLevelsScreen() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    return (
        // this is the container of the rainfall levels screen. It's simple, with a white background and centered text.
        <div className={"text-center"}>
            {/* This is a spacer of height 0.75rem. */}
            <div className={"mt-3"}/>
            {/* This is the text that says "Rainfall Levels" */}
            <div className={"text-3xl"}>
                Rainfall Levels
            </div>
            {/* this is a spacer of height 2rem. */}
            <div className={"pt-8"}/>
            {/* This is the location input. I couldn't find a good place to put it, so I just shoved it at the top. Hopefully it's not that intrusive. */}
            Location:
            <span className={"pl-3"}>
                <TextBox className={"pl-2 pr-2 w-1/2"} style={textBoxCSS} defaultText={global.location === "" ? "Your state name/code" : global.location} onChange={global.setLocation}/>
            </span>
            <div className={"pt-0.5 text-sm"}>
                ^^^ Which state do you want to see? ^^^
            </div>
            {/* We don't have a 'picture map' so we use the next best thing, a HashMap :)) */}
            { getStateName(global.location) !== "Invalid State" &&
                <div style={{top: height / 2 - height * 0.0645, left: width / 2 - 100, width: 200}} className={"absolute"}>
                    {/* get the rainfall from the map, then display it in the format of ``{state} had \n {rainfall} \n inches of rainfall this year.`` */}
                    <div className={"relative"}>
                        {capitalize(getStateName(global.location))} had
                    </div>
                    {/* nice little outline and different color to make the rainfall number pop out. */}
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

// the properties that represent a drop-down menu.
type DropDownProps = {
    display: string
    options: ReactElement[]
}

/**
 * Creates a drop-down menu.
 * @param props the DropDownProps passed into the function.
 * @returns {ReactElement} the drop down menu specified by the DropDownProps passed in.
 */
function DropDown(props: DropDownProps) {
    // this determines if this drop-down is currently open or not.
    const [open, setOpen] = useState(false)

    // toggle the open state of the drop-down. could be inlined but I didn't do that.
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

/**
 * Creates the how to help screen.
 * @returns {ReactElement} the how to help screen.
 */
function HowToHelpScreen() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    return (
        // this is the container of the how to help screen. It's literally just a div.
        <div>
            {/* This is a spacer of height 0.75rem. */}
            <div className={"mt-3"}/>
            {/* This is the text that says "How to Help" */}
            <div className={"text-3xl text-center"}>
                How to Help
            </div>
            {/* this is a spacer of height 2rem. */}
            <div className={"pt-8"}/>
            {/* These are the drop-downs that include the tips. */}
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

/**
 * Creates the usage recorder screen.
 * @returns {ReactElement} the usage recorder screen.
 */
function UsageRecorderScreen() {
    // this is the global context we made on line 149
    const global = useContext(globalContext)

    // the name of the Usage being created
    const [name, setName] = useState("")
    // the amount of water used in the Usage being created
    const [gals, setGals] = useState(0)

    return (
        // this is the container of the usage recorder screen. It's got a white background and centered text.
        <div className={"text-center"}>
            {/* This is a spacer of height 0.75rem. */}
            <div className={"mt-3"}/>
            {/* This is the text that says "Usage Recorder" */}
            <div className={"text-3xl text-center"}>
                Usage Recorder
            </div>
            {/* this is a spacer of height 1.5rem. */}
            <div className={"pt-6"}/>
            {/* the text that displays how much water usage has been recorded. */}
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
            {/* the bit that houses the text boxes and button that allows the user to enter a new Usage. */}
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
            {/* the log of previous Usages. */}
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
