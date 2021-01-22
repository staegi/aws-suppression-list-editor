import React from 'react';
import {Trash} from 'react-bootstrap-icons';
import Button from 'react-bootstrap/Button';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/de';
import Reason from "./Reason";

function SuppressionDestination(props) {
    return (
        <tr className="suppression-destination">
            <td className="email-address">
                <a href={'mailto:' + props.data.EmailAddress.toLowerCase()}>{props.data.EmailAddress.toLowerCase()}</a>
            </td>
            <td className="reason">
                <span title={props.data.Reason.toLowerCase()}>
                    <Reason reason={props.data.Reason}/>
                    <span className="ml-2">{props.data.Reason.toLowerCase()}</span>
                </span>
            </td>
            <td className="last-update-time">
                <Moment tz="Europe/Berlin" fromNow withTitle titleFormat="ddd, Do MMM YYYY hh:mm" interval={1000}>
                    {props.data.LastUpdateTime}
                </Moment>
            </td>
            <td className="actions">
                <Button variant="link" className="p-0" onClick={(e) => props.deleteAction(e, props.data)}>
                    <Trash/>
                </Button>
            </td>
        </tr>
    );
}

export default SuppressionDestination;