const initialState = {
  isLoading: false,
  events: [],
  error: null,
  selectedEvent: null,
  isAddingEvent: false
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
      // const sortedEvents = action.payload.sort(
      //   (x, y) => x.name.toLowerCase() < y.name.toLowerCase()
      //     ? -1
      //     : 1
      // );
      // const selectedEvent = action.payload.length
      //   ? sortedEvents[0]
      //   : null;
      // return Object.assign({}, initialState, {
      //   events: sortedEvents,
      //   selectedEvent
      // });
      return state;
    }
    case "SELECT_EVENT":
    {
      let selectedEvent = action.payload.event;

      if (selectedEvent.isNew) {
        selectedEvent = Object.assign({}, selectedEvent, { name: "" });
      }

      return Object.assign({}, state, {
        selectedEvent,
        isAddingEvent: selectedEvent.isNew
      });
    }
    case "CHANGE_EVENT_NAME":
    {
      const selectedEvent = Object.assign({}, state.selectedEvent, { name: action.payload.name });
      return Object.assign({}, state, { selectedEvent });
    }
    case "SAVE_EVENT":
    {
      console.log(action.payload.event);
      return state;
    }
  }

  return state;
};
