
var ProductsCart = [];
var BillsArray = [];
var ChosenBill = null;
var InBillMode = false;
var RemoveBillItemsProcedures = [];
let ProductTable = q('table[product-list]');
let inputField = q('input[product-code-field]');

// toolbox side stuff
let NumpadResult = q('div[user-toolbox] > div[container] > div[numpad-result] > font');
let TotalpriceFont = q('#TOTAL_PRICE_FONT');
// user profile
let UserProfileContainer = q('div[user-profile]');
// info dialog
let InfoContainer = q('div[info-dialog]');
// speed access for uncatogrized products;
let SpeedAccessPanel = q('div[uncatogrized-items]');
let SpeedAccessElementList = q('div[uncatogrized-items]  > .salt_list');
// restore bill 
let RestoreBillPanel = q('div[restore-bill]');
let RestoreBillSearchInput = q('div[restore-bill] > div[input-container] > input');
let RestoreBillContent = q('div[restore-bill] > div[content-container]');
// search by name
let SearchByNamePanel = q('div[search-by-name]');
let SearchByNameInput = q('div[search-by-name] > div[input-container] > input');
let SearchByNameContent = q('div[search-by-name] > div[content-container]');
// user interactive buttons
let CashButton = q('button[user-interactive-cash-button]');
let CreditcardButton = q('button[user-interactive-creditcard-button]');
let SadadButton = q('button[user-interactive-sadad-button]');
let CancelButton = q('button[user-interactive-cancel-button]');
let SaveBillButton = q('button[user-interactive-savebill-button]');
let CancelEditBillButton = q('button[user-interactive-cancel-editbill-button]');

/* 
   force focusing on inputField element due to barcode incoming-
   data'll be lost if no input field were in focus.
*/
inputField.Target.focus();
function refocus() { inputField.Target.focus();  }
/*
    displaying user-name as Tooltip on userIcon
    and attach an event to show user-profile card
*/

function ShowHideUserProfile() {
    if(UserProfileContainer.hasattr('hidden')) {
        UserProfileContainer.rattr('hidden');
        HideInfoDialog();
    }
    else
        UserProfileContainer.attr('hidden', '');
}
function HideUserProfile() {
    UserProfileContainer.attr('hidden', '');
}

function ShowHideInfoDialog() {
    if(InfoContainer.hasattr('hidden')) {
        InfoContainer.rattr('hidden');
        HideUserProfile();
    }
    else
        InfoContainer.attr('hidden', '');
}
function HideInfoDialog() {
    InfoContainer.attr('hidden', '');
}

/* show and hide speed access div */
function ShowSpeedAccessPanel() {
    if(SpeedAccessPanel.hasattr('hidden'))
        SpeedAccessPanel.rattr('hidden');

    HideSearchForProductByNamePanel();
    HideRestoreBillPanel();
}
function HideSpeedAccessPanel() {
    SpeedAccessPanel.attr('hidden', '');
    EnableInputField();
}

function ShowRestoreBillPanel() {
    if(InBillMode) {
        CancelEditBill();
    }
    HideSearchForProductByNamePanel();
    HideSpeedAccessPanel();

    if(ProductsCart.length > 0) {
        let Ok_continue = false;
        swal.fire({
            title: 'تنبيه',
            text: 'سيتم إلغاء الفاتورة الحالية في حال أردت الإستمرار بإجراء إسترداد فاتورة',
            type: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#D32F2F',
            cancelButtonText: 'إلغاء',
            confirmButtonText: 'إستمرار',
            }).then((res) => {
                    if(res.value){
                        ClearCart();
                        inputField.Target.disabled = true;
                        if(RestoreBillPanel.hasattr('hidden'))
                            RestoreBillPanel.rattr('hidden');
                        RestoreBillSearchInput.Target.focus();
                    } 
                    else if(res.dismiss == 'cancel') { }
        });	
    }
    else{
        inputField.Target.disabled = true;
        if(RestoreBillPanel.hasattr('hidden'))
            RestoreBillPanel.rattr('hidden');
        RestoreBillSearchInput.Target.focus();
    }
}
function HideRestoreBillPanel() {
    RestoreBillPanel.attr('hidden', '');
    EnableInputField();
}

function ShowSearchByNamePanel() {
    
    if(SearchByNamePanel.hasattr('hidden')) {
        HideSpeedAccessPanel();
        HideRestoreBillPanel();

        inputField.Target.disabled = true;
        SearchByNamePanel.rattr('hidden');
        SearchByNameInput.Target.focus();
    }
    else
        HideSearchForProductByNamePanel();
}
function HideSearchForProductByNamePanel() {
    SearchByNamePanel.attr('hidden', '');
    EnableInputField();
}

function ShowSessionExpiredDialog() {
    swal.fire({
        title: 'إنتهت جلسة العمل',
        text: 'الرجاء الضغط على زر إعادة الدخول في حال أردت الدخول بحساب أخر أو زر تمديد جلسة العمل للإستمرار بنفس الحساب',
        showCancelButton: true,
        cancelButtonColor: '#F9A825',
        cancelButtonText: 'أعد الدخول من جديد',
        confirmButtonText: 'تمديد جلسة العمل',
        }).then((res) => {
                if(res.value){
                    q.Ajax.Get('backend/revalidate_session.php?sid='+sessionStorage.getItem('sid'), v => {
                        if(v == '1')
                            swal.fire({type:'success', text: 'تم تجديد جلسة العمل بنجاح'});
                        else
                            swal.fire(v);
                    });
                } 
                else if(res.dismiss == 'cancel') {
                    sessionStorage.clear();
                    location.href = 'http://'+location.host+'/site';
                }
    });	
}




function EnableInputField() {
    inputField.Target.disabled = false;
    inputField.Target.focus();
}
/* 
    Numpad event handler and user input processing elements categories:
    0 - 'del' attribute : delete $(content)'s data
    1 - 'done' attribute : perform calculation and displays the result
    2 - 'calc' attribute : runs windows native calculator app
    3 - 'dot' attribute : duprecated numpad input method
    4 - others : add data to $(content)
*/
var content = '';
qlist('div[numpad] > font[key]').do('click', (e) => {
    if(ProductsCart.length == 0) return;
    
    if (e.toElement.hasAttribute('del'))
        content = '';
    else if (e.toElement.hasAttribute('done')) {
        
        if(InBillMode) { 
            swal.fire('لا يمكن إجراء تعديلات على أي فاتورة بإستثناء حذف منتجات');
            return;
        }
        let wantedCount = parseFloat(content);
        if(Number.isNaN(wantedCount)) {
            swal.fire('أدخل الكمية المطلوبة أولا'); return;
        }
        let json = ProductsCart[ProductsCart.length-1];
        if(wantedCount > json.cquantity){
            swal.fire("تجاوزت الكمية المطلوبة كمية المخزون" + "(" + json.cquantity +")");
            return;
        }
        
        json.quantity = wantedCount;
        NumpadResult.css('color: rgb(20,20,20)');
        NumpadResult.Text(json.price + " x " + json.quantity + " = " + (json.price*json.quantity).toFixed(3));
        try{
            let row = q('table[product-list] > tr[sn="'+json.sn+'"]').Target;
            row.children[3].textContent = json.quantity;
            row.children[5].textContent = json.quantity * json.price;
        }
        catch(err) {console.error(err);}
        
        content = '';

        DisplayTotalPrice();
    }
    else{
        if(InBillMode) { 
            swal.fire('لا يمكن إجراء تعديلات على أي فاتورة بإستثناء حذف منتجات');
            return;
        }
        
        let json = ProductsCart[ProductsCart.length-1];

        if (e.toElement.hasAttribute('dot')) {
            if(json.measurable == 1)
                content += '.';
            else
                swal.fire('هذا المنتج لا يدعم البيع بالتجزئة');
        }
        else
            content += e.toElement.innerText;

        try {
            NumpadResult.css('color: rgb(100,100,100)');
            NumpadResult.Text(json.price + " x " + content + " = " + json.price*parseFloat(content).toFixed(3));
        } catch(exp) {
            swal.fire('خطأ، قيم(ه) مدخلة غير عددية');
            content = '1';
            NumpadResult.css('color: rgb(100,100,100)');
            NumpadResult.Text(json.price + " x " + 1 + " = " + (json.price*1));
        }
        
        
    }
});



/* returns json object's index in ProducCart array */
function IndexOf(sn) {
    let iterator = ProductsCart.values();
    var temporaryStuf = null;
    var i = 0; var f = false;
    while((temporaryStuf = iterator.next().value) != null) {
        if(temporaryStuf.sn == sn){f = true;  break;}
        i++;
    }
    return !found ? -1 : i;
}


/* add a new row based on $(json) argument */
function AddToTable(json) {

    let tr = q.create('TR');
    tr.attr('sn', json.sn);
    let rowCellsText = ['<img src="res/delete_forever_48px.png" width="20px" height="20px" alt="del">', ProductsCart.length, json.name, json.quantity, json.price, json.quantity*json.price];

    for(var i = 0; i < rowCellsText.length; i++){
        let col = q.create('TD');
        col.Text(rowCellsText[i]);
        if(i == 0) {
            col.Target.onclick = (e) => {
                if(InBillMode){
                    RemoveBillItemsProcedures.push(json);
                }
                ProductsCart = ProductsCart.filter(e=> {if(e.sn != json.sn) return e;});
                DisplayTotalPrice();
                tr.Remove();
                if(ProductsCart.length == 0 && !InBillMode) {
                    ProductTable.attr('hidden', '')
                    TotalpriceFont.attr('hidden', '');
                    CancelButton.attr('hidden', '');
                }
            };
        }
        tr.AddChild(col);
    }

    DisplayTotalPrice();
    ProductTable.AddChild(tr);
}


function GetTotalPrice() {
    var total = 0;
    ProductsCart.forEach((e) => {total += (e.price*e.quantity);});
    return total;
}
/* performs a calculation of total price, then display the result */
function DisplayTotalPrice() {
    if(TotalpriceFont.hasattr('hidden'))
        TotalpriceFont.rattr('hidden');

    TotalpriceFont.Text(" الإجمالي " + GetTotalPrice() + " د.ل ");
}


/*
    input event handler for user keypress and barcode scanner inputs
    it just forwards the input to f(FetchAndAddRecord)
*/
inputField.Target.addEventListener("keypress", (e) => {
    if(e.key == 'Enter') {
        if(inputField.Value() == undefined || inputField.Value().length == 0) {
            swal.fire('type something');
            return;
        }
        FetchAndAddRecord(inputField.Value().trim(),1);
    }
    
}, false);


/*
    after passing input data we request product's info (based on 
    serialnumber - input data).
    if result is a string that starts with '1{"sn"...'
    then, check if this product is pushed(added previously)
    in $(ProductCart) ? combine them in a single record
    otherwise we have to add a new recode.

    if result isn't starting with '1;{"sn"...' just display the result
    because it's a user-friendly-error-message from the backend
*/
function FetchAndAddRecord(product,quantity, onsuccess = null, onfailure = null) {
    if(InBillMode) {
        swal.fire({
            type: 'error',
            text: 'لا يمكن طلب معلومات/بحث عن منتجات في وضع إسترداد فاتورة'
        });
        return;
    }
    q.Ajax.Get('backend/fetch_product_info.php?product='+product +"&quantity="+quantity, (v) => {
        if(v[0] == '1') {
            let obj = JSON.parse(v.substring(1));

            if(onsuccess != null && typeof onsuccess == 'function')
                onsuccess();
            if(ProductsCart.length == 0) {
                ProductTable.rattr('hidden');
                CancelButton.rattr('hidden');
            }
            inputField.Value('');

            

            NumpadResult.Text(obj.price + " x " + obj.quantity + " = " + (obj.price*obj.quantity));
            
            var state = 0;
            if(ProductsCart.length > 0) {
                ProductsCart.forEach(e => {
                    if(e.sn == obj.sn) {
                        state = 1; /* means 'we found another record for the same products here */
                        obj.quantity += e.quantity;
                        
                        if(obj.quantity > obj.cquantity) {
                            obj.quantity -= e.quantity;
                            swal.fire("تجاوزت الكمية المطلوبة كمية المخزون" + "(" + e.cquantity +")");
                            state = 2; /* exceeded quantity error */
                        }
                        else {
                            try{
                                let row = q('table[product-list] > tr[sn="'+e.sn+'"]').Target;
                                row.children[3].textContent = obj.quantity;
                                row.children[5].textContent = obj.quantity * obj.price;
                            }
                            catch(err) {console.error(err);}
                        }
                    }
                });

                if(state == 1) {
                    ProductsCart = ProductsCart.filter(e => {
                       if(e.sn != obj.sn) {
                            return e;
                        }
                    });
                    ProductsCart.push(obj);
                }
            }
            
            
            if(state == 0) {
                ProductsCart.push(obj);
                AddToTable(obj);
            }
            
            DisplayTotalPrice();
        }
        else {
            if(onfailure != null && typeof onfailure == 'function')
                onfailure();
            swal.fire(v);
        }
            
    });
}




/* pops(remove the last recode) from $(ProductCart) and $(ProductTable) */
function PopItem(autoHide = true) {
    //let last_json = ProductsCart.pop();
    //q('table[product-list] > tr[sn="'++'"]').Remove();
    const row = ProductTable.Target.children[ProductTable.Target.children.length-1];
    const sn = row.getAttribute('sn');
    ProductTable.Target.removeChild(row);

    ProductsCart = ProductsCart.filter(e => {if(e.sn != sn) return e;});
    DisplayTotalPrice();

    if(ProductsCart.length == 0) {
        NumpadResult.Text('');
        if(autoHide) {
            ProductTable.attr('hidden', '');
            TotalpriceFont.attr('hidden', '');
            CancelButton.attr('hidden', '');
        }
    }
}

/* i'm a lazy guy, a for-loop of f(PopItem) :) */
function ClearCart() {
    while(ProductsCart.length != 0)
        PopItem();

    NumpadResult.Text('');
}



function SpeedaccessElementOnclickEvent(e) {
    FetchAndAddRecord(this.getAttribute('sn'), 1);
}

q.ready(() => {
    q('div[user-profile] > h5.userID').Text(sessionStorage.getItem('fn'));
    q('#USER_ICON').attr('title', sessionStorage.getItem('fn'));
    q.Ajax.Get('backend/fetch_speed_access.php', (v) => {
        const SpeedAccessArray = JSON.parse(v);
        var count = SpeedAccessArray.length-1;
        for (; count > -1; count--) {
            const json = SpeedAccessArray[count];
            const element = q.create('FONT', {sn: json.sn});
            element.Text(json.name);
            element.Target.onclick = SpeedaccessElementOnclickEvent;
            SpeedAccessElementList.AddChild(element);
        }
    });
    
}, false);



/* 
    saves the bills with a specific payment type
    it saves the whole payment information as a JSON
*/
function RegisterTheBill(type) {
    if(ProductsCart.length == 0) {
        swal.fire({type: 'error', title: 'فشل الإجراء', text: 'لم يتم تحديد أي منتج'});
        return;
    }
    for(var i = 0; i < ProductsCart.length; i++)
        ProductsCart[i].total = ProductsCart[i].price*ProductsCart[i].quantity;
    
    q.Ajax.Post('backend/save_bills.py', {bill: JSON.stringify(ProductsCart), sid: sessionStorage.getItem('sid'), type: type}, v => {
        if(v == null) { 
            swal.fire({type:'error', text: 'مشكلة فالإتصال بالخادم أو أن الخادم لا يستجيب'});
            return;
        }
        const respond = JSON.parse(v);

        if(respond.state == 0 || respond.code != 0) {
            if(respond.code == 3) ShowSessionExpiredDialog();
            else swal.fire({'type': 'error', title: 'رسالة الخطأ', text: RespondMessage[respond.code]});
            return;
        }
        
        if(respond.code == 0)
            ClearCart();
    });
}


function SearchForBillByCode() {

    const billCode = RestoreBillSearchInput.Value().trim();
    q.Ajax.Get('backend/restore_bills.php?code='+billCode, v => {
        if(v[0] == '0') {
            RestoreBillContent.Html('');
            swal.fire(v);
        }
        else {
            RestoreBillContent.Html('')
            BillsArray = JSON.parse(v);

            for(item in BillsArray) {
                const json = BillsArray[item];
                const container = q.create('DIV', {code: json.code});
                const code  = q.create('FONT'),
                      date = q.create('FONT'),
                      price = q.create('FONT'),
                      payment_type = q.create('IMG');
                
                // code stuff
                code.Text(json.code);
                code.attr('code', '');
                // date stuff
                date.Text(json.date);
                date.attr('date', '');
                // price stuff
                price.Text(json.price+' دينار ');
                price.attr('price', '');
                // payment type stuff
                payment_type.Target.src = (
                    json.paymenttype == 'cash' ? "res/cash__48px.png" : 
                    json.paymenttype == 'sadad' ? "res/online_money_transfer_48px.png" :
                    "res/mastercard_credit_card_48px.png"
                );
                
                container.Target.title = json.paymenttype == 'cash' ? "دفع نقدي" : 
                json.paymenttype == 'sadad' ? "دفع بخدمة سداد" :
                "دفع بالبطاقة المصرفية";

                container.AddChild(code);
                container.AddChild(date);
                container.AddChild(price);
                container.AddChild(payment_type);
                // handling click events for all bills
                container.Target.onclick = HandleBillContainerClickEvent;
                RestoreBillContent.AddChild(container);

            }
        }
            
    });
}



function HandleBillContainerClickEvent() {
    const code = this.getAttribute('code');
    // get json index in BillsArray
    var i = 0, found = false;
    for(; i < BillsArray.length; i++) {
        if(BillsArray[i].code == code)
            {found = true; break;}
    }

    if(found) {
        ChosenBill = BillsArray[i];
        ProductsCart.length = 0; // clear products cart
        //
        // disable all regular controls (including numpad )
        //
        inputField.Target.disabled = true; // you cannot use barcode
        InBillMode = true;              // disables numpad
        CashButton.attr('hidden', '');  // or re-register it
        CreditcardButton.attr('hidden', ''); // or re-register it
        SadadButton.attr('hidden', ''); // or re-register it
        CancelButton.attr('hidden', ''); // or cancel it
        
        const json = BillsArray[i];
        const price = json.price;
        const contentJSON = json.content;
        //
        // showing hidden elements
        //
        SaveBillButton.rattr('hidden');
        CancelEditBillButton.rattr('hidden');
        ProductTable.rattr('hidden');
        if(TotalpriceFont.hasattr('hidden'))
            TotalpriceFont.rattr('hidden');
        TotalpriceFont.Text(" الإجمالي " + price + " د.ل ");

        //
        // adding items to table
        //
        for(var item in contentJSON) {
            ProductsCart.push(contentJSON[item]);
            AddToTable(contentJSON[item]);
        }
    } else {
        swal.fire({type: 'error', title: 'فشل الإجراء', text: 'خطأ في مجموعة رموز الفواتير'});
    }

    // close the dialog
    HideRestoreBillPanel();
}

function CancelEditBill() {
    InBillMode = false;  
    ChosenBill = null;
    RemoveBillItemsProcedures.length = 0;
    EnableInputField();
    // HIDE
    ClearCart();
    ProductTable.attr('hidden', '');
    TotalpriceFont.attr('hidden', '');
    SaveBillButton.attr('hidden', '');
    CancelEditBillButton.attr('hidden', '');
    //ProductTable.Target.style = "display:none";
    //TotalpriceFont.attr('hidden', '');
    // SHOW
    CashButton.rattr('hidden');
    CreditcardButton.rattr('hidden');
    SadadButton.rattr('hidden');
    //CancelButton.rattr('hidden');
}


function SaveTheBill() {
    if(ProductsCart.length == 0 && RemoveBillItemsProcedures.length == 0) {
        swal.fire({type: 'error', title: 'فشل الإجراء', text: 'لم يتم تحديد أي منتج'});
        return;
    }

    
    if(RemoveBillItemsProcedures.length != 0) {
        q.Ajax.Post('backend/restore_product.php', {data : JSON.stringify(RemoveBillItemsProcedures)}, v => {
            if(v == '1')
                InternalSaveTheBill();
            else
                swal.fire(v);
        });
    }
    else
        InternalSaveTheBill();
}

function InternalSaveTheBill() {
    for(var i = 0; i < ProductsCart.length; i++){
        ProductsCart[i].total = ProductsCart[i].price*ProductsCart[i].quantity;
        ProductsCart[i].cquantity = ProductsCart[i].quantity;
    }

    q.Ajax.Post('backend/save_bills.py', {update: ChosenBill.code, bill: JSON.stringify(ProductsCart), sid: sessionStorage.getItem('sid'), type: ChosenBill.paymenttype}, v => {
        if(v == 'expired session')
            ShowSessionExpiredDialog();
        else if(v == '1') {
            ChosenBill.content = ProductsCart;
            CancelEditBill();
        }
        else
            swal.fire({type: 'error', title: 'فشل الإجراء', text: v});
    });
    
}




function Logout() {
    sessionStorage.clear();
    location.href = 'http://'+location.host+'/site';
}





/*

*/
function SearchForProductByName() {
    
    const name = SearchByNameInput.Value().trim();
    
    if(name.length == 0) return;

    q.Ajax.Get('backend/search_product.php?name='+name, v => {
        if(v[0] == '1') {
            SearchByNameContent.Target.innerHTML = '';
            const jsons = JSON.parse(v.substring(1));

            for( i in jsons) {
                const json  = jsons[i];
                const container = q.create('DIV', {sn: json.sn});
                const name  = q.create('FONT'),
                      serialnumber = q.create('FONT'),
                      price = q.create('FONT'),
                      icon = q.create('IMG');
                
                // code stuff
                name.Text(json.name);
                name.attr('code', '');
                // date stuff
                serialnumber.Text(json.sn);
                serialnumber.attr('date', '');
                // price stuff
                price.Text(json.price+' دينار ');
                price.attr('price', '');
                // payment type stuff
                icon.Target.src = (
                    json.expired == 0 ? 'res/product_48px.png' : 'res/expired_48px.png'
                );

                container.AddChild(name);
                container.AddChild(serialnumber);
                container.AddChild(price);
                container.AddChild(icon);
                // handling click events for all bills
                container.Target.onclick = HandleSeachByNameContainerClickEvent;
                SearchByNameContent.AddChild(container);

            }
        }
        else
            swal.fire(v);
    });
}




function HandleSeachByNameContainerClickEvent() {
    if(InBillMode) {
        swal.fire({
            type: 'error',
            text: 'لا يمكن البحث عن منتجات في وضع إسترداد فاتورة'
        });
        return;
    }
    else {
        FetchAndAddRecord(this.getAttribute('sn'), 1, () => {
            HideSearchForProductByNamePanel();
        });
        
    }
}




function Logout() {
    q.Ajax.Get('backend/logout.php?uid='+sessionStorage.getItem('id'), v => {
        if(v == '0')
            swal.fire({type: 'error', text: 'فشل تسجيل الخروج'});
        else {
            sessionStorage.clear();
            location.href ='http://' + location.host + '/site/';
        }
    });
}