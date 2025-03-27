import React, { Component } from 'react';
import { getRevenueData } from '../../config/database';
import { Row, Col, Card, CardBody, ButtonGroup, Button } from 'reactstrap';

//Import Charts
import { RevenueAnalyticsChart } from './Charts'
import "./dashboard.scss";

class RevenueAnalytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            period: 'monthly',
            loading: true,
            revenueData: null
        };
    }

    async componentDidMount() {
        await this.fetchRevenueData();
    }

    fetchRevenueData = async () => {
        try {
            const { data, error } = await getRevenueData(this.state.period);
            if (error) throw error;
            
            this.setState({
                revenueData: data,
                loading: false
            });
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            this.setState({ loading: false });
        }
    }

    handlePeriodChange = async (period) => {
        this.setState({ period, loading: true }, () => {
            this.fetchRevenueData();
        });
    }
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <div className="float-end d-none d-md-inline-block">
                            <ButtonGroup className="mb-2">
                                <Button size="sm" color="light" type="button" onClick={() => this.handlePeriodChange('daily')}>Today</Button>
                                <Button size="sm" color="light" active={this.state.period === 'weekly'} type="button" onClick={() => this.handlePeriodChange('weekly')}>Weekly</Button>
                                <Button size="sm" color="light" active={this.state.period === 'monthly'} type="button" onClick={() => this.handlePeriodChange('monthly')}>Monthly</Button>
                            </ButtonGroup>
                        </div>
                        <h4 className="card-title mb-2">Revenue Analytics</h4>
                        <div id="line-column-chart" className="apex-charts" dir="ltr">
                            <RevenueAnalyticsChart />
                        </div>  
                    </CardBody>

                    <CardBody className="border-top text-center">
                        <Row>
                            <Col sm={4}>
                                <div className="d-inline-flex">
                                    <h5 className="me-2">$12,253</h5>
                                    <div className="text-success">
                                        <i className="mdi mdi-menu-up font-size-14"> </i>2.2 %
                                    </div>
                                </div>
                                <p className="text-muted text-truncate mb-0">This month</p>
                            </Col>

                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-primary font-size-10 me-1"></i> This Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0 me-2">$ 34,254</h5>
                                        <div className="text-success">
                                            <i className="mdi mdi-menu-up font-size-14"> </i>2.1 %
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={4}>
                                <div className="mt-4 mt-sm-0">
                                    <p className="mb-2 text-muted text-truncate"><i className="mdi mdi-circle text-success font-size-10 me-1"></i> Previous Year :</p>
                                    <div className="d-inline-flex">
                                        <h5 className="mb-0">$ 32,695</h5>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default RevenueAnalytics;