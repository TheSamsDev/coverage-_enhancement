import React from 'react';
import StoreMap from './StoreMap';

const Store = ({ stores }) => {
  if (!stores || stores.length === 0) {
    return <div>Loading stores...</div>;
  }

  return <StoreMap stores={stores} />;
};

export default Store;