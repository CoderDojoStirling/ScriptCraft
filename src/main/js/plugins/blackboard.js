var bb = require('blackboard');

command(function blackboard( params, sender){
  if (params[0] == 'on'){
    bb.allowScripting(true, sender);
  }else {
    bb.allowScripting(false, sender);
  }
},['on','off']);
exports.blackboard = bb;
