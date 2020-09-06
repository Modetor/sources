const mainview = q("div.screen");

const Device = {
	Screen : {
				Width : mainview.Target.clientWidth,
				Height : mainview.Target.clientHeight
		     },
    Buttons : {
    			Backbutton : q('button[device-type="backbutton"')
    	     }
}