export const normalizeEndpoint = (endpoint: string) => {
  return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};
