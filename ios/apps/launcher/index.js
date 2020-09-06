let container = q("#container");


searchInput = q("#search_input");
searchInput.Target.onkeyup = (e)=> {
	if(e.keyCode === 13) {
		preformSearch();
	}
};

function preformSearch() {
	text = searchInput.Value()
	console.log("Text: "+text);
	q.Ajax.Get("ios/apps/launcher/search.php?request="+text, (r) => {
		container.Html(r);
		console.info("we got it, len "+r.length);
	});
}

