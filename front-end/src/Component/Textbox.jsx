import { useState } from "react"
import "./Textbox.css"

const TextBox = (props) => {

    const [newMessage, setMessage] = useState(
        ""
    )

    const addMessage = (e) => {
        e.preventDefault()
        console.log("button clicked", e.target)
    }

    const handlePrompt = (e) =>{
        console.log(e.target.value)
        setMessage(e.target.value)

    }

    console.log("new", newMessage)

    return(
        <div>
            <form  onSubmit={addMessage}>
                <input
                className = "box"
                placeholder = {props.prompt}
                onChange = {handlePrompt}
                /> 
            </form>
        </div>
    )

}

export default TextBox