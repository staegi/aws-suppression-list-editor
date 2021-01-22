import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function Loader() {
    return (
        <table className="vh-100 w-100">
            <tbody>
            <tr>
                <td className="text-center align-middle">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </td>
            </tr>
            </tbody>
        </table>
    );
}

export default Loader;