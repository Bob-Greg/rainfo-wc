import {ChangeEvent, CSSProperties, useState} from "react";

export type TextBoxProps = {
    defaultText:string
    className:string | undefined
    onChange:(_:string) => void
    style: CSSProperties | undefined
}

export type TextBoxProps1 = {
    defaultText:string
    className:string | undefined
    onChange:(_:string) => void
    style: CSSProperties | undefined
    dataType: string
}

export const TextBox = (props:TextBoxProps | TextBoxProps1) => {
    const [text, setText] = useState(props.defaultText)

    function change(ev:ChangeEvent<HTMLInputElement>) {
        setText(ev.target.value)
        props.onChange(ev.target.value)
    }

    return (
        <input
            type={(props as unknown as TextBoxProps1).dataType ? (props as TextBoxProps1).dataType : "text"}
            value={text}
            onChange={change}
            onFocus={event => event.currentTarget.select()}
            className={`${props.className}`}
            style={props.style}
        />
    )
}