const initialState = Object.freeze({
  isLoading: false,
  events: [],
  error: null,
  selectedEvent: null,
  isAddingEvent: false,
  searchString: null
});

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_EVENTS_PENDING": {
      return Object.assign({}, initialState, {
        isLoading: true
      });
    }
    case "GET_EVENTS_REJECTED": {
      return Object.assign({}, state, {
        isLoading: false,
        error: action.payload
      });
    }
    case "GET_EVENTS_FULFILLED": {
      const searchString = action.payload.searchString;
      const sortedEvents = action.payload.events.sort(
        (x, y) => x.name.toLowerCase() < y.name.toLowerCase() ?
          -1 : 1
      );
      const activeEvents = sortedEvents.filter((event) => event.isActive);
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

      if (!selectedEvent) {
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
    case "SAVE_EVENT":{
      if (!action.payload.isSuccessful) {
        return Object.assign({}, state, {
          error: {
            message: "An error occurred"
          }
        });
      }
      return state;
    }
  }

  return state;
};