import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Loader from './Loader';
import moment from 'moment';
import AWS from 'aws-sdk';
import SESV2 from 'aws-sdk/clients/sesv2';
import SuppressionDestination from "./SuppressionDestination";
import {SortAlphaDown} from 'react-bootstrap-icons';
import {sprintf} from 'sprintf-js';

class List extends React.Component {
    constructor(props) {
        super(props);

        AWS.config.update({
            region: process.env.REACT_APP_AWS_REGION,
            accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
            secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
        });

        this.state = {
            loading: true,
            results: [],
        }
    }

    async componentDidMount() {
        this.refresh();
    }

    async refresh() {
        this.setState({results: []});
        this.fetchDestinations();
    }

    async fetchDestinations(nextToken = null, pageSize = 20) {
        let that = this;
        let callback = function (error, data) {
            if (!error) {
                let results = that.state.results.concat(data.SuppressedDestinationSummaries);
                if (data.NextToken) {
                    that.fetchDestinations(data.NextToken, pageSize);
                }
                that.setState({results: results});
            }
            that.setState({loading: false});
        };

        let api = new SESV2({apiVersion: '2019-09-27'});
        api.listSuppressedDestinations({
            PageSize: pageSize,
            StartDate: moment().subtract(10, 'years').toISOString(),
            EndDate: new Date(),
            Reasons: ['BOUNCE', 'COMPLAINT'],
            NextToken: nextToken,
        }, callback);
    }

    async deleteDestination(event, destination) {
        if (!confirm(sprintf('Are you sure to delete %s?', destination.EmailAddress))) {
            return;
        }

        let callback = function (error) {
            if (error) {
                alert(sprintf('Could not delete %s from the list.', destination.EmailAddress));
            } else {
                // TODO: remove this item from the list
            }
        };

        let api = new SESV2({apiVersion: '2019-09-27'});
        api.deleteSuppressedDestination({EmailAddress: destination.EmailAddress}, callback);
    }

    render() {
        if (!this.state.loading) {
            if (this.state.results.length === 0) {
                return (<div>No results</div>);
            }

            return (
                <Container fluid className="suppression-destinations p-0">
                    <Table responsive striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Email address <SortAlphaDown/></th>
                            <th>Reason</th>
                            <th>Last updated</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        {this.state.results.sort((a, b) => a.EmailAddress.toLowerCase() > b.EmailAddress.toLowerCase() ? 1 : -1).map((item, index) =>
                            <SuppressionDestination data={item} key={index} deleteAction={this.deleteDestination}/>
                        )}
                    </Table>
                </Container>
            );
        }

        return (<Loader/>);
    }
}

export default List;
