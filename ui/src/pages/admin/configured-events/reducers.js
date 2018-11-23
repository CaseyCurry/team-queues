const initialState = Object.freeze({
  areEventsLoading: false,
  events: [],
  selectedEvent: null,
  isAddingEvent: false,
  searchString: null,
  isEventSaving: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_EVENTS_PENDING": {
      return Object.assign({}, initialState, {
        areEventsLoading: true
      });
    }
    case "GET_EVENTS_REJECTED": {
      return Object.assign({}, state, {
        areEventsLoading: false
      });
    }
    case "GET_EVENTS_FULFILLED": {
      const searchString = action.payload.searchString;
      const sortedEvents = action.payload.events
        .sort((x, y) => x.name.toLowerCase() < y.name.toLowerCase() ? -1 : 1);
      const activeEvents = sortedEvents
        .filter((event) => event.isActive);
      const selectedEvent = activeEvents.length ?
        activeEvents[0] : null;
      return Object.assign({}, initialState, {
        events: sortedEvents,
        selectedEvent,
        searchString
      });
    }
    case "SELECT_EVENT": {
      let selectedEvent = action.payload.event;

      if (!selectedEvent || state.selectedEvent && selectedEvent.name === state.selectedEvent.name) {
        return state;
      }

      return Object.assign({}, state, {
        selectedEvent,
        isAddingEvent: selectedEvent.isNew
      });
    }
    case "CHANGE_EVENT_NAME": {
      const selectedEvent = Object.assign({}, state.selectedEvent, {
        name: action.payload.name
      });
      return Object.assign({}, state, {
        selectedEvent
      });
    }
    case "SAVE_EVENT_PENDING": {
      return Object.assign({}, state, {
        isEventSaving: true
      });
    }
    case "SAVE_EVENT_REJECTED": {
      return Object.assign({}, state, {
        isEventSaving: false
      });
    }
  }

  return state;
};