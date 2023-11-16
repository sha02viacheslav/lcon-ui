export const sanitizeData = (data) => {
  return data.map((item) => {
    // Sanitize each field in the object
    const sanitizedItem = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key] || '';
        sanitizedItem[key] = value
          .replace(/"/g, '""') // Escape existing double quotes
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/^[\+=-@\t\n\r]/g, ''); // Regex replace with empty string
      }
    }
    return sanitizedItem;
  });
};
