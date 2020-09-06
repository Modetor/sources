function boot() {
	loadApps();
	linkSystemEvents();
}



function loadApps() {
	q.Ajax.Get("../../../apps/app.list", (r) => {
		var temp = r.split("\n");
		for (var line in temp) {
			app_detials = temp[line].split(",");
			holder.apps.push({name: app_detials[0].trim(), path : app_detials[1].trim()});
		}

		// run the first app...
		app.runApp(holder.apps[0]);
	});
}


function linkSystemEvents() {
	// backbutton event...
	Device.Buttons.Backbutton.do("click", () => {
		if(app.history.length == 0) return;
		// the functionality is to fetch the previous app
		// which been disactivated, so remove the current
		// app, get the app before...
		// of course, depending on App historys we should
		// take the length-1 app :)

		// the running one
		app_recent = app.runningApp;
		app_previouse = app.history[app.history.length-1];
		console.log("now running: "+app_recent+", prev-app: "+app_previouse);
		tagCollection = qlist("*[name='"+app_recent+"']");
		prevTag = q("div[name='"+app_previouse+"']");

		tagCollection.RemoveAll();
		prevTag.attr("style", "");
		prevTag.attr("anim", "fadeout");
		app.runningApp = app_previouse;
		app.history.pop();
	});
}