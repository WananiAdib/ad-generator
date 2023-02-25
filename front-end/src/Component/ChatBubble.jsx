const ChatBubble = (props) =>{

    const text = props.message

    return(
        <div> 
            <p>{text}</p>
        </div>
    )
}

export default ChatBubble