var app = {};
app.history = [];
app.runningApp = null;
app.runApp = (app_detials = {}) => {
	if(app.runningApp != null) {
		app.history.push(app.runningApp);
	}
	q.Ajax.Get(app_detials.path+"/index.html", (r) => {
		let temp = r.split("ui:");
		if(temp.length == 1)
			app.bindWithUI(r);
		else
		{
			app.bindWithUI(temp[1]);
			q.Ajax.Get(app_detials.path+"/"+temp[0], (s) => {
				script = q.create("script");
				script.attr("type","text/javascript");
				script.attr("name", app_detials.name);
				script.Text(s);
				q("body").AddChild(script);
			})
		}
	});

	app.runningApp = app_detials.name;
}

app.bindWithUI = (r) => {
	//var 
	if(app.history.length != 0) {
		qlist("div.mainview").css("display:none");
	}
	mainview.Html(mainview.Html()+r);
};

//<script type='text/javascript' name='Camera, lanucher,table'> script ....</script>