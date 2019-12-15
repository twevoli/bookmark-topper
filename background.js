(function (api) {
	//~ var debug = true;
	var debug = false;

	function log(msg) {
		if (debug) {
			console.log(msg);
		}
	}

	function move0( id, index) {
		api.move(id, {index: 0});
		log(`move: ${index} -> 0`);
	}

	function created(id, info) {
		//~ Move it to top in the default bookmark folder.
		move0(id, info.index);
	}

	function moved(id, info) {
		//~ Ignore move to top event.
		if (info.index === 0) {
			return;
		}

		log(`event: ${info.oldIndex} -> ${info.index}`);

		api.getChildren(info.parentId).then(function (list) {
			if (info.index === list.length - 1) {
				//~ Move it to top from the very bottom.
				move0(id, info.index);
			}
		}, function (e) {
			log(`rejected: ${e}`);
		});
	}

	api.onCreated.addListener(created);
	api.onMoved.addListener(moved);
})(browser.bookmarks);
