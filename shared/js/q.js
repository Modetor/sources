function getChilderns(elem)
    {
        if(elem == null || elem.children.length == 0) return;
        var childs = [];
        for (let index = 0; index < elem.children.length; index++) {
            childs[index] = q(elem.children[index]);
        }
        return childs;
}






var last_q = null;
var q = function(selector = null, use_collection = false)
{
    var elem;
    if(selector == null || selector == undefined)
        elem = last_q;
    else if(typeof selector == "string")
    {
        if(use_collection)
        {
            elem = document.querySelectorAll(selector);
            if(elem.length > 1)
                return qlist(elem);
        }
        else
            elem = document.querySelector(selector);

    }
    else // it should be an HTML object
        elem = selector;
    if(elem == null) {console.error("Error elem is null > "+selector); return; }
    last_q = elem;

    

    var _m = 
    {
        Tag          : null,
        Text         : (t = null) => {if(t == null) return  elem.textContent; elem.innerHTML = t; },
        Html         : (t = null) => {if(t == null) return  elem.innerHTML; elem.innerHTML = t; },
        Value        : (t = null) => {if(t == null) return  elem.value; elem.value = t; },
        ID           : elem.id,
        Target       : elem,
        Parent       : () => {return q(elem.parentElement);},
        TargetParent : elem.parentElement,
        Childs       : () => { return getChilderns(elem); },
        AddChild     : (qObj) =>
        {
            if(qObj == null) return;
            elem.appendChild(qObj.Target);
        },
        Remove       : () => {
                elem.remove(elem);
        },
        RemoveChild  : (qChild) => {
                elem.removeChild(q.Target);
        },
        do           : (event_type, mCallBack) => {
                elem.addEventListener(event_type, mCallBack, false);
            },
        click        : (mCallBack) => {elem.onClick = mCallBack;},
        attr         : (k, v = null) =>
        {
            if(v == undefined)
                return elem.getAttribute(k);
            else
                elem.setAttribute(k, v);
        },
        hasattr : (n) => {
            return elem.getAttribute(n) != undefined;
        },
        rattr : (n) => {
            elem.removeAttribute(n);
        },
        css          : (properties) =>
        {
          if(properties == null || properties == undefined) return elem.style;
          if(typeof properties == "string")
          {
            var kv = properties.split(":");
            elem.style[kv[0]] = kv[1]; 
          }
          else if(typeof properties == "object")
          {
            for (var k in properties) {
              elem.style[k] = properties[k];
            }
          }
        },
        Clone : () => {return q(elem.cloneNode());}
    };
    return _m;
}

q.create = (type, props = {}) =>{
    var elem = document.createElement(type);
    for(var key in props)
    {
        if(key == "text")
            elem.innerText = props[key];
        else if(key == "html")
            elem.innerHTML = props[key];
        else
            elem.setAttribute(key, props[key]);
    }

    return q(elem);
}

q.body = null;

q.ready = (mCallback,multi_sets = false) =>
        {
            document.onreadystatechange = (ev) =>
            {
                if(multi_sets)
                    mCallback(document.readyState);
                else if(document.readyState == "complete") 
                  {
                    q.body = q("body");
                    mCallback(null);
                  }
            }
        }

q.Ajax = 
{
    ResponseTypes : { XML : 0 , TEXT : 1, URL : 2, ANY: 3},
    ResponseType : 1,
}

q.Ajax.Get = (url, mCallBack , async = true) =>
{
      var xhr = new XMLHttpRequest();
      xhr.open("get", url, async);
      xhr.onreadystatechange = () =>
      {
          if(xhr.readyState == 4 && xhr.status == 200)
          {
              switch(q.Ajax.ResponseType)
              {
                  case 0:
                      mCallBack(xhr.responseXML);
                      break;
                  case 1:
                      mCallBack(xhr.responseText);
                      break;
                  case 2:
                      mCallBack(xhr.responseURL);
                      break;
                  case 3:
                      mCallBack(xhr.response);
                      break;
              }
          }
      }
      xhr.send(null);
}
q.Ajax.Post = (url, data = {}, mCallBack, async = true) =>
{
    if(data == undefined) return;
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, async);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () =>
    {
        if(xhr.readyState == 4 && xhr.status == 200)
        {
            switch(q.Ajax.ResponseType)
            {
                case 0:
                    mCallBack(xhr.responseXML);
                    break;
                case 1:
                    mCallBack(xhr.responseText);
                    break;
                case 2:
                    mCallBack(xhr.responseURL);
                    break;
                case 3:
                    mCallBack(xhr.response);
                    break;
            }
        }
    }
    var formated_data = "";
    for(var key in data)
    {
        formated_data += ( key+"="+data[key]+"&" );
    }
    formated_data = formated_data.substr(0,formated_data.length-1);
    xhr.send(encodeURI(formated_data));
    
}

q.Ajax.GetConfig = (url, config) => {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.upload.onloadstart = config.onuploadstart;
    xhr.upload.onprogress = config.onuploadprogress;
    xhr.onprogress = config.onprogress;
    xhr.ontimeout = config.ontimeout;
    xhr.onloadstart = config.onstart;
    xhr.onload = function() {
    if(xhr.readyState == 4 && xhr.status == 200)
        {
            switch(q.Ajax.ResponseType)
            {
                case 0:
                    config.success(xhr.responseXML);
                    break;
                case 1:
                    config.success(xhr.responseText);
                    break;
                case 2:
                    config.success(xhr.responseURL);
                    break;
                case 3:
                    config.success(xhr.response);
                    break;
            }
        }
    }
    xhr.send(null);
}

q.Ajax.PostConfig = (url, config) => {
    var xhr = new XMLHttpRequest();
    xhr.open("post", url, true);
    xhr.upload.onloadstart = config.onuploadstart;
    xhr.upload.onprogress = config.onuploadprogress;
    xhr.onprogress = config.onprogress;
    xhr.ontimeout = config.ontimeout;
    xhr.onloadstart = config.onstart;
    xhr.onload = function() {
    if(xhr.readyState == 4 && xhr.status == 200)
        {
            switch(q.Ajax.ResponseType)
            {
                case 0:
                    config.success(xhr.responseXML);
                    break;
                case 1:
                    config.success(xhr.responseText);
                    break;
                case 2:
                    config.success(xhr.responseURL);
                    break;
                case 3:
                    config.success(xhr.response);
                    break;
            }
        }
    }
    var formated_data = "";
    for(var key in config.data)
    {
        formated_data += ( key+"="+config.data[key]+"&" );
    }
    formated_data = formated_data.substr(0,formated_data.length-1);
    xhr.send(encodeURI(formated_data));
}
var last_qlist = null;
var qlist  = function(selector = null)
{
    var elem;
    if(selector == null || selector == undefined)
        elem = last_qlist;
    else if(typeof selector == "string")
    {
        elem = document.querySelectorAll(selector);
        if(elem.length == 1)
            return q(elem[0]);

    }
    else // it should be an HTML object
        elem = selector;
    if(elem == null) {console.error("Error elem is null !!"); return; }
    last_qlist = elem;
    var _m = 
    {
        Length       : elem.length,
        Text         : (t = null) => {if(t == null)
            if(t == null)
            {
                coll = [elem.length]; 
                for (let index = 0; index < elem.length; index++) {
                const element = array[index];
                coll[i] = element.textContent;
                }
                return coll;
            }
            else
            {
                for (let index = 0; index < t.length && index < elem.length; index++) {
                    array[index].textContent = t[i];
                }
            }
        },
        Html         : (t = null) => {if(t == null) return  elem.innerHTML; elem.innerHTML = t; },
        Value        : (t = null) => {if(t == null) return  elem.value; elem.value = t; },
        Get : (index) => { return q(elem[index]); },
        //Parent       : () => {return q(elem.parentElement);},
        TargetParent : elem.parentElement,
        Target : elem,
        do           : (event_type, mCallBack) => {
            elem.forEach((e) => {
                e.addEventListener(event_type, mCallBack);
            });
            },
        click        : (mCallBack) => {elem.onClick = mCallBack;},
        attr         : (k, v = null) =>
        {
            if(v == undefined)
                return elem.getAttribute("xo");
            else
                elem.setAttribute(k, v);
        },
        css          : (properties) =>
        {
          if(properties == null || properties == undefined) return elem.style;
          if(typeof properties == "string")
          {
            var kv = properties.split(":");
            for(var e in elem) {
                elem[e].style[kv[0]] = kv[1]; 
            }
          }
          else if(typeof properties == "object")
          {
            for (var k in properties) {
                for(var e in elem) {
                    elem[e].style[k] = properties[k];
                }
            }
          }
        },

        forEach : (mCallBack) => {
            for (var i = 0; i < elem.length; i++) {
                mCallBack(q(elem[i]));
            }
        },

        RemoveAll : () => {
            for (var i = 0; i < elem.length; i++) {
                elem[i].remove();
            }
        }
    };
    return _m;
}

q.create = (type, props = {}) =>{
    var elem = document.createElement(type);
    for(var key in props)
    {
        if(key == "text")
            elem.innerHTML = props[key];
        else
            elem.setAttribute(key, props[key]);
    }

    return q(elem);
    
}








window.q = q;