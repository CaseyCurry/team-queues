const initialState = {
  isLoading: false,
  events: [],
  error: null,
  selectedEvent: null,
  isAddingEvent: false,
  selectedEventVersion: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_EVENTS_PENDING":
    {
      return {
        isLoading: true,
        events: []
      };
    }
    case "GET_EVENTS_REJECTED":
    {
      return {
        isLoading: false,
        events: [],
        error: action.payload
      };
    }
    case "GET_EVENTS_FULFILLED":
    {
      const eventToAdd = {
        name: "+ event",
        versions: [
          {
            number: 1,
            maps: []
          }
        ],
        isNew: true
      };
      const selectedEvent = action.payload && action.payload.length ? action.payload[0] : eventToAdd;
      return Object.assign({}, initialState, {
        events: [eventToAdd].concat(action.payload),
        selectedEvent,
        selectedEventVersion: selectedEvent.versions[selectedEvent.versions.length - 1]
      });
    }
    case "SELECT_EVENT":
    {
      let selectedEvent = action.payload.event;

      if (selectedEvent.isNew) {
        selectedEvent = Object.assign({}, selectedEvent, { name: "" });
      }

      return Object.assign({}, state, {
        selectedEvent,
        isAddingEvent: selectedEvent.isNew,
        selectedEventVersion: selectedEvent.versions[selectedEvent.versions.length - 1]
      });
    }
    case "CHANGE_EVENT_NAME":
    {
      const selectedEvent = Object.assign({}, state.selectedEvent, { name: action.payload.name });
      return Object.assign({}, state, { selectedEvent });
    }
    case "SELECT_EVENT_VERSION":
    {
      return Object.assign({}, state, { selectedEventVersion: action.payload.version });
    }
    case "SAVE_EVENT":
    {
      console.log(action.payload.event);
      return state;
    }
  }

  return state;
};
