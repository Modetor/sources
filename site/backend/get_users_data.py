# -*- coding: utf-8 -*-


from datetime import datetime

def GetActiveSessions():
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        result = []
        query = "SELECT uid,expd FROM sessions;"
        cmd = MySqlCommand(query,con)
        rdr = cmd.ExecuteReader()

        while rdr.Read():
            sessionDidnotExpired = True
            try:
                if datetime.now() > datetime.strptime(rdr[1]):
                    sessionDidnotExpired = False
            except:
                pass
            if sessionDidnotExpired:
                result.append(rdr[0])
        rdr.Close()
        con.Close()
        return result
    except Exception as exp:
        con.Close()
        from System import Console
        Console.WriteLine('W [File:get_users_data, Func: GetActiveSessions] ScriptError > '+str(exp))
        return []

def IsOnline(ids, id):
    for ID in ids:
        if id == ID:
            return True
    
    return False

def GetData():
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        sessionsUID = GetActiveSessions()
        jsonText = '['
        state = True
        con.Open()
        query = "SELECT fullname,createdat, permission, id FROM users;"
        cmd = MySqlCommand(query,con)
        rdr = cmd.ExecuteReader()
        while rdr.Read():
            online = '0'
            if IsOnline(sessionsUID,rdr[3]):
                online = '1'
            jsonText += '{"name":"'+ str(rdr[0]) + '", "permission":'+str(rdr[2])+ ', "createdat":"'+ str(rdr[1]) + '", "online":'+online+', "id":'+str(rdr[3])+'},'

        jsonText = jsonText[:-1]+ ']'
        rdr.Close()

        con.Close()
        return [state, jsonText]
    except Exception as exp:
        con.Close()
        from System import Console
        Console.WriteLine('W [File:get_users_data, Func: GetData] ScriptError > '+str(exp))
        return [False, str(exp)]

result = GetData()

if not result[0]:
    ServerResult = '0'+result[1]
else:
    ServerResult = result[1]

