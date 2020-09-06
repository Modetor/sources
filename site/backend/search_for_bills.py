# -*- coding: utf-8 -*-


from datetime import datetime
from System import Console

def LogError(func,exp):
    
    Console.WriteLine('W [File:search_for_bills, Func: '+func+'] ScriptError > '+str(exp))

def IsValidSession(session):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = 0
        con.Open()
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
                rdr.Close()
            else:
                uid = int(rdr[1])
                ip = rdr[2]
                perm = -1
                expd = str(rdr[0])
                rdr.Close()
                if not (ip == ClientAddress.split(':')[0]):
                    state = False
                    r = 'الطلب مرسل من جهاز غير مصرح له الولج لهذا الحساب ، تم رفض الطلب'
                else:
                    dNow = datetime.now()
                    expd = datetime.strptime(expd, '%d-%m-%Y %H:%M')
                    cmd = MySqlCommand('select permission from users where id='+str(uid),con)
                    rdr = cmd.ExecuteReader();
                    if not rdr.Read():
                        rdr.Close()
                        state = False
                        r = 11
                    else:
                        perm = rdr[0]
                    
                    if not (ip == ClientAddress.split(':')[0]):
                        state = False
                        r = 4
                    elif dNow > expd:
                        state = False
                        r = 3
                    elif perm > 1 or perm < 0:
                        state = False
                        r = 9
                    else:
                        state = True
                        r = uid
        con.Close()
        return [state, r]
    except Exception as exp:
        r = str(exp)
        con.Close()
        LogError('IsValidSession', exp)
        return [False,  r]

def haskey(k,setkeys):
    for i in setkeys:
        Console.WriteLine('W i='+i+' / k='+k)
        
        if i == k:
            return True
        
	return False

def BuildDict(con):
    try:
        dicitionary = {}
        cmd = MySqlCommand('SELECT id, fullname FROM users',con)
        rdr = cmd.ExecuteReader();
        while rdr.Read():
            dicitionary[str(rdr[0])] = str(rdr[1])
        rdr.Close()
        return dicitionary
    except Exception as exp:
        LogError('BuildDict', exp)

        return None
def GetBill(date, client, code):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = []
        con.Open()
        usersDict = BuildDict(con)

        commandString = "SELECT code,paymenttype, content, price, date, userid FROM bills "
        if code == None and date == None and client == None:
            commandString += " LIMIT 30;"
        elif not (code == None):
            commandString += " WHERE code LIKE '%" + code + "%' LIMIT 30;"
        elif not (client == None):
            commandString += " WHERE userid=" + client + " LIMIT 30;"
        elif not (date == None):
            commandString += " WHERE date LIKE '%" + date + "%' LIMIT 30;"
        Console.WriteLine('X cmd='+commandString)

        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();

        while rdr.Read():
            userID = str(rdr[5])
            username = 'مستخدم مجهول'
            if userID in usersDict:
                username = usersDict[userID]
            r.append([str(rdr[0]), str(rdr[1]), str(rdr[2]), str(rdr[3]), str(rdr[4]), username])
        if len(r) == 0:
            state = False
            r = 20
        rdr.Close()
        con.Close()
        return [state, r]
    except Exception as exp:
        con.Close()
        LogError('GetBill', exp)
        return [False, str(exp)]


#ServerResult = 


#MinID = ServerParams.Get('m')
result = IsValidSession(ServerParams.Get('sid').strip())
if not result[0]:
    ServerResult = '{"state":0, "code": '+str(result[1])+', "extra": ""}'
else:
    Code = None
    Date = None
    Client = None
    if ServerParams.HasKey('s'):
        MinID = '0'
    if ServerParams.HasKey('c'):
        Code = ServerParams.Get('c').strip()
    if ServerParams.HasKey('u'):
        Client = ServerParams.Get('u').strip()
    if ServerParams.HasKey('d'):
        Date = datetime.strptime(ServerParams.Get('d').strip(), '%Y-%m-%dT%H:%M').strftime('%d-%m-%Y %H:%M')

    result = GetBill(Date,Client, Code)

    if not result[0] and type(result[1]) == int:
        ServerResult = '{"state":0, "code": '+str(result[1])+', "extra": ""}'
    else:
        arr = result[1]
        big_json = '['
        for item in arr:
            big_json += '{"username": "'+item[5]+'", "code": "'+item[0]+'", "paymenttype": "'+item[1]+'", "price":'+item[3]+', "date": "'+item[4]+'", "content": '+str(item[2])+'},'

        big_json = big_json[:-1]+']'
        ServerResult = '{"state":1, "code": '+big_json+', "extra": ""}'