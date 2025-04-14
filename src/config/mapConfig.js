// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
  defaultCenter: {
    lat: 21.3753, // Pakistan center
    lng: 68.3451, // Pakistan center
  },
  defaultZoom: 4,
  maxZoom: 12,
  minZoom: 4,
  mapStyle: 'mapbox://styles/mapbox/streets-v11',
  clusterOptions: {
    maxZoom: 16,
    radius: 50
  },
  
};