let black_layer = q('div[element-type="Black-layer"]'),
    context_menu = q('div[element-type="Context-menu"]'),
    panels = qlist('panel[name="last_actions"]');

function hide()
{
    black_layer.css({animation : "fade_in 0.3s ease-out"});
    context_menu.css({animation : "move_right 0.3s ease-out"});
    black_layer.do('animationend', () => {
        black_layer.css({display: "none"});
    });
    context_menu.do('animationend', () => {
        context_menu.css("display: none");
    });

}
function show()
{
    black_layer.css({display: "block", animation : "fade_out 0.3s ease-out"});
    context_menu.css({display: "block", animation : "move_left 0.3s ease-out"});
    black_layer.do('animationend', () => {
        black_layer.css("display: block");
    });
    context_menu.do('animationend', () => {
        context_menu.css("display: block");
    });
}

function fixUI() {
    if(window.innerWidth <= 1396) {
        panels.Get(0).Target.style.width = "70%";
        panels.Get(1).Target.style.width = "70%";
    } else {
        panels.Get(0).Target.style.width = "40%";
        panels.Get(1).Target.style.width = "40%";
    }
}


let ql = q("box", true);
for (let index = 0; index < ql.length; index++) {
	const element = ql.Get(index).Target;
	element.onselectstart = () => {return false;};
}

//
// Context-menu
//
var menu_items = context_menu.Childs();
for (let index = 0; index < menu_items.length; index++) {
    const element = menu_items[index];
    element.Target.onselectstart = () => {return false;};
}



function AssocMenuEvents()
{
    const products = q("#products");
    const products_nodes = qlist("div[element-type='Context-menu'] > div[name='products']");
    const products_arraw = q("#products > img");
    products.Tag = true;
    products.do('click', () => {
        
        if(products.Tag)
        {
            for(let i = 0; i < products_nodes.Length; i ++)
            {
                const element = products_nodes.Get(i);
                element.css({display: "block"});
            }
            products_arraw.css({display : "none"});
        }
        else
        {
            for(let i = 0; i < products_nodes.Length; i ++)
            {
                let element = products_nodes.Get(i);
                element.css({display: "none"});
            }
            products_arraw.css({display : "block"});
        }
        products.Tag = !products.Tag;
    });
    //#1
    products_nodes.Get(0).do('click', () => {
        location.href = "products/view.html";
    });
}
