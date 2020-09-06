var module = module || {};
module['errors'] = {
    RespondMessage : {
        '-1': 'خطأ في النظام، يرجى مراجعة سجلات النظام أو طلب خدمة الصيانة',
        '0' : 'إكتمل الإجراء بنجاح',
        '1' : 'إنتهت صلاحية الجلسة أو أن الطلب قادم من خارج الشبكة',
        '3' : 'إنتهت صلاحية الجلسة',
        '4' : 'الطلب مرسل من جهاز غير مصرح له الولج لهذا الحساب ، تم رفض الطلب',
        '5' : 'خطأ فالنظام ، فشل طلب المعلومات',
        '6' : 'لم يتم تطبيق الإجراء - لا يوجد تطابق',
        '7' : 'لم يتم تحديد أي منتج',
        '8' : 'فشلت عملية توليد مفتاح خاص',
        '9' : 'لا تملك الصلاحيات المطلوبة لتنفيذ الإجراء',
        '10': 'لم يتم التعرف على المستخدم',
        '11': 'لم نتمكن من معرفة مستوى صلاحية المستخدم الحالي',
        '20': 'لا يوجد فواتير',
        '21': 'الرجاء ملئ كافة الحقول',
    },

    ServerNotResponding() {
        swal.fire({type:'error', text: 'مشكلة فالإتصال بالخادم أو أن الخادم لا يستجيب'});
    },
    Alert(code) {
        swal.fire({type:'error',title: 'رسالة الخطأ', text: module.errors.RespondMessage[code]});
    },
    Note(arg) {
        if(typeof arg == "string")
            swal.fire({type:'error', text: arg});
        else if (typeof arg == "number")
            swal.fire({type:'error', text: module.errors.RespondMessage[arg]});
    },
    ShowSessionExpiredDialog() {
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
                            if(v == null) {
                                ServerNotResponding();
                                return;
                            }
                            let respond = JSON.parse(v);
                            if(respond.state == 0 || respond.code != 0) { 
                                swal.fire({type:'error', title: 'رسالة الخطأ', text: module.errors.RespondMessage[respond.code]});
                                return;
                            }
                            if(respond.code == 0) {
                                sessionStorage.setItem("expd", respond.extra)
                                swal.fire(module.errors.RespondMessage[respond.code]);
                            }
                        });
                    } 
                    else if(res.dismiss == 'cancel') {
                        sessionStorage.clear();
                        location.href = 'http://'+location.host+'/site';
                    }
        });	
    }

}




/*
function(e) {
        var percentComplete = Math.ceil((e.loaded / e.total) * 100);
        
      };

if(xhr.upload)
     xhr.upload.onprogress=upload.updateProgress;

function updateProgress(evt) 
{
   if (evt.lengthComputable) {
       var progress = Math.ceil(((upload.loaded + evt.loaded) / upload.total) * 100);
       $("#dvProgressPrcent").html(progress + "%");
       $get('dvProgress').style.width = progress + '%';
   }
}


*/