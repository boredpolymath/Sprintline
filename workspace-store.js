const workspaceStore = (() => {
  const databaseName = 'coding-sprint-scheduler'; // Keep existing workspaces accessible after renaming the app.
  const storeName = 'workspaces';
  const workspaceKey = 'active';
  const schemaVersion = 1;
  let connection;

  function open() {
    connection ??= new Promise((resolve, reject) => {
      const request = indexedDB.open(databaseName, 1);
      let blocked = false;
      request.onupgradeneeded = () => request.result.createObjectStore(storeName);
      request.onblocked = () => {
        blocked = true;
        reject(new Error('Close other scheduler tabs to open browser storage.'));
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const database = request.result;
        if (blocked) {
          database.close();
          return;
        }
        database.onversionchange = () => {
          database.close();
          connection = undefined;
        };
        resolve(database);
      };
    }).catch(error => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  async function read() {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readonly');
      const request = transaction.objectStore(storeName).get(workspaceKey);
      transaction.oncomplete = () => resolve(request.result);
      transaction.onabort = () => reject(transaction.error);
    });
  }

  async function write(data, expectedRevision) {
    const database = await open();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.get(workspaceKey);
      const revision = expectedRevision + 1;
      let conflict = false;
      request.onsuccess = () => {
        const current = request.result;
        if ((current?.revision ?? 0) !== expectedRevision || (current && current.schemaVersion !== schemaVersion)) {
          conflict = true;
          transaction.abort();
          return;
        }
        store.put({ schemaVersion, revision, data }, workspaceKey);
      };
      transaction.oncomplete = () => resolve(revision);
      transaction.onabort = () => reject(conflict
        ? new DOMException('Another tab saved a newer workspace.', 'VersionError')
        : transaction.error ?? new Error('The workspace write was aborted.'));
    });
  }

  return { read, write, schemaVersion };
})();
