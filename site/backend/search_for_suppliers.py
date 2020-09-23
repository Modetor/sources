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

# > forware
# < backward

def Search(column, value, minID, move):
    try:
        if not move == ">" and not move == "<":
            raise Exception("Operation denied, parameter 'move'") 
        if minID == 0 and move == '>':
            move = '>='

        commandString = ''
        if column == None and value == None and minID == 0:
            commandString = 'SELECT * FROM suppliers LIMIT 2;'
        else:
            commandString = 'SELECT * FROM suppliers WHERE id '+move+' '+minID+' and '+column+' LIKE "%' + value + '%" LIMIT 2;'
        print("cmd:"+commandString)
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader()
        extra = '[' 
        count = 0
        firstFetchedID = 0
        lastFetchedID = 0
        while rdr.Read():
            if count == 0:
                firstFetchedID = rdr[0]
            count += 1
            debts = rdr[7]
            if str(rdr[7]) == "":
                debts = '[]'
            lastFetchedID = rdr[0]
            extra += '{"id": '+str(rdr[0])+',"fullname":"'+rdr[1]+'", "phone": "'+rdr[2]+'", "resident": "'+rdr[3]+'", "work": "'+rdr[4]+'", "position": '+str(rdr[5])+', "date": "'+rdr[6]+'", "debts": '+debts+'},'

        rdr.Close()
        # GET MAX, MIN VALUES OF id
        commandString = "select min(id), max(id) from suppliers;"
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader()
        if rdr.Read():
            canMoveForward = "false"
            if not (rdr[1] == lastFetchedID):
                canMoveForward = "true"

            canMoveBackword = "true"
            if (rdr[0] == firstFetchedID):
                canMoveBackword = "false"
            extra += '{"can-move-forward": '+canMoveForward+', "max-id":'+str(rdr[1])+', "can-move-backword": '+canMoveBackword+', "min-id": '+str(rdr[0])+'},'
        rdr.Close()
        if not count == 0:
            extra = extra[:-1] 
        extra += ']' 
        
        return [True, 0, extra]
    except Exception as exp:
        LogError('Search', exp)
        return [False, -1]


def GetSuppliersCount():
    try:
        commandString = 'select count(id) from suppliers;'
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader()
        if not rdr.Read():
            rdr.Close()
            return [False, 5]
        else:
            print("X - "+str(rdr[0])+"\n")
            rdr.Close()
            return [True, 0, 6]
    except Exception as exp:
        LogError('GetSuppliersCount', exp)
        return [False, -1]



try:
    con.Open()
    result = IsValidSession(ServerParams.Get('sid').strip())
    if not result[0]:
        ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
    else:
        if ServerParams.HasKey('fetch_count'):
            print("\nQuery for suppliers count :)\n");
            result = GetSuppliersCount()
            if not result[0]:
                ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
            else:
                ServerResult = '{"state":1, "code": '+str(result[1]) +', "extra": '+str(result[2])+'}' 
        else:
            if (not ServerParams.HasKey('type') and 
                not ServerParams.HasKey('value') and 
                not ServerParams.HasKey('move')):
                result = Search(None,None,ServerParams.HasKey('mid').strip(),'>')
            elif (not ServerParams.HasKey('type') and 
                  not ServerParams.HasKey('value') and 
                  not ServerParams.HasKey('mid') and 
                  not ServerParams.HasKey('move')):
                result = Search(None,None,0,'>')
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
