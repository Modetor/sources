# -*- coding: utf-8 -*-

import hashlib
from datetime import datetime 
from datetime import timedelta  
import string
import random

user = ServerParams.Get("u")
password = ServerParams.Get("p")

con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')


def CreateSession(uid):
    sid = ''.join(random.choice(string.digits) for i in range(12))
    sd = (dNow+timedelta(hours=12)).strftime("%d-%m-%Y %H:%M")
    createSessionCommand = MySqlCommand("update users set sd='"+sd+"' ,sid='"+sid+"' where id="+str(uid)+";",con)
    try:
        affectedRows = createSessionCommand.ExecuteNonQuery()
        return sid
    except Exception as exp:
        return "ERROR : "+str(exp)


try:
    import System
    System.Console.WriteLine( "X SELECT * FROM users WHERE fullname='"+user+"' and password='"+''.join(hashlib.md5(password.encode()).hexdigest())+"';")
    con.Open()
    commandString = "SELECT id, permission FROM users WHERE fullname='"+user+"' and password='"+''.join(hashlib.md5(password.encode()).hexdigest())+"';"
    cmd = MySqlCommand(commandString,con)
    rdr = cmd.ExecuteReader();
    if not rdr.Read():
        ServerResult = "No matched user"
        rdr.Close()
    else:
        uid = rdr[0]
        permission = rdr[1]
        sid = rdr[3]
        sdText = rdr[2]
        System.Console.WriteLine(sdText)
        dNow = datetime.now()
        rdr.Close()
        if sdText == "null" or sdText == '':
            sid = CreateSession(uid)
            ServerResult = '1;{"id": '+str(uid)+', "fullname": "'+user+'", "permission": '+str(permission)+', "sd": "'+sdText+'", "sid": "'+sid+'"}'
        else:
            try:
                sd = datetime.strptime(sdText, '%d-%m-%Y %H:%M')
                if dNow > sd:
                    sid = CreateSession()
                    ServerResult = '1;{"id": '+str(uid)+', "fullname": "'+user+'", "permission": '+str(permission)+', "sd": "'+sdText+'", "sid": "'+sid+'"}'
                else:
                    ServerResult = 'هذا الحساب قيد الإستخدام حاليا، تم تقييد الوصول' #1;{"id": '+str(uid)+', "fullname": "'+user+'", "permission": '+str(permission)+', "sd": "'+sdText+'", "sid": "'+sid+'"}'

            except Exception as exp:
                ServerResult = str(exp)
            
        #ServerResult += "\n\nNow : "+ str(dNow) +", ADD : "+ str( dNow + timedelta(hours=8))
    con.Close()
except Exception as identifier:
    ServerResult = 'ERR:'+str(identifier)
finally:
    con.Close()
#C:\Users\Mohammad\Desktop\DevTool - Server\res\data\embed\sources\site\login\index.py