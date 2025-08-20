import {Messages} from "./Messages";
import React from "react";

function MessageBox({messages}) {
    const messageEndRef = React.useRef(null);

    React.useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="message-box">
            <h2>
                <i className="fas fa-comment-dots me-2"></i>
                Conversation
            </h2>
            <ul className="list-group">
                {messages.length === 0 ? (
                    <div className="empty-messages text-center py-4">
                        <i className="fas fa-comment-slash fs-1 text-muted"></i>
                        <p className="text-muted mt-2">No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    <Messages messages={messages} />
                )}
                <div ref={messageEndRef} />
            </ul>
        </div>
    );
}

export {MessageBox};