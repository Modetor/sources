# -*- coding: utf-8 -*-
from datetime import datetime

def IsValidSession(session):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = ''
        con.Open()
        commandString = "select expd,uid from sessions where sid='"+session+"';"
        #select * from users where sid='804947129502';
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();
        if not rdr.Read():
            rdr.Close()
            state = False
            r = 'No data to read'
        else:
            
            if rdr[0] == None or rdr[1] == None:
                state = False
                r = 'internal error'
            else:
                uid = rdr[1]
                dNow = datetime.now()
                sd = datetime.strptime(str(rdr[0]), '%d-%m-%Y %H:%M')

                if dNow > sd:
                    state = True
                    r += ServerFullAddress+'/site'
                else:
                    state = True
                    r = '1'
            rdr.Close()
        con.Close()
        return [state, r]
    except Exception as exp:
        r += str(exp)
        con.Close()
        return [False,  r]


r = IsValidSession(ServerParams.Get('sid').strip())
if r[0]:
    ServerResult = r[1]
else:
    ServerResult = '0'+r[1]