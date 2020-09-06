# -*- coding: utf-8 -*-


from datetime import datetime
import hashlib
import System


def IsValidSession(session):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = ''
        con.Open()
        commandString = "select sid,expd from sessions where sid='"+session+"';"
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader()
        if not rdr.Read():
            rdr.Close()
            state = False
            r = 'no_data_to_read'
        else:
            
            if rdr[0] == None or rdr[1] == None:
                state = False
                r = 'internal_error'
            else:
                uid = rdr[1]
                dNow = datetime.now()
                sd = datetime.strptime(str(rdr[1]), '%d-%m-%Y %H:%M')

                if dNow > sd:
                    state = False
                    r += 'expired_session'
                else:
                    state = True
                    r = uid
            rdr.Close()
        con.Close()
        return [state, r]
    except Exception as exp:
        r += str(exp)
        con.Close()
        System.Console.WriteLine('W [File:add_account.py, Func: IsValidSession] ScriptError > '+str(exp))
        return [False,  r]

def CheckInputData(n,p,pr):
    try:
        int(pr)
    except:
        return False
    if not type(n) == str:
        return  False 
    if not type(p) == str:
        return  False 

    return True

def AddAccount(n,p,pr): 
    #import System
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        values = "'"+n+"','"+hashlib.md5(p.encode('utf8')).hexdigest()+"','"+datetime.now().strftime("%d-%m-%Y %H:%M")+"',"+pr
        commandString = "insert into users (fullname, password, createdat, permission) values("+values+");"
        cmd = MySqlCommand(commandString,con)
        cmd.ExecuteNonQuery()
        con.Close()
        return [True, '1']
    except Exception as exp:
        con.Close()
        System.Console.WriteLine('W [File:add_account.py, Func: AddAccount] ScriptError > '+str(exp))
        return [False, str(exp)]

def DoeThisAccountExist(n,p):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = False
        con.Open()
        query = "SELECT id, permission FROM users WHERE fullname='"+n+"' limit 1;"
        cmd = MySqlCommand(query,con)
        rdr = cmd.ExecuteReader();
        if rdr.Read():
            state = True

        rdr.Close()
        con.Close()
        return state
    except Exception as exp:
        System.Console.WriteLine('W [File:add_account.py, Func: DoeThisAccountExist] ScriptError > '+str(exp))
        con.Close()
        return False


Name = ServerParams.Get('name').strip()
Password = ServerParams.Get('password').strip()
Permission = ServerParams.Get('permission')
SID = ServerParams.Get('sid')

check = IsValidSession(SID)

if not check[0]:
    ServerResult = check[1]
else:
    if not CheckInputData(Name, Password, Permission):
        import System
        System.Console.WriteLine("W Warning >> Invalid data")
        ServerResult = "البيانات المدخلة غير صحيحة"
    else:
        check = DoeThisAccountExist(Name,Password)
        if not check:
            check = AddAccount(Name, Password, Permission)
            if not check[0]:
                ServerResult = '0'+check[1]
            else:
                ServerResult = check[1]
        else:
            ServerResult = 'إسم المستخدم مسجل ، جرب إسم أخر'
        