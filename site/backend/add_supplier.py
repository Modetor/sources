# -*- coding: utf-8 -*-

from datetime import datetime

con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

def LogError(func,exp):
    print('W [File:add_supplier, Func: '+func+'] ScriptError > '+str(exp)+'\n')



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
        return [state, r]
    except Exception as exp:
        r += str(exp)
        LogError('IsValidSession', exp)
        return [False,  -1]

def CreateAccount(name,phones,resident, work, position):
    try:
        commandString = 'INSERT INTO suppliers (fullname, phone,resident, work,position,date) VALUES("'+name+'", "'+phones+'", "'+resident+'", "'+work+'",'+position+', "'+datetime.now().strftime("%d-%m-%Y %H:%M")+'")'
        cmd = MySqlCommand(commandString,con)
        cmd.ExecuteNonQuery()
        return [True, 0]
    except Exception as exp:
        LogError('CreateAccount', exp)
        return [False, -1]
    




try:
    con.Open()
    result = IsValidSession(ServerParams.Get('sid').strip())
    if not result[0]:
        ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
    else:
        result = CreateAccount(
            ServerParams.Get('name').strip(),ServerParams.Get('phones').strip(),
            ServerParams.Get('resident').strip(), ServerParams.Get('work').strip(),
            ServerParams.Get('position').strip()
        )
        if not result[0]:
            ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
        else:
            ServerResult = '{"state":1, "code": '+str(result[1]) +', "extra": ""}' 
except Exception as exp:
    con.Close()
    LogError("___main___", exp)
    ServerResult = '{"state":0, "code": -1, "extra": ""}' 
finally:
    con.Close()