# -*- coding: utf-8 -*-

def KillSession(uid):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        query = 'delete from sessions where uid='+uid+';'
        cmd = MySqlCommand(query, con)
        cmd.ExecuteNonQuery()
        con.Close()
        return True
    except Exception as exp:
        con.Close()
        from System import Console
        Console.WriteLine('W [File:kill_session, Func: KillSession] ScriptError > '+str(exp))
        return False
    
if KillSession(ServerParams.Get('id').strip()):
    ServerResult = '1'
else:
    ServerResult = '0'