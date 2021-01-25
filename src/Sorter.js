import React from 'react';
import {SortAlphaDownAlt, SortNumericDownAlt, SortAlphaDown, SortNumericDown} from 'react-bootstrap-icons';

function Sorter (props) {
    let indicator;

    if (props.numeric) {
        indicator = props.ascending ? <SortNumericDown/> : <SortNumericDownAlt/>;
    } else {
        indicator = props.ascending ? <SortAlphaDown/> : <SortAlphaDownAlt/>;
    }

    return (
        <a role="button" onClick={(event) => props.action(event, props.accessor, !props.ascending)}>
            <span className="title">{props.title}</span>
            {props.accessor == props.field && indicator}
        </a>
    );
}

export default Sorter;
