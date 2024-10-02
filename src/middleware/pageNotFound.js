// Custom 404 handler
export const pageNotFound = (req, res, next) => {
  res.status(404).send();
}