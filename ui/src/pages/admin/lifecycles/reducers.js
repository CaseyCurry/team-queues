const initialState = Object.freeze({
  areLifecyclesLoading: false,
  lifecycles: [],
  selectedLifecycle: null,
  isAddingLifecycle: false,
  searchString: null,
  isLifecycleSaving: false
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
        .map((lifecycle) => Object.assign({}, lifecycle, { displayName: () => `${lifecycle.lifecycleOf} V${lifecycle.version}`}))
        .sort((x, y) => x.displayName().toLowerCase() < y.displayName().toLowerCase() ? -1 : 1);
      const activeLifecycles = sortedLifecycles.filter((lifecycle) => lifecycle.isActive);
      const selectedLifecycle = activeLifecycles.length ?
        activeLifecycles[0] : null;
      return Object.assign({}, initialState, {
        lifecycles: sortedLifecycles,
        selectedLifecycle,
        searchString
      });
    }
    case "SELECT_LIFECYCLE": {
      let selectedLifecycle = action.payload.lifecycle;

      if (!selectedLifecycle || state.selectedLifecycle && selectedLifecycle.id === state.selectedLifecycle.id) {
        return state;
      }

      return Object.assign({}, state, {
        selectedLifecycle,
        isAddingLifecycle: selectedLifecycle.isNew
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
    case "SAVE_LIFECYCLE_PENDING": {
      return Object.assign({}, state, {
        isLifecycleSaving: true
      });
    }
    case "SAVE_LIFECYCLE_REJECTED": {
      return Object.assign({}, state, {
        isLifecycleSaving: false
      });
    }
  }

  return state;
};
