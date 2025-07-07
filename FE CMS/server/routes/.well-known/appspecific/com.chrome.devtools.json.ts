import { defineEventHandler, setResponseStatus } from 'h3';

export default defineEventHandler((event) => {
  // Return a 404 Not Found for this special Chrome DevTools file
  setResponseStatus(event, 404);
  return { error: 'Not found' };
});
