var looper = {
	ready    : false,
	count    : 0,
	/* system:bool,name:packageName, block:code*/
	processes: [],

	addProcess : (isSys,pname, pblock) => {
					looper.processes.push({sys: isSys, name: pname, block: pblock});
					looper.count++;
				 },

	prepare : () => {
		looper.ready = true;
	}
};
looper.Loop = ()=> {
	if(!looper.ready) {console.error("No ready.. looper"); return;}
	setInterval(() => {
		try{
			for (var i = looper.processes.length - 1; i >= 0; i--) {
				temp = looper.processes[i];
				if(temp != undefined) {
					temp.block();
					if(!temp.sys) 
						delete looper.processes[i];
				}
			}
		}
		catch(e) {
			console.error(e);
		}
	}, 1000);
};



//looper.processes
