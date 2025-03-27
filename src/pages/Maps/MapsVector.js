import React, { Component } from "react";

import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { getSalesData, getRevenueData, getShopData, getRecentActivity, getLatestTransactions } from '../../config/database';
import { getStores } from '../../config/stores';
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MapboxStoreMap from "../Dashboard/MapboxStoreMap";
import FilterControls from "./FilterControls";

class MapsVector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      breadcrumbItems: [
        { title: "Coverage Enhancement", link: "#" },
        // { title: "Coverage Enhancement", link: "#" },
      ],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      shopData: null,
      loading: true,
      filters: {
        region: [],
        city: [],
        area: [],
        distributor: []
      }
    };
    this.onMarkerClick = this.onMarkerClick.bind(this);
    
  }

  onMarkerClick(props, marker, e) {
    alert("You clicked in this marker");
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
        distributor: store.channel || "Unknown", // Default if missing
        rank: store.rank || "Unknown" // Default if missing
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
  getFilteredData = () => {
    const { shopData, filters } = this.state;
    if (!shopData) return [];

    // Optimize filtering by checking if any filters are active
    const hasActiveFilters = Object.values(filters).some(values => values.length > 0);
    if (!hasActiveFilters) return shopData;

    return shopData.filter(store => {
      return Object.entries(filters).every(([field, values]) => {
        if (values.length === 0) return true;
        return values.includes(store[field]);
      });
    });
  };

  handleFilterChange = (field, values) => {
    this.setState(prevState => ({
      filters: {
        ...prevState.filters,
        [field]: values
      },
      loading: true
    }), () => {
      // Add a small delay to prevent rapid re-renders
      setTimeout(() => {
        this.setState({ loading: false });
      }, 100);
    });
  };

  render() {
    const { loading } = this.state;
    const displayData = this.getFilteredData();
    
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Breadcrumbs
              // title="Coverage Enhancement"
              breadcrumbItems={this.state.breadcrumbItems}
            />
            <Row>
              <Col lg={10}>
                <Card>
                  <CardBody>
                    <div id="usa-vectormap" style={{ height: "auto" }}>
                      <MapboxStoreMap stores={displayData} />
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={2}>
                <FilterControls
                  stores={this.state.shopData}
                  onFilterChange={this.handleFilterChange}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default MapsVector;
