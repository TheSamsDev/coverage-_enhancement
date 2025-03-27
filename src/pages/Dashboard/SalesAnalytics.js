import React, { Component } from 'react';
import { getSalesData } from '../../config/database';
import { Card, CardBody, Row, Col } from "reactstrap";

//Import Charts
import ReactApexChart from 'react-apexcharts';
import "./dashboard.scss";

class SalesAnalytics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            series: [0, 0, 0],
            period: 'monthly',
            loading: true,
            options: {
                labels: ["Product A", "Product B", "Product C"],
                plotOptions: {
                    pie: {
                        donut: {
                            size: '75%'
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                colors: ['#5664d2', '#1cbb8c', '#eeb902']
            }
        };
    }
    async componentDidMount() {
        await this.fetchSalesData();
    }

    fetchSalesData = async () => {
        try {
            const { data, error } = await getSalesData(this.state.period);
            if (error) throw error;
            
            if (data && data.length > 0) {
                const productA = data.find(item => item.product === 'Product A')?.percentage || 0;
                const productB = data.find(item => item.product === 'Product B')?.percentage || 0;
                const productC = data.find(item => item.product === 'Product C')?.percentage || 0;
                
                this.setState({
                    series: [productA, productB, productC],
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching sales data:', error);
            this.setState({ loading: false });
        }
    }

    handlePeriodChange = async (event) => {
        const period = event.target.value;
        this.setState({ period, loading: true }, () => {
            this.fetchSalesData();
        });
    }

    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <div className="float-end">
                            <select className="form-select form-select-sm" value={this.state.period} onChange={this.handlePeriodChange}>
                                <option defaultValue>Apr</option>
                                <option value="1">Mar</option>
                                <option value="2">Feb</option>
                                <option value="3">Jan</option>
                            </select>
                        </div>
                        <h4 className="card-title mb-4">Sales Analytics</h4>

                        <div id="donut-chart" className="apex-charts">
                            <ReactApexChart options={this.state.options} series={this.state.series} type="donut" height="225" />
                        </div>

                        <Row>
                            <Col xs={4}>
                                <div className="text-center mt-4">
                                    <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-primary font-size-10 me-1"></i> Product A</p>
                                    <h5>42 %</h5>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="text-center mt-4">
                                    <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-success font-size-10 me-1"></i> Product B</p>
                                    <h5>26 %</h5>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <div className="text-center mt-4">
                                    <p className="mb-2 text-truncate"><i className="mdi mdi-circle text-warning font-size-10 me-1"></i> Product C</p>
                                    <h5>42 %</h5>
                                </div>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }
}

export default SalesAnalytics;