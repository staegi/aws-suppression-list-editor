import React from 'react';
import {EmojiAngry, Reply} from 'react-bootstrap-icons';

function Reason(props) {
    if (props.reason === 'COMPLAINT') {
        return <EmojiAngry/>;
    }
    return <Reply/>;
}

export default Reason;

