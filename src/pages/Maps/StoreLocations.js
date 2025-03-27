import React, { Component } from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';
import { getStoreLocations } from '../../config/database';
import GoogleMapReact from 'google-map-react';

const StoreMarker = ({ rank, channel }) => (
    <div style={{
        color: 'white',
        background: rank === 'A' ? '#1cbb8c' : rank === 'B' ? '#5664d2' : rank === 'C' ? '#fcb92c' : '#ff3d60',
        padding: '8px',
        borderRadius: '50%',
        display: 'inline-flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(-50%, -50%)',
        cursor: 'pointer'
    }}>
        {rank}
    </div>
);

class StoreLocations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stores: [],
            center: {
                lat: 25.0272255,
                lng: 66.8915392
            },
            zoom: 13,
            loading: true
        };
    }

    async componentDidMount() {
        await this.fetchStoreLocations();
    }

    fetchStoreLocations = async () => {
        try {
            const { data, error } = await getStoreLocations();
            if (error) throw error;
            
            if (data && data.length > 0) {
                this.setState({
                    stores: data,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching store locations:', error);
            this.setState({ loading: false });
        }
    }

    render() {
        const { stores, center, zoom, loading } = this.state;

        if (loading) {
            return <div>Loading store locations...</div>;
        }

        return (
            <React.Fragment>
                <div className="page-content">
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Store Locations</h4>
                                    <div style={{ height: '500px', width: '100%' }}>
                                        <GoogleMapReact
                                            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
                                            defaultCenter={center}
                                            defaultZoom={zoom}
                                        >
                                            {stores.map((store) => (
                                                <StoreMarker
                                                    key={store.store_code}
                                                    lat={store.latitude}
                                                    lng={store.longitude}
                                                    rank={store.rank}
                                                    channel={store.channel}
                                                />
                                            ))}
                                        </GoogleMapReact>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

export default StoreLocations;