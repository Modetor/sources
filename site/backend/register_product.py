# -*- coding: utf-8 -*-

import json
from datetime import datetime






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
        r += str(exp)
        con.Close()
        LogError('IsValidSession', exp)
        return [False,  r]


def RegisterProduct(detials):
    import System
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        if detials['name'].__len__() > 30:
            raise Exception('لا يمكن لإسم المنتج أن يتجاوز ال 30 حرف')
        if -1 == detials['expdate'].find('-'):
            raise Exception('صيغة التاريخ غير صحيحة')

        cmd = MySqlCommand('select name from products where serialnumber="'+str(detials['serialnumber'])+'"',con)
        rdr = cmd.ExecuteReader();
        if rdr.Read():
            rdr.Close()
            raise Exception('لا يمكن تسجيل نفس المنتج / منتجين بنفس الرقم التسلسلي')
        else:
            rdr.Close()
        # building expired-date
        p = [int(i) for i in detials['expdate'].strip().split('-')]
        expdate = datetime(p[0],p[1],p[2])
        
        
        fields = 'serialnumber, name, company,price,wholesaleprice,quantity,firstquantity,measurable,registerdate,hasexp,expdate'
        values = '"'+str(detials['serialnumber'])+'","'+str(detials['name'])+'","'+str(detials['company'])+'",'+str(detials['price'])+','+str(detials['wsprice'])+','+str(detials['quantity'])+','+str(detials['quantity'])+','+str(detials['measureable'])+',"'+datetime.now().strftime("%d-%m-%Y")+'",'+str(detials['hasexp'])+',"'+expdate.strftime("%d-%m-%Y")+'"'

        commandString = "insert into products("+fields+") values("+values+");"
        cmd = MySqlCommand(commandString,con)
        cmd.ExecuteReader();
        #System.Console.WriteLine('X '+commandString)
        con.Close()
        return [True, '']
    except Exception as exp:
        con.Close()
        System.Console.WriteLine('E '+str(exp))
        return [False, str(exp)]

check = IsValidSession(ServerParams.Get('sid').strip())

if not check[0]:
    ServerResult = check[1]
else:
    json_product = json.loads(ServerParams.Get('p'))
    check = RegisterProduct(json_product)
    if not check[0]:
        ServerResult = check[1]
    else:
        ServerResult = '1'