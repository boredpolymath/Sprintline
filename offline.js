(() => {
  const notice = document.querySelector('#connection-status');
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const canRegister = 'serviceWorker' in navigator &&
    (!isLocal || new URLSearchParams(location.search).get('offline') === '1');
  let worker;

  function updateNotice() {
    if (!navigator.onLine) {
      notice.textContent = navigator.serviceWorker?.controller
        ? 'Offline · Changes are saved in this browser.'
        : 'Offline · Keep this tab open to continue working.';
    } else if (worker?.waiting) {
      notice.textContent = 'Update available · Close and reopen all Sprintline tabs to apply it.';
    } else {
      notice.textContent = '';
    }
  }

  window.addEventListener('online', updateNotice);
  window.addEventListener('offline', updateNotice);
  navigator.serviceWorker?.addEventListener('controllerchange', updateNotice);
  updateNotice();

  if (canRegister) {
    navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
      .then(registration => {
        worker = registration;
        const watchInstalling = () => registration.installing?.addEventListener('statechange', updateNotice);
        registration.addEventListener('updatefound', watchInstalling);
        watchInstalling();
        updateNotice();
      })
      .catch(error => console.warn('Sprintline could not prepare offline access.', error));
  }
})();
