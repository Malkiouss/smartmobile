export const unwrapData = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return unwrapData(payload.data);
  }

  return payload;
};

export const unwrapArray = (payload) => {
  const data = unwrapData(payload);

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === 'object') {
    if (Array.isArray(data.cars)) {
      return data.cars;
    }

    if (Array.isArray(data.items)) {
      return data.items;
    }
  }

  return [];
};
