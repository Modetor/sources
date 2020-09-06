# -*- coding: utf-8 -*-

#import System
from datetime import datetime

def GetProducts(n):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

    try:
        con.Open()
        result = '['
        state = True
        commandString = "SELECT name, serialnumber, price, expdate FROM products WHERE name LIKE '%" + n + "%' LIMIT 50;"

        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();

        counter = 0
        while rdr.Read():
            counter += 1
            expired = 0
            if datetime.now() > datetime.strptime(str(rdr[3]), '%d-%m-%Y'):
                expired = 1
            result += '{"name": "'+rdr[0]+'", "sn": "'+rdr[1]+'", "price":'+str(rdr[2])+', "expired": "'+str(expired)+'"},'
        
        #System.Console.WriteLine('X '+str(result))
        if counter == 0:
            state = False
            result = 'لم يتم العثور على منتجات مطابقة لعبارة البحث'
        else:
            result = result[:-1] + ']'
        con.Close()
        return [state, result]
    except Exception as exp:
        con.Close()
        return [False, str(exp)]










name = str(ServerParams.Get('name')).strip()

result = GetProducts(name)

if not result[0]:
    ServerResult = result[1]
else:
    ServerResult = '1'+str(result[1])