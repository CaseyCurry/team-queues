import uuidv4 from "uuid/v4";

const initialState = Object.freeze({
  areLifecyclesLoading: false,
  lifecycles: [],
  selectedLifecycle: null,
  isAddingLifecycle: false,
  searchString: null,
  isNextVersionSaving: false,
  isNextVersionActivating: false,
  hasNextVersionBeenModified: false,
  doPromptToSaveChanges: false,
  defaultVersionCreator: () => {
    return {
      id: uuidv4(),
      version: 1,
      triggersForItemCreation: [],
      queues: [],
      isNew: true
    };
  }
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
      const mergedLifecycles = action.payload.lifecycles
        .map((lifecycle) => lifecycle.lifecycleOf)
        .filter((x, y, z) => z.indexOf(x) === y)
        .map((lifecycleOf) => {
          const sortedVersions = action.payload.lifecycles
            .filter((lifecycle) => lifecycle.lifecycleOf === lifecycleOf)
            .sort((x, y) => x.version < y.version ? -1 : 1);
          const activeVersion = sortedVersions
            .find((lifecycle) => lifecycle.status === "Active");
          let nextVersion = sortedVersions
            .find((lifecycle) => lifecycle.status === "WorkInProgress");
          let previousVersion = activeVersion ?
            sortedVersions.find((lifecycle) => lifecycle.version < activeVersion.version) : null;
          if (!previousVersion) {
            /* The nextVersion actually persisted is used here prior to conditionally creating
               a default immediately below. */
            previousVersion = nextVersion ?
              sortedVersions
                .find((lifecycle) => lifecycle.version < nextVersion.version) : null;
          }
          /* We always create a place to add a WIP if there isn't one already. But we
             only do it after the previous version that is actually persisted has been
             used in the logic immediately above. */
          if (!nextVersion) {
            nextVersion = state.defaultVersionCreator();
          }
          return {
            lifecycleOf,
            previousVersion,
            activeVersion,
            nextVersion
          };
        });
      const sortedLifecycles = mergedLifecycles
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
      if (!selectedLifecycle || state.selectedLifecycle && selectedLifecycle.lifecycleOf === state.selectedLifecycle.lifecycleOf) {
        return state;
      }
      return Object.assign({}, state, {
        selectedLifecycle,
        isAddingLifecycle: selectedLifecycle.isNew,
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
