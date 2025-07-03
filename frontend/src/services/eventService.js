import { createApiClient } from './apiService';

const eventClient = createApiClient('/events');

const eventService = {
  getEvents: () => eventClient.get(),
  createEvent: (eventData) => eventClient.post('', eventData),
  updateEvent: (id, eventData) => eventClient.put(`/${id}`, eventData),
  deleteEvent: (id) => eventClient.delete(`/${id}`),
};

export default eventService;

