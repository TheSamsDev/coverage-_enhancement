import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardBody, Container } from "reactstrap";
import { getStores } from '../../config/stores';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import MapboxStoreMap from "../Dashboard/MapboxStoreMap";

const MapsVector = () => {
  const [loading, setLoading] = useState(true);
  const [stores, setStores] = useState([]);

  const breadcrumbItems = [
    { title: "Coverage Enhancement", link: "#" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ storeData] = await Promise.all([

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
                      <div className="text-center p-4 d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                        <div>
                          <i className="mdi mdi-loading mdi-spin text-primary" style={{ fontSize: "3rem" }}></i>
                          <h5 className="mt-2">Loading stores...</h5>
                        </div>
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
