# -*- coding: utf-8 -*-

from datetime import datetime
from System import Console
def LogError(func,exp):
    
    Console.WriteLine('W [File:register_product, Func: '+func+'] ScriptError > '+str(exp))

def IsValidSession(session):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = None
        con.Open()
        commandString = "select expd,uid,ip from sessions where sid='"+session+"';"
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();
        if not rdr.Read():
            rdr.Close()
            state = False
            r = 'إنتهت صلاحية الجلسة أو أن الطلب قادم من خارج الشبكة'
        else:
            
            if rdr[0] == None or rdr[1] == None or rdr[2] == None:
                state = False
                r = 'خطأ فالنظام ، فشل طلب المعلومات'
            else:
                uid = int(rdr[1])
                ip = rdr[2]
                
                if not (ip == ClientAddress.split(':')[0]):
                    state = False
                    r = 'الطلب مرسل من جهاز غير مصرح له الولج لهذا الحساب ، تم رفض الطلب'
                else:
                    dNow = datetime.now()
                    expd = datetime.strptime(str(rdr[0]), '%d-%m-%Y %H:%M')

                    if dNow > expd:
                        state = False
                        r += 'إنتهت صلاحية الجلسة'
                    else:
                        state = True
                        r = uid
            rdr.Close()
        con.Close()
        return [state, r]
    except Exception as exp:
        r = str(exp)
        con.Close()
        LogError('IsValidSession', exp)
        return [False,  r]


def KillSession(uid):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        query = 'delete from sessions where uid='+uid+';'
        cmd = MySqlCommand(query, con)
        cmd.ExecuteNonQuery()
        con.Close()
        return True
    except Exception as exp:
        con.Close()
        from System import Console
        Console.WriteLine('W [File:delete_user, Func: KillSession] ScriptError > '+str(exp))
        return False


def DeleteAccount(uid):
    if not KillSession(uid):
        return False
    
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        query = 'delete from users where id='+uid+';'
        cmd = MySqlCommand(query, con)
        cmd.ExecuteNonQuery()
        con.Close()
        return True
    except Exception as exp:
        con.Close()
        from System import Console
        Console.WriteLine('W [File:delete_user, Func: DeleteAccount] ScriptError > '+str(exp))
        return False

def HasPermission(uid, targetUID):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        targetPermission = -1
        uPermission = -1
        con.Open()
        query = 'select permission from users where id='+str(uid)+' or id='+targetUID+';'
        cmd = MySqlCommand(query, con)
        rdr = cmd.ExecuteReader()
        if not rdr.Read():
            rdr.Close()
            raise Exception('query did not fetch any data[Permission column for user id='+str(uid)+'] ')
        else:
            uPermission = rdr[0]
            if rdr.Read():
                targetPermission = rdr[0]
            rdr.Close()

        con.Close()
        if targetPermission == -1 or uPermission == -1:
            raise Exception('query did not fetch $(targetPermission) and/or $(uPermission) data')
        
        if uPermission < 0: # What an exceptional case... !?
            return False
        elif uPermission >= targetPermission:
            return False
        elif targetPermission > uPermission:
            return True
        
        return False
    except Exception as exp:
        con.Close()
        LogError('HasPermission', exp)
        return False


result = IsValidSession(ServerParams.Get('sid').strip())
if not result[0]:
    ServerResult = result[1]
else:
    check = HasPermission(result[1],ServerParams.Get('id').strip())
    if not check:
        ServerResult = '0'+'لا يمكن حذف حساب بمستوى صلاحية مشابه او أعلى من صلاحية حسابك'
    else:
        if DeleteAccount(ServerParams.Get('id').strip()):
            ServerResult = '1'
        else:
            ServerResult = '0'+'فشل الإجراء'