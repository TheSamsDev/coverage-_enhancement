import { useEffect, useState, useMemo } from "react";
import { Map, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxClusterLayer from "./MapboxClusterLayer";
import Select from "react-select";
import { FormGroup, Label, Button, ButtonGroup, Input, Card, CardBody, Row, Col } from "reactstrap";
import {
  Box,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@mui/material";
import Icon from '@mdi/react';
import { mdiRefresh } from '@mdi/js';
import { MAPBOX_CONFIG } from "../../config/mapConfig";
import "./styles/MapboxStoreMap.css";
import pakistanGeoJSON from "../../assets/pk.json";
const ExpandMoreIcon = () => "▼";

const MapboxStoreMap = ({ stores: propStores }) => {
  const [stores, setStores] = useState(propStores || []);
  const [showStores, setShowStores] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [selectedTerritories, setSelectedTerritories] = useState([]);
  const [selectedDistributors, setSelectedDistributors] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: MAPBOX_CONFIG.defaultCenter.lat,
    longitude: MAPBOX_CONFIG.defaultCenter.lng,
    zoom: MAPBOX_CONFIG.defaultZoom,
    bearing: 0,
    pitch: 0,
  });

  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(stores.map((store) => store.region))];
    return uniqueRegions.map((region) => ({ value: region, label: region }));
  }, [stores]);

  const cities = useMemo(() => {
    const uniqueCitiess = [...new Set(stores.map((store) => store.city))];
    return uniqueCitiess.map((city) => ({ value: city, label: city }));
  }, [stores]);

  const areas = useMemo(() => {
    const uniqueAreas = [...new Set(stores.map((store) => store.area))];
    return uniqueAreas.map((area) => ({ value: area, label: area }));
  }, [stores]);

  const territories = useMemo(() => {
    const uniqueTerritories = [...new Set(stores.map((store) => store.territory))];
    return uniqueTerritories.map((territory) => ({
      value: territory,
      label: territory,
    }));
  }, [stores]);

  const distributors = useMemo(() => {
    const uniqueDistributors = [
      ...new Set(stores.map((store) => store.distributor)),
    ];
    return uniqueDistributors.map((distributor) => ({
      value: distributor,
      label: distributor,
    }));
  }, [stores]);

  const filteredStores = useMemo(() => {
    if (!showStores) {
      return [];
    }
    return stores.filter((store) => {
      const regionMatch =
        !selectedRegions.length ||
        selectedRegions.some((region) => region.value === store.region);
      const citynMatch =
        !selectedCities.length ||
        selectedCities.some((region) => region.value === store.city);
      const areaMatch =
        !selectedAreas.length ||
        selectedAreas.some((area) => area.value === store.area);
      const territoryMatch =
        !selectedTerritories.length ||
        selectedTerritories.some(
          (territory) => territory.value === store.territory
        );
      const distributorMatch =
        !selectedDistributors.length ||
        selectedDistributors.some(
          (distributor) => distributor.value === store.distributor
        );
      return regionMatch && citynMatch && areaMatch && territoryMatch && distributorMatch;
    });
  }, [
    stores,
    selectedRegions,
    selectedCities,
    selectedAreas,
    selectedTerritories,
    selectedDistributors,
    showStores,
  ]);

  useEffect(() => {
    setIsLoading(true);
    setStores(propStores || []);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [propStores]);

  // useEffect(() => {
  //   if (!areas || !territories || !distributors) {
  //     return;
  //   }

  //   let filtered = stores.filter((store) => {
  //     const areaMatch =
  //       !selectedAreas.length ||
  //       selectedAreas.some((area) => area.value === store.area);
  //     const territoryMatch =
  //       !selectedTerritories.length ||
  //       selectedTerritories.some(
  //         (territory) => territory.value === store.territory
  //       );
  //     const distributorMatch =
  //       !selectedDistributors.length ||
  //       selectedDistributors.some(
  //         (distributor) => distributor.value === store.distributor
  //       );
  //     return areaMatch && territoryMatch && distributorMatch;
  //   });

  //   if (selectedRegions.length) {
  //     filtered = filtered.filter((store) =>
  //       selectedRegions.some((region) => region.value === store.region)
  //     );
  //   }
  // });

  const handleFilterTypeChange = (filterType) => {
    setSelectedFilterType(filterType);
    setSelectedRegions([]);
    setSelectedCities([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
  };

  const handleFilterChange = (filterType) => (selectedOptions) => {
    const options = selectedOptions || [];
    switch (filterType) {
      case "region":
        setSelectedRegions(options);
        break;
      case "city":
        setSelectedCities(options);
        break;
      case "area":
        setSelectedAreas(options);
        break;
      case "territory":
        setSelectedTerritories(options);
        break;
      case "distributor":
        setSelectedDistributors(options);
        break;
      default:
        break;
    }
  };

  const handleResetAll = () => {
    setSelectedRegions([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setSelectedFilterType(null);
    setShowStores(false);
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleResetFilters = () => {
    setSelectedFilterType(null);
    setSelectedRegions([]);
    setSelectedCities([]);
    setSelectedAreas([]);
    setSelectedTerritories([]);
    setSelectedDistributors([]);
    setShowStores(false);
    setViewport({
      latitude: MAPBOX_CONFIG.defaultCenter.lat,
      longitude: MAPBOX_CONFIG.defaultCenter.lng,
      zoom: MAPBOX_CONFIG.defaultZoom,
      bearing: 0,
      pitch: 0,
    });
  };

  const handleLoadCMD = () => {
    console.log("Load CMD clicked");
  };

  const provinceLayerStyle = {
    id: "provinces-fill",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": "#808080",
      "fill-opacity": 0.5,
    },
    filter:
      selectedFilterType === "region"
        ? selectedRegions.length
          ? ["!in", "name", ...selectedRegions.map((region) => region.value)]
          : ["==", "name", ""]
        : ["!=", "name", ""],
  };

  const provinceOutlineStyle = {
    id: "provinces-outline",
    type: "line",
    source: "pakistan-provinces",
    paint: {
      "line-color": "#000000",
      "line-width": 1,
    },
  };

  const allRegionsHighlightStyle = {
    id: "all-regions-highlight",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": "#90EE90",
      "fill-opacity": 0.6,
    },
    filter:
      selectedFilterType === "region" && !selectedRegions.length
        ? ["!=", "name", ""]
        : ["==", "name", ""],
  };

  const highlightedRegionStyle = {
    id: "highlighted-region",
    type: "fill",
    source: "pakistan-provinces",
    paint: {
      "fill-color": [
        "match",
        ["get", "name"],
        "Sindh",
        "#A1CFF0",
        "Balochistan",
        "#F4A8A8",
        "Punjab",
        "#B8D8B8",
        "Khyber Pakhtunkhwa",
        "#C8B8D8",
        "#CCCCCC",
      ],
      "fill-opacity": 0.6,
    },
    filter: selectedRegions.length
      ? ["in", "name", ...selectedRegions.map((region) => region.value)]
      : ["in", "name", ""],
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "69vh" }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="store-map-container">
      <div className="row mb-3">
        <div className="col-9">
          <div className="d-flex justify-content-between align-items-center">
            <div className="filter-group me-2">
              <Label>Region</Label>
              <Select
                isMulti
                value={selectedRegions}
                options={regions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange("region")}
                placeholder="Select Region..."
              />
            </div>
            <div className="filter-group me-2">
              <Label>City</Label>
              <Select
                isMulti
                value={selectedCities}
                options={cities}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange("city")}
                placeholder="Select Region..."
              />
            </div>
            <div className="filter-group me-2">
              <Label>Area</Label>
              <Select
                isMulti
                value={selectedAreas}
                options={areas}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange("area")}
                placeholder="Select Area..."
              />
            </div>
            <div className="filter-group me-2">
              <Label>Territory</Label>
              <Select
                isMulti
                value={selectedTerritories}
                options={territories}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange("territory")}
                placeholder="Select Territory..."
              />
            </div>
            <div className="filter-group">
              <Label>Distributor</Label>
              <Select
                isMulti
                value={selectedDistributors}
                options={distributors}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleFilterChange("distributor")}
                placeholder="Select Distributor..."
              />
            </div>
          </div>
          <div className="mt-3">
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "region"}
                onChange={() => handleFilterTypeChange("region")}
              />
              <Label check>Region</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "city"}
                onChange={() => handleFilterTypeChange("city")}
              />
              <Label check>City</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "area"}
                onChange={() => handleFilterTypeChange("area")}
              />
              <Label check>Area</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "territory"}
                onChange={() => handleFilterTypeChange("territory")}
              />
              <Label check>Territory</Label>
            </FormGroup>
            <FormGroup check inline>
              <Input
                type="radio"
                name="filterType"
                checked={selectedFilterType === "distributor"}
                onChange={() => handleFilterTypeChange("distributor")}
              />
              <Label check>Distributor</Label>
            </FormGroup>
            <Button
              color="primary"
              onClick={handleResetFilters}
              className="ms-2"
            >
              Reset
            </Button>
          </div>
          <div className="d-flex align-items-center mt-3">
            <Button
              color="primary"
              outline={!showStores}
              className="me-2"
              size="sm"
              onClick={() => setShowStores(true)}
            >
              SavTrach Shops
            </Button>
            <Button color="primary" outline size="sm">
              CBL Shops
            </Button>
          </div>
          {/* <div className="d-flex align-items-center mt-3">
            <Button color="primary" onClick={handleLoadCMD} className="me-2">
              Unselect All Areas
            </Button>
            <Button color="primary" onClick={handleResetAll}>
              Reset All Sliders
            </Button>
          </div> */}
          <div className="map-container mt-3">
            <Map
              {...viewport}
              onMove={(evt) => setViewport(evt.viewState)}
              style={{ width: "100%", height: "100vh" }}
              mapStyle={MAPBOX_CONFIG.mapStyle}
              mapboxAccessToken={MAPBOX_CONFIG.accessToken}
              maxZoom={MAPBOX_CONFIG.maxZoom}
            >
              <Source
                id="pakistan-provinces"
                type="geojson"
                data={pakistanGeoJSON}
              >
                <Layer {...provinceLayerStyle} />
                <Layer {...provinceOutlineStyle} />
                <Layer {...allRegionsHighlightStyle} />
                <Layer {...highlightedRegionStyle} />
              </Source>
              <MapboxClusterLayer stores={filteredStores} />
            </Map>
          </div>
        </div>
        <div className="col-3" style={{borderRadius: "10px" }}>
          <div style={{ marginTop: "20px" }}>
            {/* Stats Cards */}
            <div className="stats-cards-container">
              <Row>
                <Col sm={6} className="mb-4">
                  <Card className="stats-card h-100" style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", borderRadius: "15px" }}>
                    <CardBody className="d-flex align-items-center">
                      <div className="stats-icon me-3" style={{ background: "rgba(255,255,255,0.2)", padding: "4px 11px", borderRadius: "8px" }}>
                        <i className="mdi mdi-store text-white" style={{ fontSize: "25px" }}></i>
                      </div>
                      <div className="stats-info text-white">
                        <h4 className="mb-1 text-white">{stores.length}</h4>
                        <p className="mb-0">Outlets</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm={6} className="mb-4">
                  <Card className="stats-card h-100" style={{ background: "linear-gradient(135deg, rgb(191 54 246), rgb(195 53 247)", borderRadius: "15px" }}>
                    <CardBody className="d-flex align-items-center">
                      <div className="stats-icon me-3" style={{ background: "rgba(255,255,255,0.2)", padding: "4px 11px", borderRadius: "8px" }}>
                        <i className="mdi mdi-check-circle text-white" style={{ fontSize: "25px" }}></i>
                      </div>
                      <div className="stats-info text-white">
                        <h4 className="mb-1 text-white">{filteredStores.length}</h4>
                        <p className="mb-0">Outlets</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm={6} className="mb-4">
                  <Card className="stats-card h-100" style={{ background: "linear-gradient(135deg, rgb(127 35 173), rgb(120 34 166))", borderRadius: "15px" }}>
                    <CardBody className="d-flex align-items-center">
                      <div className="stats-icon me-3" style={{ background: "rgba(255,255,255,0.2)", padding: "4px 11px", borderRadius: "8px" }}>
                        <i className="mdi mdi-map-marker text-white" style={{ fontSize: "25px" }}></i>
                      </div>
                      <div className="stats-info text-white">
                        <h4 className="mb-1 text-white">{selectedRegions.length}</h4>
                        <p className="mb-0">Regions</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm={6} className="mb-4">
                  <Card className="stats-card h-100" style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", borderRadius: "15px" }}>
                    <CardBody className="d-flex align-items-center">
                      <div className="stats-icon me-3" style={{ background: "rgba(255,255,255,0.2)", padding: "4px 11px", borderRadius: "8px" }}>
                        <i className="mdi mdi-map text-white" style={{ fontSize: "25px" }}></i>
                      </div>
                      <div className="stats-info text-white">
                        <h4 className="mb-1 text-white">{selectedAreas.length}</h4>
                        <p className="mb-0">Areas</p>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <div className="text-center mt-3">
                <ButtonGroup>
                  <Button color="primary" outline size="sm">
                    <i className="mdi mdi-chart-bar me-1"></i> Show Stats
                  </Button>
                  <Button color="success" outline size="sm">
                    <i className="mdi mdi-store me-1"></i> CBL Outlets
                  </Button>
                  <Button color="info" outline size="sm">
                    <i className="mdi mdi-routes me-1"></i> Routes Data
                  </Button>
                  <Button color="primary" outline size="sm" onClick={handleResetAll}>
                    <i className="mdi mdi-refresh me-1"></i> Reset Filter
                  </Button>
                </ButtonGroup>
              </div>
            </div>

            {/* Filter Box with Three Accordions */}
            <Card style={{ background: "#F9F9F9", borderRadius: "10px", marginTop: "20px", border: "none" }}>
              <CardBody>

                 {/* <Button color="primary" outline size="sm" onClick={handleResetAll}>
                    <i className="mdi mdi-refresh me-1"></i> Reset Filter
                  </Button> */}

                <Typography sx={{ color: "black", fontWeight: "lighter", marginBottom: "10px" }}>
                  Filters
                </Typography>

                {/* Outlet Size Profile Accordion */}
                <Accordion sx={{ background: "#FFFFFF", boxShadow: "none" }} defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="outlet-size-content"
                    id="outlet-size-header"
                  >
                    <Typography>Outlet Size Profile</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ padding: "8px" }}>
                      {["Up to 50,000", "50,000 to 100,000", "100,001-250,000"].map((size, index) => (
                        <FormGroup key={index} check className="mb-2">
                          <Input
                            type="checkbox"
                            id={`size-${index}`}
                            className="form-check-input"
                          />
                          <Label check className="form-check-label" htmlFor={`size-${index}`}>
                            {size}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* Product Handling Accordion */}
                <Accordion sx={{ background: "#FFFFFF", boxShadow: "none" }} defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="product-handling-content"
                    id="product-handling-header"
                  >
                    <Typography>Product Handling</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ padding: "8px" }}>
                      {["Sandwich", "Coffee"].map((product, index) => (
                        <FormGroup key={index} check className="mb-2">
                          <Input
                            type="checkbox"
                            id={`product-${index}`}
                            className="form-check-input"
                          />
                          <Label check className="form-check-label" htmlFor={`product-${index}`}>
                            {product}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>

                {/* Area Profile Accordion (Added as a third option) */}
                <Accordion sx={{ background: "#FFFFFF", boxShadow: "none" }} defaultExpanded>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="area-profile-content"
                    id="area-profile-header"
                  >
                    <Typography>Area Profile</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div style={{ padding: "8px" }}>
                      {["High Income", "Middle Income", "Low Income", "Poor", "Very Poor"].map((income, index) => (
                        <FormGroup key={index} check className="mb-2">
                          <Input
                            type="checkbox"
                            id={`income-${index}`}
                            className="form-check-input"
                          />
                          <Label check className="form-check-label" htmlFor={`income-${index}`}>
                            {income}
                          </Label>
                        </FormGroup>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxStoreMap;