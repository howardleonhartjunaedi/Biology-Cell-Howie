function ignoreSkippedTransition(event) {
  var transition = event.viewTransition;
  if (!transition) return;
  var noop = function () {};
  transition.ready.catch(noop);
  transition.finished.catch(noop);
  if (transition.updateCallbackDone) transition.updateCallbackDone.catch(noop);
}

window.addEventListener('pageswap', ignoreSkippedTransition);
window.addEventListener('pagereveal', ignoreSkippedTransition);
