import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardBody, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';

const FilterControls = ({ stores, onFilterChange }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const [filteredStores, setFilteredStores] = useState([]);

  // Extract unique values for each filter using memoization
  const getUniqueValues = (field, filterStores = stores) => {
    const values = [...new Set(filterStores?.map(store => store[field]) || [])];
    return values.map(value => ({ value, label: value }));
  };

  const regions = useMemo(() => getUniqueValues('region'), [stores]);
  
  const cities = useMemo(() => {
    if (!selectedRegion) return getUniqueValues('city', stores);
    const filteredStores = stores?.filter(store => store.region === selectedRegion.value) || [];
    return getUniqueValues('city', filteredStores);
  }, [stores, selectedRegion]);

  const areas = useMemo(() => {
    let filteredStores = stores || [];
    if (selectedCity) {
      filteredStores = filteredStores.filter(store => store.city === selectedCity.value);
    } else if (selectedRegion) {
      filteredStores = filteredStores.filter(store => store.region === selectedRegion.value);
    }
    return getUniqueValues('area', filteredStores);
  }, [stores, selectedCity, selectedRegion]);

  const distributors = useMemo(() => {
    let filteredStores = stores || [];
    if (selectedCity) {
      filteredStores = filteredStores.filter(store => store.city === selectedCity.value);
    } else if (selectedRegion) {
      filteredStores = filteredStores.filter(store => store.region === selectedRegion.value);
    }
    return getUniqueValues('distributor', filteredStores);
  }, [stores, selectedCity, selectedRegion]);
  const ranks = useMemo(() => getUniqueValues('rank'), [stores]);

  useEffect(() => {
    const filtered = stores?.filter(store => {
      const matchRegion = !selectedRegion || store.region === selectedRegion.value;
      const matchCity = !selectedCity || store.city === selectedCity.value;
      const matchArea = !selectedArea || store.area === selectedArea.value;
      const matchDistributor = !selectedDistributor || store.distributor === selectedDistributor.value;
      const matchRank = !selectedRank || store.rank === selectedRank.value;
      return matchRegion && matchCity && matchArea && matchDistributor && matchRank;
    }) || [];
    setFilteredStores(filtered);
  }, [stores, selectedRegion, selectedCity, selectedArea, selectedDistributor, selectedRank]);

  const handleFilterChange = (field) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    if (field === 'region') {
      setSelectedRegion(selectedOption);
      setSelectedCity(null);
      setSelectedArea(null);
      setSelectedDistributor(null);
    } else if (field === 'city') {
      setSelectedCity(selectedOption);
      setSelectedArea(null);
      setSelectedDistributor(null);
      if (selectedOption) {
        const cityStore = stores.find(store => store.city === selectedOption.value);
        if (cityStore) {
          const regionOption = { value: cityStore.region, label: cityStore.region };
          setSelectedRegion(regionOption);
          onFilterChange('region', [regionOption.value]);
        }
      }
    } else if (field === 'area') {
      setSelectedArea(selectedOption);
    } else if (field === 'distributor') {
      setSelectedDistributor(selectedOption);
    } else if (field === 'rank') {
      setSelectedRank(selectedOption);
    }
    onFilterChange(field, value ? [value] : []);
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Filter Stores ({filteredStores.length})</h4>

        <FormGroup className="mb-3">
          <Label>Region</Label>
          <Select
            options={regions}
            className="basic-select"
            classNamePrefix="select"
            onChange={handleFilterChange('region')}
            placeholder="Select Region..."
            isClearable
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>City</Label>
          <Select
            options={cities}
            className="basic-select"
            classNamePrefix="select"
            onChange={handleFilterChange('city')}
            placeholder="Select City..."
            isClearable
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Area</Label>
          <Select
            options={areas}
            className="basic-select"
            classNamePrefix="select"
            onChange={handleFilterChange('area')}
            placeholder="Select Area..."
            isClearable
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Distributor</Label>
          <Select
            options={distributors}
            className="basic-select"
            classNamePrefix="select"
            onChange={handleFilterChange('distributor')}
            placeholder="Select Distributor..."
            isClearable
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <Label>Rank</Label>
          <Select
            options={ranks}
            className="basic-select"
            classNamePrefix="select"
            onChange={handleFilterChange('rank')}
            placeholder="Select Rank..."
            isClearable
          />
        </FormGroup>
      </CardBody>
    </Card>
  );
};

export default FilterControls;