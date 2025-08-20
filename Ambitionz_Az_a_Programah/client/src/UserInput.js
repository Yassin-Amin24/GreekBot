export var exportedInput = true;

function UserInput({input, setInput, onSubmit, onClear}) {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmit();
            event.preventDefault();
        }
    };

    return(
        <div className="fom">
            <input
                type="text"
                className="form-control"
                placeholder="Type your message here..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                aria-label="Message input"
            />
            <button
                type="button"
                className="send-btn"
                onClick={onSubmit}
                disabled={!input.trim()}
            >
                <i className="fas fa-paper-plane"></i> Send
            </button>
            <button
                type="button"
                className="clear-btn"
                onClick={onClear}
            >
                <i className="fas fa-times"></i> Clear
            </button>
        </div>
    );
}

export {UserInput};
