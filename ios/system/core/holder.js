holder = {};

// { name:.. , path:..}
holder.apps = []

holder.runByName = (name) => {
	for(var l in holder.apps) {
		if(holder.apps[l].name == name) {
			app.runApp(holder.apps[l]);
			break;
		}
	}
}