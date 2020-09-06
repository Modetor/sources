# -*- coding: utf-8 -*-

import hashlib
from datetime import datetime 
from datetime import timedelta  
import string
import random
import System



def CreateSession(uid, con):
    sid = ''.join(random.choice(string.digits) for i in range(12))
    expd = (datetime.now()+timedelta(hours=12)).strftime("%d-%m-%Y %H:%M")
    try:
        createSessionCommand = MySqlCommand("insert into sessions(uid, sid, expd,ip) values("+uid+",'"+sid+"','"+expd+"', '"+ClientAddress.split(':')[0]+"');",con)
        createSessionCommand.ExecuteNonQuery()
        return [True, [sid, expd]]
    except Exception as exp:
        System.Console.WriteLine('W [File:login, Func: CreateSession] ScriptError > '+str(exp))
        return [False, str(exp)]

def DeleteSession(uid, con):
    try:
        createSessionCommand = MySqlCommand("delete from sessions where uid="+uid+";",con)
        createSessionCommand.ExecuteNonQuery()
    except Exception as exp:
        System.Console.WriteLine('W [File:login, Func: DeleteSession] ScriptError > '+str(exp))

def GetUserPageLinkByPermission(p):
    link = ServerFullAddress+'/site/'
    if p == 0:
        return link+'root.html'
    elif p == 1:
        return link+'admin.html'
    elif p == 2:
        return link+'client.html'

def Login(n,p):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        r = ''
        s = True
        con.Open()
        query = "SELECT id, permission FROM users WHERE fullname='"+n+"' and password='"+''.join(hashlib.md5(p.encode('utf8')).hexdigest())+"' limit 1;"
        cmd = MySqlCommand(query,con)
        rdr = cmd.ExecuteReader();
        if not rdr.Read():
            r = "إسم المستخدم أو كلمة المرور غير صحيحة"
            s = False
            rdr.Close()
        else:
            uid = str(rdr[0])
            perm = rdr[1]
            rdr.Close()
            userPageLink = GetUserPageLinkByPermission(perm)
            cmd = MySqlCommand('select sid, expd, ip from sessions where uid='+str(uid)+' limit 1;',con)
            rdr = cmd.ExecuteReader();
            if not rdr.Read():
                # Here i'll start a new session to our users
                rdr.Close()
                doesWorkDone = CreateSession(uid, con)
                if not doesWorkDone[0]:
                    r = doesWorkDone[1]
                    s = False
                else:
                    r ='{"id": '+str(uid)+', "fullname": "'+n+'", "permission": '+str(perm)+', "expd": "'+doesWorkDone[1][1]+'", "sid": "'+doesWorkDone[1][0]+'", "upl":"'+userPageLink+'"}'
            else:
                sid = rdr[0]
                expd = rdr[1]
                ip = rdr[2]
                rdr.Close()
                if datetime.now() > datetime.strptime(expd, "%d-%m-%Y %H:%M"):
                    DeleteSession(uid,con)
                    doesWorkDone = CreateSession(uid, con)
                    if not doesWorkDone[0]:
                        r = doesWorkDone[1]
                        s = False
                    else:
                        r ='{"id": '+str(uid)+', "fullname": "'+n+'", "permission": '+str(perm)+', "expd": "'+doesWorkDone[1][1]+'", "sid": "'+doesWorkDone[1][0]+'", "upl":"'+userPageLink+'"}'
                else:
                    if ip == ClientAddress.split(':')[0]:
                        r ='{"id": '+str(uid)+', "fullname": "'+n+'", "permission": '+str(perm)+', "expd": "'+expd+'", "sid": "'+sid+'", "upl":"'+userPageLink+'"}'
                        #System.Console.WriteLine('W A login request came from \''+ClientAddress.split(":")[0]+'\' but \''+ip+'\' owns the sessions')
                    else:
                        System.Console.WriteLine('W A login request came from \''+ClientAddress.split(":")[0]+'\' but only \''+ip+'\' can login using current session. Request denied')
                        r = 'لا يمكن لأكثر من جهاز بالدخول لهذا الحساب'
                        s = False
                rdr.Close()


        con.Close()
        return [s, r]
    except Exception as exp:
        con.Close()
        System.Console.WriteLine('W [File:login, Func: Login] ScriptError > '+str(exp))
        return [False, str(exp)]






user = ServerParams.Get("u")
password = ServerParams.Get("p")


check = Login(user, password)
if not check[0]:
    ServerResult = '0'+check[1]
else:
    ServerResult = check[1]