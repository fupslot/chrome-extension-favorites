'use strict';
const localDB = (function () {
  function LocalDB(bookmarks = [], tags = []) {
    this.data = { tags: tags, bookmarks: bookmarks };
    PubSub.call(this);
  }

  LocalDB.prototype.find = function (collection, entity) {
    let item = null;
    for (var i = 0; i < collection.length; i++) {
      if (collection[i].id === entity.id) {
        item = collection[i];
        break;
      }
    }
    return item;
  };

  LocalDB.prototype.addTag = function (tag) {
    this.data.tags.push(tag);
  };

  LocalDB.prototype.changeTag = function (changeTag) {
    let localTag = this.find(this.data.tags, changeTag);
    if (!localTag) return;
    localTag.value = changeTag.value;
    this.emit('change', changeTag);
  };

  LocalDB.prototype.removeTag = function (tag) {
    console.log('Not implemented yet!');
  };


  LocalDB.prototype.addBookmark = function (bookmark) {
    this.data.bookmarks.push(bookmark);
  };


  LocalDB.prototype.changeBookmark = function (bookmark) {
    console.log('Not implemented yet!');
  };


  LocalDB.prototype.removeBookmark = function (bookmark) {
    console.log('Not implemented yet!');
  };

  return new LocalDB();
}());

function DBWatcher(db) {
  db.on('change', function(changeTag) {
    console.log(changeTag);
  });
}

// should watch changes within DB
// create patches
// update remouteDB using patches
DBWatcher(localDB);
