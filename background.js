(function (api) {
    // let debug = true;
    let debug = false;

    function log(msg) {
        if (debug) {
            console.log(msg);
        }
    }

    function topit( id, info) {
        log(`move ${info.index} => 0`);
        api.move(id, {index: 0});
    }

    async function onCreated(id, info) {
        try {
            log(`ev: created ${info.type}, index ${info.index}`);

            let siblings = await api.getChildren(info.parentId);
            if (info.index >= siblings.length-1) {
                // Item creation could be split into stages: create at the last
                // position, move elsewhere. It happens with folders. To deal
                // with it, wait for some time after the "created" event and
                // check if the position has changed. If the item is still the
                // last, move to the top.
                setTimeout(async () => {
                    let query = await api.get(id);
                    if (info.index === query[0].index) {
                        topit(id, info);
                    }
                }, 100);
            }
        } catch (e) {
            log(`error: ${e}`);
        }
    }

    async function onMoved(id, info) {
        try {
            let AB = (info.parentId === info.oldParentId) ? "A" : "B";
            log(`ev: moved A:${info.oldIndex} => ${AB}:${info.index}`);

            // Nothing to do if moved to the top
            if (!info.index) return;

            let siblings = await api.getChildren(info.parentId);
            if (info.index >= siblings.length-1) {
                topit(id, info);
            }
        } catch (e) {
            log(`error: ${e}`);
        }
    }

    api.onCreated.addListener(onCreated);
    api.onMoved.addListener(onMoved);

})(browser.bookmarks);
