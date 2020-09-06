# -*- coding: utf-8 -*-


from System import Console
import time
import json
from datetime import datetime
import random
import string

def LogError(func,exp):
    
    Console.WriteLine('W [File:save_bills, Func: '+func+'] ScriptError > '+str(exp))

def IsValidSession(session):
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = None
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
        con.Close()
        return [state, r]
    except Exception as exp:
        r += str(exp)
        con.Close()
        LogError('IsValidSession', exp)
        return [False,  -1]


def ModifyProductsCQuantity(jsonObj, isSave):
    if not isSave:
        return [True, 0]
    con = con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        r = ''
        con.Open()

        for i in range(0, len(jsonObj)):
            commandString = 'update products set quantity='+str(jsonObj[i]['cquantity'])+' where serialnumber="'+str(jsonObj[i]['sn'])+'";'
            #System.Console.WriteLine(commandString)
            cmd = MySqlCommand(commandString,con)
            cmd.ExecuteNonQuery()

        con.Close()

        return [True, 0]
    except Exception as exp:
        con.Close()
        LogError('ModifyProductsCQuantity', exp)
        return [False, -1]


def SaveBill(UID, CODE,PAYMENT_TYPE, CONTENT, PRICE, DATE, ISSAFE):
    con = con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        #commandString = ''
        if ISSAFE:
            commandString = "INSERT INTO bills(userid, code, paymenttype, content, price, date) VALUES("+UID+", '"+CODE+"', '"+PAYMENT_TYPE+"', '"+CONTENT+"', "+PRICE+", '"+DATE+"');"
        else:
            commandString = "UPDATE bills set content='"+CONTENT+"',price="+PRICE+" WHERE code='"+CODE+"';"
        #Console.WriteLine('I cmd>'+commandString)
        cmd = MySqlCommand(commandString,con)
        cmd.ExecuteNonQuery()

        con.Close()
        return [True, 0]
    except Exception as exp:
        LogError('SaveBill', exp)
        con.Close()
        return [False, -1]


def GenerateCode(nowdate):
    return str(nowdate.year)+str(nowdate.month)+str(nowdate.day)+str(nowdate.hour)+str(nowdate.minute)+''.join(random.choice(string.hexdigits) for i in range(random.choice([8,9,10,11,12,13])))


def GetUniqueCode(num_of_tries):
    if num_of_tries == 0: 
        return [False, 8]
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = False
        Result = ''
        con.Open()
        
        code = GenerateCode( datetime.now())
        commandString = "SELECT code FROM bills WHERE code ='" + str(code) + "';"
        #select * from bills where code='2020611Ca464da8746c3e41';
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();
        if not rdr.Read():
            state = True
            Result = code 
        rdr.Close()
        con.Close()

        if not state:
            num_of_tries -= 1
            return GetUniqueCode(num_of_tries)

        return [state, Result]
    except Exception as exp:
        LogError('GetUniqueCode', exp)
        con.Close()
        return [False, -1]


def DeleteBill(code):
    con = con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        r = 0
        con.Open()
        commandString = 'DELETE FROM bills WHERE code="'+code+'";'
        cmd = MySqlCommand(commandString,con)
        if cmd.ExecuteNonQuery() == 0:
            r = 6
        con.Close()
        return [True, r]
    except Exception as exp:
        LogError('DeleteBill', exp)
        con.Close()
        return [False, -1]


start_time = time.time();


bill = json.loads(ServerParams.Get('bill').replace('\'','"'))
jsonBill = repr(bill)
sid = ServerParams.Get('sid')
is_save = True
if ServerParams.HasKey('update'):
    is_save = False

#ServerResult = str(dir(function))

result = IsValidSession(sid)
if not result[0]:
    ServerResult = '{"state":0, "code": '+str(result[1])+', "extra": ""}'
else:
    if not ( type(result[1]) == int ):
        ServerResult = '{"state":0, "code": 10, "extra": ""}'
    elif len(bill) == 0:
        if is_save:
            ServerResult = '{"state":0, "code": 7, "extra": ""}'
        else:
            del_result = DeleteBill(ServerParams.Get('update'))
            if del_result:
                ServerResult = '{"state":1, "code": '+str(del_result[1]) +', "extra": ""}'
            else:
                ServerResult = '{"state":0, "code": '+str(del_result[1]) +', "extra": ""}' 
    else:
        try_get_unique_code = [True, ''] 
        if is_save:
           try_get_unique_code = GetUniqueCode(10)
        else:
            try_get_unique_code[1] = ServerParams.Get('update')
        if not try_get_unique_code[0]:
            ServerResult = '{"state":0, "code": '+str(try_get_unique_code[1]) +', "extra": ""}'
        else:
            nowdate = datetime.now()
            bill_code = try_get_unique_code[1]
            bill_uid = str(result[1])
            bill_date = nowdate.strftime("%d-%m-%Y %H:%M")
            ServerResult = ''
            total = 0
            bill_content = "["

            for i in range(0, len(bill)):
                total += bill[i]['total']
                bill_content += '{"sn": "' + bill[i]['sn'] + '", "name": "' + bill[i]['name'] + '", "price": ' + str(bill[i]['price']) + ', "wsprice": ' + str(bill[i]['wsprice']) + ', "quantity": ' + str( bill[i]['quantity']) + ', "measurable": ' + str(bill[i]['measurable'])+'},'
                bill[i]['cquantity'] -= bill[i]['quantity']
            bill_content = bill_content[:-1]
            bill_content += ']'

            result = ModifyProductsCQuantity(bill, is_save)
            if not result[0]: 
                ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}' 
            else:
                result = SaveBill(bill_uid, bill_code,ServerParams.Get('type'), bill_content, str(total), bill_date, is_save)
                if result[0]:
                    ServerResult = '{"state":1, "code": '+str(result[1]) +', "extra": ""}'
                else:
                    ServerResult = '{"state":0, "code": '+str(result[1]) +', "extra": ""}'
        
Console.WriteLine('X Time : '+str(time.time() - start_time))

