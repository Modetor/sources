# -*- coding: utf-8 -*-


con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

try:
    con.Open()
    cmd = MySqlCommand('select * from speedaccess',con)
    rdr = cmd.ExecuteReader();
    ServerResult = '['
    while rdr.Read():
        ServerResult += '{"sn": "'+str(rdr[0])+'", "name": "'+str(rdr[1])+'"} ,'
    ServerResult = ServerResult[:len(ServerResult)-1]
    ServerResult += ']'
    rdr.Close()
    con.Close()
except Exception as err:
    ServerResult = "ERR "+str(err)
finally:
    con.Close()