# -*- coding: utf-8 -*-

from System import Console
from datetime import datetime, timedelta

con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')


def LogError(func,exp):
    
    Console.WriteLine('W [File:save_bills, Func: '+func+'] ScriptError > '+str(exp))


def CreateSession(sid):
    sd = (datetime.now()+timedelta(hours=12)).strftime("%d-%m-%Y %H:%M")
    createSessionCommand = MySqlCommand("update sessions set expd='"+sd+"' where sid="+str(sid)+";",con)
    affected = createSessionCommand.ExecuteNonQuery()
    if affected == 0:
        return [False, 10]
    else:
        return [True, 0]

def IsValidSession(session):
    try:
        state = True
        r = None
        commandString = "select expd,uid,ip from sessions where sid='"+session+"';"
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader()
        if not rdr.Read():
            rdr.Close()
            state = False
            r = 10
        else:
            if rdr[0] == None or rdr[1] == None or rdr[2] == None:
                state = False
                r = 5
            else:
                uid = int(rdr[1])
                ip = rdr[2]
                
                if not (ip == ClientAddress.split(':')[0]):
                    state = False
                    r = 4
                else:
                    state = True
                    r = uid
            rdr.Close()
        return [state, r]
    except Exception as exp:
        r += str(exp)
        LogError('IsValidSession', exp)
        return [False,  -1]



sid = ServerParams.Get('sid').strip()

try:
    con.Open()
    result = IsValidSession(sid) #print("SSX ->"+repr(result))
    if result[0] == False:
        ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
    else:
        result = CreateSession(sid)
        if result[0] == False:
            ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": "NO_AFFECTED_CELLS"}' 
        else:
            ServerResult = '{"state":1, "code": '+str(result[1]) +', "extra": "AFFECTED"}' 
    con.Close()
except Exception as exp:
    ServerResult = '{"state":0, "code": -1, "extra": "'+str(exp)+'"}'
finally:
    con.Close()








