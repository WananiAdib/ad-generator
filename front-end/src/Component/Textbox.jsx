import { useState } from "react"
import "./Textbox.css"

const TextBox = (props) => {

    return(
        <div>
            <input
                className = "box"
                placeholder = {props.prompt}
                onChange = {props.onChange}
            /> 
        </div>
    )

}

export default TextBox