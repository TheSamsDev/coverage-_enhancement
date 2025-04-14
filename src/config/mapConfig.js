// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  defaultCenter: {
    lat: 25.3753, // Pakistan center
    lng: 69.3451, // Pakistan center
  },
  defaultZoom: 4,
  maxZoom: 25,
  minZoom: 4,
  mapStyle: 'mapbox://styles/mapbox/streets-v10',
  clusterOptions: {
    maxZoom: 25,
    radius: 50
  },
  
};