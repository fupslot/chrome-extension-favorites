let remoteIndexId = localStorage.getItem('bookmarks');
const localIndex = { keys: {} };
const ACCESS_TOKEN = '7c19360c8b884ecb9db55587723211c4475184b0';
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
  console.log('Local Index was updated');
}


function removeBookmarkFromLocalIndex(bookmark) {
  delete localIndex.keys[bookmark.id];
  console.log('Local Index was updated');
}


function updateRemoteIndex() {
  const URL = new GithubURL(`/gists/${remoteIndexId}`);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json;charset=UTF-8');

  const body = {
    files: {
      'bookmarks': {
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

function createBookmark(bookmark) {
  appendBookmarkToLocalIndex(bookmark);
  return updateRemoteIndex();
}

function removeBookmark(bookmark) {
  removeBookmarkFromLocalIndex(bookmark);
  return updateRemoteIndex();
}

function createRemoteIndex() {
  const URL = new GithubURL('/gists');
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');

  const body = {
    description: 'Bookmarks',
    public: true,
    files: {
      'bookmarks': { content: EMPTY }
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
      rebuildLocalIndex(data.files.bookmarks.content);
    });
}


function initialize() {
  if (localStorage.getItem('bookmarks')) {
    return readRemoteIndex();
  }
  return createRemoteIndex().then(readRemoteIndex);
}
