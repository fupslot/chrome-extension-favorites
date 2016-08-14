'use strict';
const localDB = (function () {
  function LocalDB(bookmarks = [], tags = []) {
    this.data = { tags: tags, bookmarks: bookmarks };
    PubSub.call(this);
  }

  // Should apply
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

  LocalDB.prototype.findIndex = function (collection, id) {
    let index = -1;

    for (var i = 0; i < collection.length; i++) {
      if (collection[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  LocalDB.prototype.addTag = function (newTag, {silent}) {
    this.data.tags.push(newTag);
    if (silent) this.emit('add', newTag);
  };

  LocalDB.prototype.changeTag = function (changeTag) {
    let localTagIndex = this.findIndex(this.data.tags, changeTag.id);
    if (localTagIndex !== -1) {
      let localTag = this.data.tags[localTagIndex];
      localTag.value = changeTag.value;
      this.emit('change', localTag);
    }
  };

  LocalDB.prototype.removeTag = function (tag) {
    let tagIndex = this.findIndex(this.data.tags, tag.id);
    if (tagIndex !== -1) {
      let tag = this.data.tags[tagIndex];
      this.data.tags.splice(tagIndex, 1);
      this.emit('remove', tag);
    }
  };


  LocalDB.prototype.addBookmark = function (newBookmark, {silent}) {
    this.data.bookmarks.push(newBookmark);
    if (silent) this.emit('add', newBookmark);
  };


  LocalDB.prototype.changeBookmark = function (changeBookmark) {
    let bookmarkIndex = this.findIndex(this.data.bookmarks, changeBookmark.id);
    if (bookmarkIndex !== -1) {
      let bookmark = this.data.bookmarks[bookmarkIndex];
      bookmark.title = changeBookmark.title;
      bookmark.url = changeBookmark.url;
      this.emit('change', bookmark);
    }
  };


  LocalDB.prototype.removeBookmark = function (bookmark) {
    let bookmarkIndex = this.findIndex(this.data.bookmarks, bookmark.id);
    if (bookmarkIndex !== -1) {
      let bookmark = this.data.bookmarks[bookmarkIndex];
      this.data.bookmarks.splice(bookmarkIndex, 1);
      this.emit('remove', bookmark);
    }
  };


  return new LocalDB();
}());

function DBWatcher(localDB) {
  localDB.on('change', (changeItem) => console.log('change', changeItem));
  localDB.on('add', (newItem) => console.log('add', newItem));
  localDB.on('remove', (removeItem) => console.log('remove', removeItem));
}

// should watch changes within DB
// create patches
// update remouteDB using patches
DBWatcher(localDB);
