import React, { useMemo } from 'react';
import { Card, CardBody, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';

const FilterControls = ({ stores, onFilterChange }) => {
  // Extract unique values for each filter using memoization
  const getUniqueValues = (field) => {
    const values = [...new Set(stores?.map(store => store[field]) || [])];
    return values.map(value => ({ value, label: value }));
  };

  const regions = useMemo(() => getUniqueValues('region'), [stores]);
  const cities = useMemo(() => getUniqueValues('city'), [stores]);
  const areas = useMemo(() => getUniqueValues('area'), [stores]);
  const distributors = useMemo(() => getUniqueValues('distributor'), [stores]);
  const ranks = useMemo(() => getUniqueValues('rank'), [stores]);

  const handleFilterChange = (field) => (selectedOption) => {
    const value = selectedOption ? selectedOption.value : null;
    onFilterChange(field, value ? [value] : []);
  };

  return (
    <Card>
      <CardBody>
        <h4 className="card-title mb-4">Filter Stores</h4>

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