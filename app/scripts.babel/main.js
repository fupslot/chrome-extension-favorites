'use strict';

function onBookmarkCreated(id, bookmark) {
  console.log('A bookmark is created');
  console.log(`${id}`, bookmark);
  if (bookmark.url) {
    createBookmark(bookmark);
  }
}

function onBookmarkRemoved(id, bookmark) {
  console.log('A bookmark is removed');
  console.log(`${id}`, bookmark);
  if (bookmark.node && bookmark.node.url) {
    removeBookmark(bookmark.node);
  }
}

function onBookmarkChanged(id, bookmark) {
  changeBookmark(Object.assign({}, {id}, bookmark));
}

function initialize() {
  if (!ACCESS_TOKEN) {
    return Promise.reject({error: 'token'});
  }

  if (localStorage.getItem('bookmarks')) {
    return readRemoteIndex();
  }
  else {
    return findRemoteIndex().then(found => {
      return found === true
        ? readRemoteIndex()
        : createRemoteIndex().then(readRemoteIndex);
    });
  }
}


chrome.runtime.onInstalled.addListener(details => {
  exportBookmarks(function() {
    initialize()
      .then(function () {
        // chrome.bookmarks.onCreated.addListener(onBookmarkCreated);
        // chrome.bookmarks.onRemoved.addListener(onBookmarkRemoved);
        chrome.bookmarks.onChanged.addListener(onBookmarkChanged);
      })
      .then(() => console.log('favorite initialized'))
      .catch(function (data) {
        if (data.error === 'token') {
          console.warn('Cannot sync favorites. No access token!');
        }
        else {
          console.log('Oops!');
        }
      });
  });
});
