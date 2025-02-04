export const formatJson = (json) => { try { return JSON.stringify(JSON.parse(json), null, 2); } catch (error) { return 'Invalid JSON'; } };
