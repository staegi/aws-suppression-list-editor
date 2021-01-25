import React from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Sorter from './Sorter';
import Loader from './Loader';
import moment from 'moment';
import AWS from 'aws-sdk';
import SESV2 from 'aws-sdk/clients/sesv2';
import SuppressionDestination from "./SuppressionDestination";
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
            sortAscending: false,
            sortField: 'LastUpdateTime',
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

    async sortResults(event, accessor, ascending) {
        this.setState({sortAscending: ascending, sortField: accessor});
    }

    compareItems(a, b) {
        let valueA = a[this.state.sortField];
        let valueB = b[this.state.sortField];

        if (typeof valueA == 'string') valueA = valueA.toLowerCase();
        if (typeof valueB == 'string') valueB = valueB.toLowerCase();

        if (this.state.sortAscending) {
            return valueA > valueB ? 1 : -1;
        }
        return valueA < valueB ? 1 : -1;
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
                            <th>
                                <Sorter title="Email address" accessor="EmailAddress" field={this.state.sortField}
                                        ascending={this.state.sortAscending} action={this.sortResults.bind(this)}/>
                            </th>
                            <th>
                                <Sorter title="Reason" accessor="Reason" field={this.state.sortField}
                                        ascending={this.state.sortAscending} action={this.sortResults.bind(this)}/>
                            </th>
                            <th>
                                <Sorter title="Last updated" accessor="LastUpdateTime" field={this.state.sortField}
                                        ascending={this.state.sortAscending} action={this.sortResults.bind(this)} numeric/>
                            </th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.results.sort((a, b) => this.compareItems(a, b)).map((item, index) =>
                            <SuppressionDestination data={item} key={index} deleteAction={this.deleteDestination.bind(this)}/>
                        )}
                        </tbody>
                    </Table>
                </Container>
            );
        }

        return (<Loader/>);
    }
}

export default List;
