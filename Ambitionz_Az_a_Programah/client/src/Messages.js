
function Messages({messages}) {
    return messages.map((messages, idx) => (
        <li key={idx} className={`message-item ${messages.align === "right" ? "message-sent" : "message-received"}`} style={{textAlign: messages.align, padding: '10px', listStyleType: 'none'}}>
            <div className="message-content">
                <span className="message-sender">
                    {messages.align === "right" ? "You" : "Bot"}
                </span>
                <b><div className="message-text">{messages.text}</div></b>
                <small className="message-time">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
            </div>
        </li>
    ));
}


export {Messages};