function Tag({id, title}) {
  this.id = Number(id);
  this.value = title;
}

function Bookmark({id, parentId, title, url}) {
  this.id = Number(id);
  this.tagId = Number(parentId);
  this.title = title;
  this.url = url;
}
