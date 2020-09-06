function ShowToolTip(Qobj, txt)
{
    console.info("Im here bitches");
    Qobj.attr("Allow-ToolTip", "true");
    var span = q.create("SPAN", {text: "12"});
    Qobj.AddChild(span);
}