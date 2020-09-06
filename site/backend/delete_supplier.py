# -*- coding: utf-8 -*-

from datetime import datetime

con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

def LogError(func,exp):
    print('W [File:search_for_suppliers, Func: '+func+'] ScriptError > '+str(exp)+'\n')


def IsValidSession(session):
    try:
        state = True
        r = None
        commandString = "select expd,uid,ip from sessions where sid='"+session+"';"
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();
        if not rdr.Read():
            rdr.Close()
            state = False
            r = 1
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
                    dNow = datetime.now()
                    expd = datetime.strptime(str(rdr[0]), '%d-%m-%Y %H:%M')

                    if dNow > expd:
                        state = False
                        r = 3
                    else:
                        state = True
                        r = uid
            rdr.Close()
            if state:
                commandString = "select permission from users where id="+str(r)+";"
                cmd = MySqlCommand(commandString,con)
                rdr = cmd.ExecuteReader()
                if not rdr.Read():
                    rdr.Close()
                    state = False
                    r = 1
                else:
                    if rdr[0] > 1:
                        state = False
                        r = 9
                    else:
                        state = True
                        r = 0
                rdr.Close()
        return [state, r]
    except Exception as exp:
        r += str(exp)
        LogError('IsValidSession', exp)
        return [False,  -1]




try:
    con.Open()
    result = IsValidSession(ServerParams.Get('sid').strip())
    if not result[0]:
        ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
    else:
        query = 'DELETE FROM suppliers WHERE id='+ServerParams.Get('id').strip()+';'
        cmd = MySqlCommand(query,con)
        if cmd.ExecuteNonQuery() == 0:
            ServerResult = '{"state":0, "code": 6, "extra": ""}' 
        else:
            ServerResult = '{"state":1, "code": 0, "extra": ""}' 
except Exception as exp:
    con.Close()
    LogError("___main___", exp)
    ServerResult = '{"state":0, "code": -1, "extra": ""}' 
finally:
    con.Close()

