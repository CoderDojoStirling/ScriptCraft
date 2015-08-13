var utils = require('utils'),
    foreach = utils.foreach,
    livereload = require('livereload'),
    File = java.io.File,
    blackboardDir = new File(__dirname + '/../../blackboard/'),
    serverAddress = utils.serverAddress();

var store = persist('blackboard', { enableScripting: false });

function startBlackboard() {
    if (!blackboardDir.exists()) {
        blackboardDir.mkdirs();
    }

    runForSubdirs(blackboardDir, function (subdir) {
        livereload.enableLiveReloadForDir(subdir, subdir.getName());
    });
}

function stopBlackboard() {
    runForSubdirs(blackboardDir, function (subdir) {
        livereload.disableLiveReloadForDir(subdir);
    });
}

function runForSubdirs(dir, runnable) {
    var files = dir.listFiles();
    if ( !files ) {
        return;
    }
    for ( var i = 0; i < files.length; i++ ) {
        var file = files[i];
        if (file.isDirectory( )) {
            runnable(file);
        }
    }
}

var _blackboard = {
    allowScripting: function (/* boolean: true or false */ canScript, sender ) {
        sender = utils.player(sender);
        if ( !sender ) {
            console.log( 'Attempt to set blackground scripting without credentials' );
            console.log( 'blackboard.allowScripting(boolean, sender)' );
            return;
        }
        /*
         only operators should be allowed run this function
         */
        if ( !isOp(sender) ) {
            console.log( 'Attempt to set blackboard scripting without credentials: ' + sender.name );
            echo( sender, 'Only operators can use this function');
            return;
        }

        canScript ? startBlackboard() : stopBlackboard();

        store.enableScripting = canScript;

        echo( sender, 'Blackboard turned ' + ( canScript ? 'on' : 'off' ) +
            ' for all players on server ' + serverAddress);
    }
};

if (store.enableScripting) {
    startBlackboard();
}

module.exports = _blackboard;
