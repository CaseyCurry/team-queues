const initialState = Object.freeze({
  areLifecyclesLoading: false,
  lifecycles: [],
  selectedLifecycle: null,
  isLifecycleBeingAdded: false,
  searchString: null,
  isNextVersionSaving: false,
  isNextVersionActivating: false,
  hasNextVersionBeenModified: false,
  doPromptToSaveChanges: false
});

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_LIFECYCLES_PENDING": {
      return Object.assign({}, initialState, {
        areLifecyclesLoading: true
      });
    }
    case "GET_LIFECYCLES_REJECTED": {
      return Object.assign({}, state, {
        areLifecyclesLoading: false
      });
    }
    case "GET_LIFECYCLES_FULFILLED": {
      const searchString = action.payload.searchString;
      const sortedLifecycles = action.payload.lifecycles
        .sort((x, y) => x.lifecycleOf.toLowerCase() < y.lifecycleOf.toLowerCase() ? -1 : 1);
      const selectedLifecycle = sortedLifecycles.length ?
        sortedLifecycles[0] : null;
      return Object.assign({}, initialState, {
        lifecycles: sortedLifecycles,
        selectedLifecycle,
        searchString
      });
    }
    case "SELECT_LIFECYCLE": {
      if (state.hasNextVersionBeenModified) {
        return Object.assign({}, state, { doPromptToSaveChanges: true });
      }
      let selectedLifecycle = action.payload.lifecycle;
      if (!selectedLifecycle || state.selectedLifecycle && selectedLifecycle.id === state.selectedLifecycle.id) {
        return state;
      }
      return Object.assign({}, state, {
        selectedLifecycle,
        isLifecycleBeingAdded: !!selectedLifecycle.isNew,
        doPromptToSaveChanges: false
      });
    }
    case "CHANGE_LIFECYCLE_OF": {
      const selectedLifecycle = Object.assign({}, state.selectedLifecycle, {
        lifecycleOf: action.payload.lifecycleOf
      });
      return Object.assign({}, state, {
        selectedLifecycle
      });
    }
    case "SAVE_NEXT_VERSION_PENDING": {
      return Object.assign({}, state, {
        isNextVersionSaving: true
      });
    }
    case "SAVE_NEXT_VERSION_REJECTED": {
      return Object.assign({}, state, {
        isNextVersionSaving: false
      });
    }
    case "ACTIVATE_NEXT_VERSION_PENDING": {
      return Object.assign({}, state, {
        isNextVersionActivating: true
      });
    }
    case "ACTIVATE_NEXT_VERSION_REJECTED": {
      return Object.assign({}, state, {
        isNextVersionActivating: false
      });
    }
    case "MODIFY_NEXT_VERSION": {
      return Object.assign({}, state, {
        hasNextVersionBeenModified: action.payload.hasNextVersionBeenModified,
        doPromptToSaveChanges: false
      });
    }
  }

  return state;
};
