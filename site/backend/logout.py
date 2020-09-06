import System
def Logout(uid):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()

        cmd = MySqlCommand('delete from sessions where uid='+uid,con)
        cmd.ExecuteNonQuery()

        con.Close()
        return True
    except Exception as exp:
        con.Close()
        System.Console.WriteLine('W [File:logout.py, Func: Logout] ScriptError > '+str(exp))
        return False

UID = ServerParams.Get('uid').strip()

check = Logout(UID)
if not check:
    ServerResult = '0'
else:
    ServerResult = '1'