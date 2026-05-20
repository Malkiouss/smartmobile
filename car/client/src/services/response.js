export const unwrapData = (payload) => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return unwrapData(payload.data);
  }

  return payload;
};

export const unwrapArray = (payload) => {
  const data = unwrapData(payload);
  return Array.isArray(data) ? data : [];
};
