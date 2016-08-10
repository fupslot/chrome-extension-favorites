'use strict';

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

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


initialize()
  .then(function () {
    chrome.bookmarks.onCreated.addListener(onBookmarkCreated);
    chrome.bookmarks.onRemoved.addListener(onBookmarkRemoved);
  })
  .catch(function (data) {
    if (data.error === 'token') {
      console.warn('Cannot sync favorites. No access token!');
    }
    else {
      console.log('Oops!');
    }
  })
;
