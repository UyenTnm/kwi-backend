export const getImageUrl = (fileName: string) =>
  `${process.env.API_BASE_URL || 'http://localhost:3001'}/uploads/${fileName}`;
