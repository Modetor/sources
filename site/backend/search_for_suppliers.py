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
        return [state, r]
    except Exception as exp:
        r += str(exp)
        LogError('IsValidSession', exp)
        return [False,  -1]


def Search(column, value, minID, move):
    try:
        if not move == ">" and not move == "<":
            raise Exception("Operation denied, parameter 'move'") 
        if minID == 0 and move == '>':
            move = '>='
        commandString = 'SELECT * FROM suppliers WHERE id '+move+' '+minID+' and '+column+' LIKE "%' + value + '%" LIMIT 30;'
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();
        extra = '[' 
        while rdr.Read():
            debts = rdr[7]
            print("W H::: > "+str(rdr[7]))
            if str(rdr[7]) == "":
                debts = '[]'
            extra += '{"id": '+str(rdr[0])+',"fullname":"'+rdr[1]+'", "phone": "'+rdr[2]+'", "resident": "'+rdr[3]+'", "work": "'+rdr[4]+'", "position": '+str(rdr[5])+', "date": "'+rdr[6]+'", "debts": "'+debts+'"},'

        extra = extra[:-1]
        extra += ']' 
        rdr.Close()
        return [True, 0, extra]
    except Exception as exp:
        LogError('Search', exp)
        return [False, -1]



try:
    con.Open()
    result = IsValidSession(ServerParams.Get('sid').strip())
    if not result[0]:
        ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
    else:
        result = Search(
            ServerParams.Get('type').strip(),ServerParams.Get('value').strip(),
            ServerParams.Get('minID').strip(), ServerParams.Get('move').strip()
        )
        if not result[0]:
            ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
        else:
            ServerResult = '{"state":1, "code": '+str(result[1]) +', "extra": '+result[2]+'}' 
except Exception as exp:
    con.Close()
    LogError("___main___", exp)
    ServerResult = '{"state":0, "code": -1, "extra": ""}' 
finally:
    con.Close()

    #div[suppliers-screen] > div[full-content-container] 
    # > div.ux-fragment[smaller2] > div.ux-fragment-content