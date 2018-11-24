import addNotification from "./add-notification";
import removeNotification from "./remove-notification";
import pause from "./pause";
import play from "./play";

export default {
  addError: addNotification("error"),
  addInfo: addNotification("info"),
  addWarning: addNotification("warning"),
  addHighAlert: addNotification("highAlert"),
  removeNotification,
  pause,
  play
};
