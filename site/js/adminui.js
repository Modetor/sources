/**\
>>>>
>>>> PROJECT NAME Merchant hand: Grocery & aromatic (MHGA)
>>>> PROJECT CODE MODERN-CREATOR-SYS-GEN1-MH:GA
>>>> DATE 27-4-2020 1:00 AM
>>>> AUTHORS Mohammad s. Albay
>>>>
\**/




//#region CONST DEFINITIONS
let MyID = Number.MIN_VALUE,    MyPermission;
let NotesArray = [];
let UsersData = [];
let CurrentMinBillID = 0, MoveNumber = 2;
/* 22-9-2020 */
const Supplier = {
    TotalCount : 0,
    MaxID : 0, 
    MinID : 0,
    CanMoveForword : true, 
    CanMoveBackword : false,
    SuppliersList : [],
    CurrentMinSupplierID : 0,
    CurrentMaxSupplierID : 0,
}
let FetchedBillsArray = [];


const MiddleSidePanel = q('div[middle-area]');

const AppbarProfileIcon = q('div.appbar > img[user-icon]');
const AppbarInfoIcon = q('div.appbar > img[info-icon]')
const UserProfile = q('div[user-profile]');
const InfoDialog = q('div[info-dialog]');

const ToolboxRegisterProductButton = q('div[toolbox] > div[container] > div[register-product]');
const ToolboxAddAccountButton = q('div[toolbox] > div[container] > div[add-account]');
const ToolboxViewPaymentBillsButton = q('div[toolbox] > div[container] > div[view-payment-bills]');

const RegisterProductDialog = q('div[register-product-dialog]');
const RPD_Inputs = qlist('*[rpd-input]');

const AddAccountDialog = q('div[add-account-dialog]');
const AAD_Inputs = qlist('*[aad-input]');

const NotesDialog = q('div[notes]');
const EmployeeDialog = q('div[employee]');

const RestoreBillsDialog = q('div[restore-bill]');
const RestoreBillsFragmentRightLocalDateInput = 
            q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-header > input[type="datetime-local"]');

const RestoreBillsFragmentRightSelect = 
            q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-header > select');

const SuppliersScreen = q('div[suppliers-screen]');
const SuppliersListView = q('div[suppliers-screen] > div[full-content-container] > div.ux-fragment[smaller2] > div.ux-fragment-content');
const SupplierDataView = qlist('div[suppliers-screen] > div[full-content-container] > div.ux-fragment[bigger2] > div > div.user-name-with-icon');
const AddSupplierDialog = q('div[add-supplier]');
const ANS_Inputs = qlist('*[ans-input]');
//#endregion





//#region SHOW & HIDE
function ShowUserProfile() {
    if(UserProfile.hasattr('hidden'))
        UserProfile.rattr('hidden');
}
function HideUserProfile() {
    if(!UserProfile.hasattr('hidden'))
        UserProfile.attr('hidden', '');
}
function ShowInfoDialog() {
    if(InfoDialog.hasattr('hidden'))
        InfoDialog.rattr('hidden');
}
function HideInfoDialog() {
    if(!InfoDialog.hasattr('hidden'))
        InfoDialog.attr('hidden', '');
}
function ShowRegisterProductDialog() {
    if(RegisterProductDialog.hasattr('hidden'))
        RegisterProductDialog.rattr('hidden');
}
function HideRegisterProductDialog() {
    if(!RegisterProductDialog.hasattr('hidden'))
        RegisterProductDialog.attr('hidden', '');
}
function ShowAddAccountDialog() {
    if(AddAccountDialog.hasattr('hidden'))
        AddAccountDialog.rattr('hidden');
}
function HideAddAccountDialog() {
    if(!AddAccountDialog.hasattr('hidden'))
        AddAccountDialog.attr('hidden', '');
}
function ShowNotesDialog() {
    if(NotesDialog.hasattr('hidden'))
        NotesDialog.rattr('hidden');
}
function HideNotesDialog() {
    if(!NotesDialog.hasattr('hidden'))
        NotesDialog.attr('hidden', '');
}
function ShowEmployeeDialog() {
    if(EmployeeDialog.hasattr('hidden'))
        EmployeeDialog.rattr('hidden');
}
function HideEmployeeDialog() {
    if(!EmployeeDialog.hasattr('hidden'))
        EmployeeDialog.attr('hidden', '');
}

function ShowRestoreBillsDialog() {
    if(RestoreBillsDialog.hasattr('hidden'))
    RestoreBillsDialog.rattr('hidden');
}
function HideRestoreBillsDialog() {
    if(!RestoreBillsDialog.hasattr('hidden'))
    RestoreBillsDialog.attr('hidden', '');
}
function ShowAddSupplierDialog() {
    if(AddSupplierDialog.hasattr('hidden'))
        AddSupplierDialog.rattr('hidden');
}
function HideAddSupplierDialog() {
    if(!AddSupplierDialog.hasattr('hidden'))
        AddSupplierDialog.attr('hidden', '');
}
function ShowSuppliersScreen() {
    if(SuppliersScreen.hasattr('hidden'))
        SuppliersScreen.rattr('hidden');
}
function HideSuppliersScreen() {
    if(!SuppliersScreen.hasattr('hidden'))
        SuppliersScreen.attr('hidden', '');
}
//#endregion





//#region TOOLBOX CLICK EVENTS
q('div.appbar > button[employee-button]').do('click', e => {
    if(EmployeeDialog.hasattr('hidden'))
        EmployeeDialog.rattr('hidden');
    else
        EmployeeDialog.attr('hidden', '');
});
q('div.appbar > button[notes-button]').do('click', e => {
    if(NotesDialog.hasattr('hidden'))
        NotesDialog.rattr('hidden');
    else
        NotesDialog.attr('hidden', '');
});
AppbarProfileIcon.do('click',(e) => {

    HideInfoDialog();

    if(UserProfile.hasattr('hidden'))
        UserProfile.rattr('hidden');
    else
        UserProfile.attr('hidden', '');
});


AppbarInfoIcon.do('click',(e) => {

    HideUserProfile();

    if(InfoDialog.hasattr('hidden'))
        InfoDialog.rattr('hidden');
    else
        InfoDialog.attr('hidden', '');
});

ToolboxRegisterProductButton.do('click', e => {
    if(RegisterProductDialog.hasattr('hidden'))
        RegisterProductDialog.rattr('hidden');
    else
        RegisterProductDialog.attr('hidden', '');
});

ToolboxAddAccountButton.do('click', e => {
    if(AddAccountDialog.hasattr('hidden'))
        AddAccountDialog.rattr('hidden');
    else
        AddAccountDialog.attr('hidden', '');
});

ToolboxViewPaymentBillsButton.do('click', e => {
    if(RestoreBillsDialog.hasattr('hidden'))
    RestoreBillsDialog.rattr('hidden');
    else
    RestoreBillsDialog.attr('hidden', '');
});
//#endregion





/*\
[-] ------------------------------------------------------
[-] Core method 
[-] ------------------------------------------------------
\*/
q.ready( async () => {
    MyID = sessionStorage.getItem('id');
    MyPermission = sessionStorage.getItem('pm');
    // when done, get in full screen mode
    //document.documentElement.requestFullscreen();
    if(localStorage.getItem('notes') != undefined) {
        NotesArray = JSON.parse(localStorage.getItem('notes'));
        for(let i in NotesArray)
            AddNoteToHtml(NotesArray[i]);
    }
    // used as toolbox items background colors
    const colors = [
                        '#fb8c00','#ffb74d', // orange 8
                        '#43a047','#81c784', // green 7
                        '#536dfe','#304ffe', // indigo 4
                        '#d81b60', '#ec407a', // pink 6
                        '#009688','#00796b', // teal 3
                        '#9c27b0', '#7b1fa2', // purple 2
                        '#f44336','#d32f2f', // red 5
                        '#2196f3', '#1976d2', // blue 1
                        '#ffb300', '#ffa000' // amber 0
                   ];
    let a = qlist('div[toolbox] > div[container] > div[tool]');
    a.forEach((e) => {
        e.Target.children[0].style['background-color'] = colors.pop();
        e.css({'background-color': colors.pop()}); 
    });

    //delete colors;
    await GetAccountsData();
    SetupHosts(['notes','employee']);
    SearchForBills({disabled: false});
    // initial search
    PrepareSupplierUI();
});





/**\ 
|||| دالة تعيد طلب بيانات المستخدمين
||||  -----------------------------------
|||| <param name='json'>employee data set in JSON format</param>
|||| <param name='otherSide'>when true means this will add data to "ACTIVE NOW" Tap</param>
\**/
async function SetupHosts(arr) {
    for (var item in arr) {
        let tabsContent = qlist('#'+arr[item]+' > div[tabs-host] > div[tab-content]');
        tabsContent.Get(0).css({'width':'100%'});
        let tabs = qlist('#'+arr[item]+' > div[tabs-container] > *');
        tabs.Get(0).css({'color':'#2962ff', 'font-weight': 'bold'});
        tabs.forEach( e => {
            e.attr('parent', arr[item]);
            e.do('click', ev => {
                const element = e.attr('parent');
                const _tabsContent = qlist('#'+e.attr('parent')+' > div[tabs-host] > div[tab-content]');
                
                tabs.forEach( e => e.css({'color':'rgb(100, 100, 100)', 'font-weight': 'normal'}));//
                e.css({'color':'#2962ff', 'font-weight': 'bold'});
                const myContent = q('#'+element+' > div[tabs-host] > div[tab-content="'+e.attr('tab-link')+'"]');
                if(myContent.Target.style.width == '100%') {
                    console.log('out');
                    return;
                }
                for(let j = _tabsContent.Length -1; j > -1; j--) {
                    if(_tabsContent.Get(j) == myContent) continue;
                    else {
                        _tabsContent.Get(j).Childs()[0].css('display:none');
                        _tabsContent.Get(j).css({'width':'0%'});
                    }
                }
                myContent.Childs()[0].css('display:block');
                myContent.css({'width':'100%'});
            });
        });
    }
    
}




/**\ 
|||| دالة تطلب بيانات المستخدمين
||||  -----------------------------------
|||| تمت الإضافة بتاريخ 9-22-2020 .. 9:30 م
\**/
function PrepareSupplierUI() {

    q.Ajax.PostConfig('backend/search_for_suppliers.php', {
        data:  {
                'sid': sessionStorage.getItem('sid'), 
                'fetch_count' : 0
               },
        onstart: event => module.ui.LoadProgressBar.Start(),
        onprogress: event => {
            let percent = (event.loaded /  event.total)*100;
            module.ui.LoadProgressBar.Update(percent);
        },
        success: respond => {
            module.ui.LoadProgressBar.End();
            if(respond == null) {
                module.errors.ServerNotResponding();
                return;
            }

            respond = JSON.parse(respond);
            
            if(respond.state == 0 || respond.code != 0) {
                if(respond.code == 3) module.errors.ShowSessionExpiredDialog();
                else module.errors.Alert(respond.code);
                return;
            }
            Supplier.TotalCount = respond.extra;
        }
    });

    q.Ajax.PostConfig('backend/search_for_suppliers.php', {
        data:  {
                'sid': sessionStorage.getItem('sid'),
               },
        onstart: event => module.ui.LoadProgressBar.Start(),
        onprogress: event => {
            let percent = (event.loaded /  event.total)*100;
            module.ui.LoadProgressBar.Update(percent);
        },
        success: respond => {
            module.ui.LoadProgressBar.End();
            if(respond == null) {
                module.errors.ServerNotResponding();
                return;
            }

            respond = JSON.parse(respond);
            
            if(respond.state == 0 || respond.code != 0) {
                if(respond.code == 3) module.errors.ShowSessionExpiredDialog();
                else module.errors.Alert(respond.code);
                return;
            }
            // check if we fetch no data...
            if(respond.extra.length == 0) {
                SuppliersListView.Html(
                    `<img style="margin-top: 2em;" src="res/nothing_found_127px.png" alt="">
                    <h2 style="font-family: DROID_NASK_BOLD;color: #546e7a;">لم يتم تسجيل أي مورد بعد!</h2>`
                );
                return;
            }
            Supplier.SuppliersList = respond.extra;
            
            let tempArray = Supplier.SuppliersList.pop();
            Supplier.MinID = tempArray['min-id'];
            Supplier.MaxID = tempArray['max-id'];
            Supplier.CanMoveForword = tempArray['can-move-forward'];
            Supplier.CanMoveBackword = tempArray['can-move-backword'];

            Supplier.CurrentMinSupplierID = Supplier.SuppliersList[0].id;
            Supplier.CurrentMaxSupplierID = Supplier.SuppliersList[Supplier.SuppliersList.length-1].id;
            
            for(let i in Supplier.SuppliersList) 
                AddSupplierView(Supplier.SuppliersList[i], i)

        }
    });
}
/**\ 
|||| دالة تطلب بيانات المستخدمين
||||  -----------------------------------
\**/
async function GetAccountsData() 
{
    q.Ajax.Get('backend/get_users_data.php', v => {
        if(v[0] == '0')
            swal.fire({type: 'error', text: v.substring(1)});
        else {
            UsersData = JSON.parse(v);
            RestoreBillsFragmentRightSelect.Html('');
            RestoreBillsFragmentRightSelect.AddChild(q.create('option',{
                value: 'all', text: 'الكل'
            }));
            for(var item in UsersData) {
                if(UsersData[item].permission > 1) {
                    RestoreBillsFragmentRightSelect.AddChild(q.create('option',{
                        value: UsersData[item].id, text:UsersData[item].name
                    }));
                }
                AddToEmployeeList(UsersData[item]);
            }
            
        }
    });
}
/**\ 
|||| دالة تعرض بيانات الموظفين في تبويت الحسابات
|||| و تبويب الحسابات النشطة
||||  -----------------------------------
|||| <param name='json'>employee data set in JSON format</param>
|||| <param name='otherSide'>when true means this will add data to "ACTIVE NOW" Tap</param>
\**/
function AddToEmployeeList(json, otherSide = false) {
    let isonline = json.online == 1;
    var container = q.create('DIV', {class: 'user-card',data: json.id, title: 'مسجل بتاريخ '+json.createdat});
    var username = q.create('font', {'user-name': ''}),
        usericon =  q.create('img', {'user-icon':'', title: isonline ? 'متصل الأن' : 'غير متصل', src: json.permission == 1 ? 'res/boss.png' : json.permission == 0 ? 'res/developer_48px.png' : 'res/manager_48px.png'}),
        deleteuser =  q.create('img', {'delete-user':'', src: 'res/delete_forever_48px.png', title: 'حذف هذا الحساب'}),
        makeoffline =  q.create('img', {'offline-user':'', src: 'res/offline_48px.png', title: 'تسجيل الخروج لهذا الحساب'});

    

    deleteuser.do('click', e => {
        q.Ajax.Get('backend/delete_user.php?id='+json.id+'&sid='+sessionStorage.getItem('sid'), v => {
            if(v == '1') {
                UsersData = UsersData.filter(e => {if(e != json) return e}); 
                container.Remove();
                try { q('div[onlineusers-listview] > div[data="'+json.id+'"]').Remove(); } catch (error) {console.error(error);}
                swal.fire({type:'success', title: 'تم حذف الحساب'});
            } else swal.fire(v);
        });
      
    });

    makeoffline.do('click', e => {
        q.Ajax.Get('backend/kill_session.php?id='+json.id, v => {
            if(v == '0')
                swal.fire({type:'error', text: 'فشل الإجراء'});
            else {
                // ok he- or she -is offline
                container.rattr('online');
                try { q('div[onlineusers-listview] > div[data="'+json.id+'"]').Remove(); } catch (error) {console.error(error);}
                makeoffline.Remove()
            }
        });
    });

    container.AddChild(username);
    container.AddChild(usericon);
    
    if(isonline) {
        container.attr('online', '');
        if (json.id != MyID && json.permission > MyPermission) container.AddChild(makeoffline);
    }
    if(json.id == MyID) {
        username.Text('أنت');
        username.attr('title', json.name);
        username.Target.style.color = '#2962FF';
    }
    else {
        if(json.permission > MyPermission)
            container.AddChild(deleteuser);
        username.Text(json.name);
    }
    
    if(otherSide) {
        q('div[onlineusers-listview]').AddChild(container);
    }
    else {q('div[users-listview]').AddChild(container);
    if(isonline) AddToEmployeeList(json, true);
    }
    
}
/**\ 
|||| دالة تعيد طلب بيانات المستخدمين
||||  -----------------------------------
\**/
async function ReloadUsersData()
{
    let parents = [q('div[onlineusers-listview]').Target.children,q('div[users-listview]').Target.children];

    for(var item in parents) {
        if(typeof parents[item] == 'object') {
            while(parents[item].length != 0) 
                parents[item][parents[item].length-1].remove();
        }
    }
    GetAccountsData() ;
}





/**\ 
|||| دالة تتفاعل مع واجهة اضافة منتج وتتحقق 
|||| من القيم المدخلة و يتم التسجيل في حال كانت
|||| المدخلات صحيحة
||||  -----------------------------------
|||| <param name='self'>The button</param>
\**/
function RegisterNewProduct(self) {

    let check = true;
    let errtype = '';
    RPD_Inputs.forEach(e => {
        const v = e.Value().trim();
        e.Value(v);
        if(e.attr('type') == 'text') {
            if(v == '') {check = false; errtype = 'text';}
        }
        else if(e.attr('type') == 'number') {
            try{parseFloat(v);} catch(e) {check = false; errtype = 'num';}
        }
        else if(e.attr('type') == 'date') {
            if(v == '') {check = false; errtype = 'date';}
        }
    });

    if(!check) {
        self.disabled = false;
        switch(errtype) {
            case 'num':
                swal.fire('يرجى إدخال قيمة عددية صحيحه');
                break;
            case 'date':
                swal.fire('يرجى تحديد التاريخ');
                break;
            case 'text':
                swal.fire('يرجى ملئ كافة حقول الإدخال');
                break;
        }
        
        return;
    }

    self.disabled = true;
    const productInfo = {
        name:RPD_Inputs.Get(0).Value(), serialnumber:RPD_Inputs.Get(1).Value(),
        company:RPD_Inputs.Get(2).Value(), quantity: parseInt(RPD_Inputs.Get(3).Value()),
        price:parseFloat(RPD_Inputs.Get(4).Value()), wsprice: parseFloat(RPD_Inputs.Get(5).Value()),
        measureable:RPD_Inputs.Get(6).Value() == '1' ? 1 : 0, hasexp:RPD_Inputs.Get(7).Value() == '1' ? 1 : 0,
        expdate:RPD_Inputs.Get(8).Value()
    };

    q.Ajax.Post('backend/register_product.php', {p:JSON.stringify(productInfo),sid:sessionStorage.getItem('sid')}, v => {
        self.disabled = false;
        if(v == 'no_data_to_read' || v == 'expired_session' || v == 'internal_error') {
            swal.fire({type: 'error', title: 'فشل تسجيل المنتج', text: 'الخادم يرفض تسجيل المنتج'}).then(() => {
                ShowSessionExpiredDialog();
            });
            
            return;
        }
        else if(v == '1') {
            swal.fire({
                type: 'success', 
                title: 'تم تسجيل المنتج'
            });
        } else {
            swal.fire({type: 'error', title: 'فشل تسجيل المنتج', text: 'رسالة الخطأ : '+v});
        }
    });
    //console.log();  
    //

    
}





/**\ 
|||| دالة تتفاعل مع واجهة اضافة حساب مستخدم وتتأكد 
|||| من القيم المدخلة و يتم التسجيل في حال المدخلات 
|||| كانت صحيحة
||||  -----------------------------------
|||| <param name='self'>The button</param>
\**/
function AddNewAccount(self) {
    self.disabled = true;

    let check = true;
    AAD_Inputs.forEach(e => {
        const v = e.Value().trim();
        e.Value(v);
        if(e.attr('type') == 'text') {
            if(v == '') {check = false;}
        }
    });

    if(!check) {
        self.disabled = false;
        swal.fire('يرجى ملئ كافة حقول الإدخال');
        return;
    }

    q.Ajax.Post('backend/add_account.php', {name:AAD_Inputs.Get(0).Value(), password:AAD_Inputs.Get(1).Value(), permission:AAD_Inputs.Get(2).Value(),sid:sessionStorage.getItem('sid')}, v => {
        self.disabled = false;
        if(v == '1') swal.fire({type: 'success', title: 'تم إنشاء الحساب بنجاح'});
        else swal.fire({type: 'error', text: v.substring(1)});
    });
}
/**\ 
|||| حذف حساب موظف
||||  -----------------------------------
\**/
function DeleteUserAccount() {
    swal.fire({input:'text', title: 'Type user name'}).then(a => {
        if(a.value != null && a.value != '') {
            q.Ajax.Get('delete_user.php?u='+a.value, v => {
                if(v == '1')
                    swal.fire({type:'success', title: 'تم حذف الحساب'});
                else if(v[0] == '0') 
                    swal.fire({type:'error', text:v.substring(1)});
            });
        }
    });
}


/**\ 
|||| تسجيل الخروج من هذا الحساب
||||  -----------------------------------
\**/
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





/**\ 
|||| بحث عن فواتير
||||  -----------------------------------
|||| <param name='self'>The save button</param>
\**/
function SaveNote(self) {
    self.disabled = true;

    let titleText = q("div[notes] > #notes > div[tabs-host] > div[tab-content='tab1'] > div[content] > input")
                        .Value().trim();
    let noteText = q("div[notes] > #notes > div[tabs-host] > div[tab-content='tab1'] > div[content] > textarea")
                        .Value().trim();
    //NotesArray = JSON.parse(localStorage.getItem('notes'));
    let date = new Date();
    let id = NotesArray.length;
    let json = {id:id, title: titleText, note: noteText, date: date.getDay() +'/'+date.getMonth()+'/'+date.getFullYear()};
    NotesArray.push(json);
    localStorage.setItem('notes', JSON.stringify(NotesArray));
    
    AddNoteToHtml(json);
    self.disabled = false;
    swal.fire('تم حفظ الملاحظة');
}
/**\ 
|||| دالة تعرض الملاحظات في قائمة الملاحظات
||||  -----------------------------------
|||| <param name='json'>Structured JSON-based note information</param>
\**/
function AddNoteToHtml(json) {
    var container = q.create('DIV', {class: 'note-card'});
    var title = q.create('font', {title: ''}),
        date = q.create('font', {date:''}),
        del =  q.create('img', {delete:'', src: 'res/delete_forever_48px.png'}),
        open =  q.create('img', {open:'', src:'res/visible_48px.png'});
    
    container.attr('note-id', json.id);
    title.Text(json.title);
    date.Text(json.date);

    del.do('click', e => {
      NotesArray = NotesArray.filter(e => {if(e != json) return e}); 
      localStorage.setItem('notes', JSON.stringify(NotesArray)); 
      container.Remove();
    });

    open.do('click', e => {
        swal.fire({title:json.title, text:json.note});
    });

    container.AddChild(title);
    container.AddChild(date);
    container.AddChild(del);
    container.AddChild(open);

    q('div[note-listview]').AddChild(container);

}





/**\ 
|||| بحث عن فواتير
||||  -----------------------------------
|||| <param name='self'>The search icon</param>
\**/
async function SearchForBills(self) {
    self.disabled = true;
    let params = 'sid='+sessionStorage.getItem('sid');
    //'&d='+RestoreBillsFragmentRightLocalDateInput.Value()+'&i='+CurrentMinBillID+'&
    if(RestoreBillsFragmentRightSelect.Value() != 'all'
         && RestoreBillsFragmentRightSelect.Value() != '')
        params +='&u='+ RestoreBillsFragmentRightSelect.Value();
    if(RestoreBillsFragmentRightLocalDateInput.Value() != '') 
        params +='&d='+ RestoreBillsFragmentRightLocalDateInput.Value();
    
    //console.log('Log > "'+RestoreBillsFragmentRightSelect.Value()+'"');
    q.Ajax.Get('backend/search_for_bills.php?'+params, v => {
        if(v == null) {
            module.errors.ServerNotResponding();
            return;
        }
        let respond = JSON.parse(v);
        if(respond.state == 0 || respond.code != 0) {
            if(respond.code == 3) module['errors'].ShowSessionExpiredDialog();
            else if(respond.code == 20) {}
            else swal.fire({type:'error', title: 'رسالة الخطأ', text: module['errors'].RespondMessage[respond.code]});
            return;
        }

        FetchedBillsArray = respond.extra;/* contains bills  */
        if(FetchedBillsArray.length == 0) return; /* ATTENTION */
        /* CLEAR CONTENT */
        q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-content')
                .Html('');
        for(let item in FetchedBillsArray)
            AddToSearchBillUI(FetchedBillsArray[item], item);
        
        self.disabled = false;
    });
}
/**\ 
|||| تضيف نتائج البحث لقائمة الفواتير
||||  -----------------------------------
|||| <param name='json'>Structured JSON-based bills information</param>
|||| <param name='i'>The index of json</param>
\**/
function AddToSearchBillUI(json, i) {
    let container = q.create('DIV', {class: "riched-content-card", clickable: '', dir: 'rtl', index: i, code: json.code});
    let fonts = [
                    q.create('FONT'),q.create('FONT'),
                    q.create('FONT', {name: 'price'}),q.create('FONT'),
                ];

    fonts[0].Text(json.code); fonts[1].Text(json.username);
    fonts[3].Text(json.date); fonts[2].Text(json.price+' دينار');
    
    for(let i in fonts)
        container.AddChild(fonts[i]);
    
    container.do('click', e => ShowBillUI(json,i));
    container.AddChild(q.create('IMG', 
        {
            src: json.paymenttype == 'cash' ? "res/cash__48px.png" : 
            json.paymenttype == 'sadad' ? "res/online_money_transfer_48px.png" :
            "res/mastercard_credit_card_48px.png"
        }
    ));
    q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-content').AddChild(container);
}
/**\ 
|||| دالة تضيف الفاتورة لقائمة الفواتير
||||  -----------------------------------
|||| <param name='json'>Structured JSON-based bills information</param>
|||| <param name='i'>The index of json</param>
\**/
function ShowBillUI(json, index) {
    let fragment = q('div[restore-bill] > div[full-content-container] > div.ux-fragment[left]');
    fragment.Html(''); // clear everything
    for(let i in json.content) {
        let container = q.create('DIV', { class: "ux-bill-item" });

        let icon = q.create('IMG', {icon:'', alt: 'الأيقونة', src: "res/new_product_96px.png", title: 'إضغط لعرض تفاصيل المنتج'});
        icon.do('click', () => {
            text = " ملاحظة : البيانات المعروضة أدناه لا تستند على معلومات حديثة و إنما بعض البيانات المسجلة لحظة أنشاء الفاتورة "+"<br/>";
            text += "رقم التسلسل - "+json.content[i].sn+"<br/>";
            text += "الإسم - "+json.content[i].name+"<br/>";
            text += "السعر - "+json.content[i].price+" دينار<br/>";
            text += "سعر الجملة - "+json.content[i].wsprice+" دينار<br/>";
            swal.fire({title:'عرض بيانات المنتج' , html: text});
        });
        container.AddChild(icon);
        container.AddChild(q.create('FONT', {name:'', text: json.content[i].name, sn:json.content[i].sn}));
        
        let quantityDIV = q.create('DIV', {quantity:'', title: 'الكمية المباعة'});
        quantityDIV.AddChild(q.create('IMG', {src:"res/shopping_basket_96px.png"}));
        quantityDIV.AddChild(q.create('FONT', {text: json.content[i].quantity}));
        container.AddChild(quantityDIV);

        let priceDIV = q.create('DIV', {price:'', title: json.content[i].price + ' السعر'});
        priceDIV.AddChild(q.create('IMG', {src:"res/banknotes_96px.png"}));
        priceDIV.AddChild(q.create('FONT', {text: (json.content[i].price*json.content[i].quantity) + ' د.ل'}));
        container.AddChild(priceDIV);

        let deleteIcon = q.create('IMG', {"content-index": i, "index": index , delete:'',title: 'حذف من الفاتورة', src: "res/delete_forever_48px.png"});
        deleteIcon.do('click', () => {
            let billIndex = parseInt(deleteIcon.attr("index"));
            let contentIndex = parseInt(deleteIcon.attr("content-index"));

            const price = FetchedBillsArray[billIndex].content[contentIndex].price*
                          FetchedBillsArray[billIndex].content[contentIndex].quantity;

            let tempArray = FetchedBillsArray[billIndex]
                        .content.filter( (e,i) => {if(i != contentIndex) return e;});
            //console.log('tempArray => '); console.log(tempArray);
            debugger;
            let ProductToRestore = FetchedBillsArray[billIndex].content[contentIndex];
            //console.log('ProductToRestore => '); console.log(ProductToRestore);
            debugger;
            q.Ajax.Post('backend/restore_product.php', {data: JSON.stringify([ProductToRestore])}, v => {
                if(v == null) {
                    swal.fire({type: 'error', text: 'فشل إجراء إسترجاع المنتج للمستودع - مشكلة فالإتصال'});
                    return;
                }

                const respond = JSON.parse(v);
                if(respond.state == 0) {
                    swal.fire({type:'warning', title: 'رسالة الخطأ :', text: respond.errmsg});
                }
                else if(respond.affected == 0) {
                    swal.fire({type:'warning', title: 'رسالة الخطأ :', text: 'يبدو أن المنتج الذي تحاول إرجاعه للمستودع لم يعد مسجلا'});
                }

                for(var i = 0; i < tempArray.length; i++){
                    tempArray[i].total = tempArray[i].price*tempArray[i].quantity;
                    tempArray[i].cquantity = tempArray[i].quantity;
                }
            
                q.Ajax.Post('backend/save_bills.py', {update: FetchedBillsArray[billIndex].code, bill: JSON.stringify(tempArray), sid: sessionStorage.getItem('sid'), type: FetchedBillsArray[billIndex].paymenttype}, v => {
                    if(v == 'm-01')
                        ShowSessionExpiredDialog();
                    else if(v == 'm-00') {
                        FetchedBillsArray[billIndex].content = tempArray;
                        FetchedBillsArray[billIndex].price -= price;
                        container.Remove();
                        q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-content > div.riched-content-card[code="'+json.code+'"] > font[name="price"]')
                        .Text(price+' دينار');
                    }
                    else if(v == 'm-02')
                        swal.fire({type: 'error', title: 'فشل الإجراء', text: v});
                });
            });
        });
        container.AddChild(deleteIcon);

        fragment.AddChild(container);

        if(json.content.length-1 == i) break;
        else fragment.AddChild(q.create('HR', {class: 'ux-hr'}));
    }

}
/**\ 
||||  دلة للبحث بإستخدام رمز الفاتورة
||||  -----------------------------------
||||
\**/
function SetBillCode() {
    swal.fire({
        input: 'text',
        text: 'أدخل رمز الفاتورة',
        showCancelButton: true,
        cancelButtonColor: '#F9A825',
        cancelButtonText: 'إلغاء',
        confirmButtonText: 'تم',
        }).then((res) => {
                if(res.value){
                    let params = 'sid='+sessionStorage.getItem('sid')+
                                 '&c='+res.value;
                    q.Ajax.Get('backend/search_for_bills.php?'+params, v => {
                        if(v[0] == '0') 
                            swal.fire({type:'error', text: v.substring(1)});
                        else {
                            FetchedBillsArray = JSON.parse(v);
                            if(FetchedBillsArray.length == 0) return; /* ATTENTION */
                
                            q('div[restore-bill] > div[full-content-container] > div.ux-fragment[right] > div.ux-fragment-content')
                                .Html('');
                            for(let item in FetchedBillsArray)
                                AddToSearchBillUI(FetchedBillsArray[item], item);
                        }
                        
                    });
                } 
                else if(res.dismiss == 'cancel') {
                    RestoreBillsFragmentRightHiddenInput.Value('');
                }
    });	
}





/**\ 
|||| إسترجاع قائمة ببيانات الموردين المسجلين وعرضهم
||||  -----------------------------------
|||| <param name='o'>the 'search' icon in $(SuppliersScreen)</param>
|||| تمت الإضافة بتاريخ 9-6-2020 .. 2:08 ص
\**/
function SearchForSuppliers(o, move = 0) {
    let value = 'no-value';
    let type = 'no-condition';
    if(move == 0) {
        Supplier.CurrentMinSupplierID = 0;
        move = 1;
        type = q('div[suppliers-screen] > div[full-content-container] > div.ux-fragment[smaller2] > div.ux-fragment-header > select').Value();
        value = q('div[suppliers-screen] > div[full-content-container] > div.ux-fragment[smaller2] > div.ux-fragment-header > input').Value().trim();
        if(value == "" || type == "") {
            module.errors.Note(21);
            return;
        }
    }
    

    q.Ajax.PostConfig('backend/search_for_suppliers.php', {
        data: {
                'sid': sessionStorage.getItem('sid'), 
                'value': value, 'type':type,
                'mid': Supplier.CurrentMinSupplierID, 
                'Mid': Supplier.CurrentMaxSupplierID,
                'move': move < 0 ? '<' : '>'
               },
        onstart: event => module.ui.LoadProgressBar.Start(),
        onprogress: event => {
            let percent = (event.loaded /  event.total)*100;
            module.ui.LoadProgressBar.Update(percent);
        },
        success: respond => {
            module.ui.LoadProgressBar.End();
            
            if(respond == null) {
                module.errors.ServerNotResponding();
                return;
            }

            respond = JSON.parse(respond);
            
            if(respond.state == 0 || respond.code != 0) {
                if(respond.code == 3) module.errors.ShowSessionExpiredDialog();
                else module.errors.Alert(respond.code);
                return;
            }
            SuppliersListView.Html(""); /* clear content xD */
            // check if we fetch no data...
            if(respond.extra.length == 0) {
                SuppliersListView.Html(
                    `<img style="margin-top: 2em;" src="res/nothing_found_127px.png" alt="">
                     <h2 style="font-family: DROID_NASK_BOLD;color: #546e7a;">لا يوجد أي نتائج مطابقة</h2>`
                );
                return;
            }
            Supplier.SuppliersList = respond.extra;
            
            let tempArray = Supplier.SuppliersList.pop();
            Supplier.MinID = tempArray['min-id'];
            Supplier.MaxID = tempArray['max-id'];
            Supplier.CanMoveForword = tempArray['can-move-forward'];
            Supplier.CanMoveBackword = tempArray['can-move-backword'];

            Supplier.CurrentMinSupplierID = Supplier.SuppliersList[0].id;
            Supplier.CurrentMaxSupplierID = Supplier.SuppliersList[Supplier.SuppliersList.length-1].id;
            
            for(let i in Supplier.SuppliersList) 
                AddSupplierView(Supplier.SuppliersList[i], i);
            
            
            o.enabled = true;
        }
    });
}
/**\ 
|||| عرض بيانات المورد
||||  -----------------------------------
|||| <param name='json'>supplier data as json</param>
|||| <param name='i'>supplier's data's index</param>
|||| تمت الإضافة بتاريخ 9-6-2020 .. 4:55 ص
\**/
function AddSupplierView(json,i) {
    let container = q.create('DIV', {class: 'ux-supplier-item', id: json.id});
    let icon = q.create('IMG', {icon: '', src: 'res/client_company_96px.png'});
    let name = q.create('FONT', {name: '', 'ellipse-words': '', text: json.fullname});
    let company = q.create('FONT', {company: '', 'ellipse-words': '', text: json.work});

    container.do('click', e => ViewSupplierProfile(json));

    container.AddChild(icon);
    container.AddChild(name);
    container.AddChild(company);
    SuppliersListView.AddChild(container);
}
/**\ 
|||| عرض بيانات المورد
||||  -----------------------------------
|||| <param name='json'>supplier data as json</param>
|||| <param name='i'>supplier's data's index</param>
|||| تمت الإضافة بتاريخ 9-6-2020 .. 5:01 ص
\**/
function ViewSupplierProfile(json) {
    // name
    SupplierDataView.Get(0).Childs()[1].Text(json.fullname);
    // work & position
    SupplierDataView.Get(1).Childs()[1].Text((json.position != 1 ? 'موظف': 'مدير')+' <font style="color:#2979ff">'+json.work+'</font>');
    // debts
    let money = 0;
    json.debts.forEach(e => money += e.money);
    money += ' دينار';
    SupplierDataView.Get(2).Childs()[1].Text('قيمة المستحقات <font style="color:#00c853">'+money+'</font>');
    // resident
    SupplierDataView.Get(3).Childs()[1].Text('العنوان <font style="color:#ffa000">'+json.resident+'</font>');
    // date
    SupplierDataView.Get(4).Childs()[1].Text('تاريخ التسجيل <font style="color:#f50057">'+json.date+'</font>');
    // phones
    let phones = '';
    json.phone.split(',').forEach(e => phones += (e+','));
    SupplierDataView.Get(5).Childs()[1].Text(phones.substring(0, phones.length-1));
    SupplierDataView.Get(7).do('click', event => {
        q.Ajax.PostConfig('backend/delete_supplier.php', {
            data: {
                    'sid': sessionStorage.getItem('sid'), 
                    'id': json.id
                  },
            onstart: event => module.ui.LoadProgressBar.Start(),
            
            onprogress: event => {
                let percent = (event.loaded /  event.total)*100;
                module.ui.LoadProgressBar.Update(percent);
            },
            success : respond => {
                module.ui.LoadProgressBar.End();
                if(respond == null) {
                    module.errors.ServerNotResponding();
                    return;
                }
                respond = JSON.parse(respond);

                if(respond.state == 0 || respond.code != 0) {
                    if(respond.code == 3) module.errors.ShowSessionExpiredDialog();
                    else module.errors.Alert(respond.code);
                    return;
                }
                SupplierDataView.forEach(e => e.attr('hidden', ''));
                q('div[suppliers-screen] > div[full-content-container] > div.ux-fragment[smaller2] > div.ux-fragment-content > div.ux-supplier-item[id="'+json.id+'"]').Remove();
                
            }
        });
    });
    SupplierDataView.forEach(e => e.rattr('hidden'));
}
/**\ 
|||| دالة تضيف 
||||  -----------------------------------
|||| <param name='o'>the 'save' button in $(AddSupplierDialog)</param>
|||| تمت الإضافة بتاريخ 9-6-2020 .. 1:54 ص
\**/
function AddNewSupplier(o) {
    o.enabled = false;
    
    let fullname = ANS_Inputs.Get(0).Value().trim();
    let phones = ANS_Inputs.Get(1).Value().trim();
    let resident = ANS_Inputs.Get(2).Value().trim();
    let work = ANS_Inputs.Get(3).Value().trim();
    let position = ANS_Inputs.Get(4).Value().trim();
    // check
    if(fullname == '' || phones == '' || resident == '' ||
       work == '' || position == '') {
        module.errors.Note(21);
        o.enabled = true;
        return;
    }
    // if more than one phone number...
    if(phones.indexOf(',') != -1) 
        phones = phones.split(',').filter(item => item.trim());
    
        q.Ajax.PostConfig('backend/add_supplier.php', {
            data: {
                    'sid': sessionStorage.getItem('sid'), 
                    'name': fullname, 'phones': phones,
                    'resident':resident, 'work': work,
                    'position': position
                   },
            onstart: event => module.ui.LoadProgressBar.Start(),
            onprogress: event => {
                let percent = (event.loaded /  event.total)*100;
                module.ui.LoadProgressBar.Update(percent);
            },
            success: respond => {
                if(respond == null) {
                    module.errors.ServerNotResponding();
                    return;
                }

                respond = JSON.parse(respond);
                
                if(respond.state == 0 || respond.code != 0) {
                    if(respond.code == 3) module.errors.ShowSessionExpiredDialog();
                    else module.errors.Alert(respond.code);
                    return;
                }

                swal.fire({type:'success', text: 'تم إنشاء الحساب بنجاح'});
                module.ui.LoadProgressBar.End();
                o.enabled = true;
            }
        });
    
}
