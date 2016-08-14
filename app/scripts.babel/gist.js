let remoteIndexId = localStorage.getItem('bookmarks');
const localIndex = { keys: {} };
const ACCESS_TOKEN = localStorage.getItem('access_token');
const GITHUB_API = 'https://api.github.com';
const EMPTY = '{}';

function GithubURL(fragment) {
  this.toString = function() {
    return `${GITHUB_API}${fragment}?access_token=${ACCESS_TOKEN}`;
  };
}

function rebuildLocalIndex(content) {
  if (content === EMPTY) return;
  try {
    localIndex.keys = JSON.parse(content);
  } catch (e) {
    console.log('Remote Index is corrupted');
  }
}

function appendBookmarkToLocalIndex(bookmark) {
  localIndex.keys[bookmark.id] = {
    title: bookmark.title,
    url: bookmark.url
  };
}


function removeBookmarkFromLocalIndex(bookmark) {
  delete localIndex.keys[bookmark.id];
}


function updateRemoteIndex() {
  const URL = new GithubURL(`/gists/${remoteIndexId}`);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json;charset=UTF-8');

  const body = {
    files: {
      'chromeExtensionBookmarks': {
        content: JSON.stringify(localIndex.keys)
      }
    }
  };

  let request = new Request(URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  return fetch(request);
}



function createRemoteIndex() {
  const URL = new GithubURL('/gists');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = {
    description: 'Bookmarks',
    public: true,
    files: {
      'chromeExtensionBookmarks': { content: EMPTY }
    }
  };

  let request = new Request(URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  return fetch(request)
    .then(response => response.json())
    .then(data => {
      remoteIndexId = data.id;
      localStorage.setItem('bookmarks', data.id);
    });
}

function readRemoteIndex() {
  const URL = new GithubURL(`/gists/${remoteIndexId}`);

  let request = new Request(URL);

  return fetch(request)
    .then(response => response.json())
    .then(data => {
      rebuildLocalIndex(data.files.chromeExtensionBookmarks.content);
    });
}

function findRemoteIndex() {
  const URL = new GithubURL('/gists');
  const request = new Request(URL);
  return fetch(request)
    .then(response => response.json())
    .then(data => {
      return data.some(record => {
        if (record.files.chromeExtensionBookmarks) {
          localStorage.setItem('bookmarks', record.id);
          remoteIndexId = record.id;
          return true;
        }
        return false;
      })
    });
}

function createBookmark(bookmark) {
  appendBookmarkToLocalIndex(bookmark);
  return updateRemoteIndex();
}

function removeBookmark(bookmark) {
  removeBookmarkFromLocalIndex(bookmark);
  return updateRemoteIndex();
}
