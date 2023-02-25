import { useState } from "react"

const TextBox = () => {

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

    return(
        <div>
            <form onSubmit={addMessage} placeholder = {"Enter Prompt"}>
                <input
                placeholder = {"Enter Prompt"}
                onChange = {handlePrompt}
                /> 
            </form>
        </div>
    )

}

export default TextBox