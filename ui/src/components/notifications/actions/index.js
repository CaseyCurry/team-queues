import addNotification from "./add-notification";
import displayNotification from "./display-notification";
import expireNotification from "./expire-notification";
import removeNotification from "./remove-notification";

export default {
  addError: addNotification("error"),
  addInfo: addNotification("info"),
  addWarning: addNotification("warning"),
  addHighAlert: addNotification("highAlert"),
  displayNotification,
  expireNotification,
  removeNotification
};
