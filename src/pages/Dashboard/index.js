import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

//Import Database Operations
import { getSalesData, getRevenueData, getShopData, getRecentActivity, getLatestTransactions } from '../../config/database';
import { getStores } from '../../config/stores';

//Import Components
import MiniWidgets from "./MiniWidgets";
import RevenueAnalytics from "./RevenueAnalytics";
import SalesAnalytics from "./SalesAnalytics";
// import Shop from "./Store";
import EarningReports from "./EarningReports";
import Sources from "./Sources";
import RecentlyActivity from "./RecentlyActivity";
import RevenueByLocations from "./RevenueByLocations";
import ChatBox from "./ChatBox";
import LatestTransactions from "./LatestTransactions";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "Savtech Digital", link : "/" },
                { title : "Dashboard", link : "#" },
            ],
            reports : [
                { icon : "ri-stack-line", title : "Number of Sales", value : "1452", rate : "2.4%", desc : "From previous period" },
                { icon : "ri-store-2-line", title : "Sales Revenue", value : "$ 38452", rate : "2.4%", desc : "From previous period" },
                { icon : "ri-briefcase-4-line", title : "Average Price", value : "$ 15.4", rate : "2.4%", desc : "From previous period" },
            ],
            salesData: null,
            revenueData: null,
            shopData: null,
            recentActivity: null,
            latestTransactions: null,
            loading: true
        }
    }

    async componentDidMount() {
        try {
          const [sales, revenue, shops, activity, transactions, storeData] = await Promise.all([
            getSalesData(),
            getRevenueData(),
            getShopData(),
            getRecentActivity(),
            getLatestTransactions(),
            getStores()
          ]);
      
          // Map storeData.data to match expected structure
          const mappedStores = storeData.data.map(store => ({
            id: store.store_code, // Use store_code as id
            latitude: store.latitude,
            longitude: store.longitude,
            type: store.s || "ACQUIRED", // Default to "ACQUIRED" if type is missing
            region: store.Region,
            city: store.City,
            area: store.Area || "Unknown", // Default if missing
            distributor: store.channel || "Unknown" // Default if missing
          }));
      
          this.setState({
            salesData: sales.data,
            revenueData: revenue.data,
            shopData: mappedStores || [],
            recentActivity: activity.data,
            latestTransactions: transactions.data,
            loading: false
          });
          console.log("Mapped Stores:", mappedStores);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          this.setState({ loading: false });
        }
      }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                    <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
                        <Row>
                            <Col xl={8}>
                                <Row>
                                    <MiniWidgets reports={this.state.reports} />
                                </Row>
                                {/* revenue Analytics */}
                                <RevenueAnalytics />
                            </Col>

                            <Col xl={4}>
                                {/* sales Analytics */}
                                <SalesAnalytics/>

                                {/* earning reports */}
                                <EarningReports/>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col xl={10}>
                                Shops Map Analytics
                                <Shop stores={this.state.shopData} />
                            </Col>

                            <Col xl={2}>
                                Shop Filters
                                <EarningReports/>
                            </Col>
                        </Row> */}
                        
                        <Row>
                            {/* sources */}
                            <Sources/>

                            {/* recent activity */}
                            <RecentlyActivity/>

                            {/* revenue by locations */}
                            <RevenueByLocations/>
                        </Row>

                        <Row>
                            {/* chat box */}
                            <ChatBox/>

                            {/* latest transactions */}
                            <LatestTransactions/>
                        </Row>

                    </Container> 
                </div>
            </React.Fragment>
        );
    }
}

export default Dashboard;
