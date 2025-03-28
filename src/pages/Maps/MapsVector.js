import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { getSalesData, getRevenueData, getShopData, getRecentActivity, getLatestTransactions } from '../../config/database';
import { getStores } from '../../config/stores';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MapboxStoreMap from "../Dashboard/MapboxStoreMap";

const MapsVector = () => {
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState([]);
  const [stores, setStores] = useState([]);

  const breadcrumbItems = [
    { title: "Coverage Enhancement", link: "#" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sales, revenue, shops, activity, transactions, storeData] = await Promise.all([
          getSalesData(),
          getRevenueData(),
          getShopData(),
          getRecentActivity(),
          getLatestTransactions(),
          getStores()
        ]);
    
        const mappedStores = storeData.data.map(store => ({
          id: store.store_code,
          latitude: store.latitude,
          longitude: store.longitude,
          type: store.s || "ACQUIRED",
          region: store.Region,
          city: store.City,
          area: store.Area || "Unknown",
          distributor: store.channel || "Unknown",
          rank: store.rank || "Unknown"
        }));
    
        setShopData(mappedStores);
        setStores(mappedStores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id="usa-vectormap" style={{ height: "69vh" }}>
                    {loading ? (
                      <div className="text-center p-4">
                        <h5>Loading stores...</h5>
                      </div>
                    ) : (
                      <MapboxStoreMap stores={stores} />
                    )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MapsVector;
