'use strict';

function bookmarksTraversal(item, db) {
  if (item.children) {
    for (var i = 0; i < item.children.length; i++) {
      let child = item.children[i];
      if (child.children) {
        db.addTag(new Tag(child), {silent: true});
        bookmarksTraversal(child, db);
      } else {
        // bookmark
        db.addBookmark(new Bookmark(child), {silent: true});
      }
    }
  } else {
    // bookmark
    db.addBookmark(new Bookmark(item));
  }
}

function exportBookmarks(callback) {
  chrome.bookmarks.getTree((tree) => {
    bookmarksTraversal(tree[0], localDB);
    callback(localDB);
  });
}
