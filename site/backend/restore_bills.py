# -*- coding: utf-8 -*-

#import System

code = ServerParams.Get('code').strip()


def GetBill():
    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        state = True
        r = []
        con.Open()

        commandString = "SELECT code,paymenttype, content, price, date FROM bills WHERE code LIKE '%" + code + "%' LIMIT 30;"
        #System.Console.WriteLine(commandString)
        #select * from bills where code='2020611Ca464da8746c3e41';
        cmd = MySqlCommand(commandString,con)
        rdr = cmd.ExecuteReader();

        while rdr.Read():
            r.append([str(rdr[0]), str(rdr[1]), str(rdr[2]), str(rdr[3]), str(rdr[4])])
        if len(r) == 0:
            state = False
            r = 'لم يتم إيجاد أي فاتورة مطابقة لجملة البحث'
        rdr.Close()
        con.Close()
        return [state, r]
    except Exception as exp:
        con.Close()
        
        return [False, str(exp)]


#ServerResult = 

result = GetBill()

if not result[0]:
    ServerResult = '0'+str(result[1])
else:
    arr = result[1]
    big_json = '['
    #
    for item in arr:
        big_json += '{"code": "'+item[0]+'", "paymenttype": "'+item[1]+'", "price":'+item[3]+', "date": "'+item[4]+'", "content": '+str(item[2])+'},'
        '''productList = item[2].split(';')
        tiny_json = ''
        for product in productList:
            detials = product.split(',')
            tiny_json += '{"sn": "'+detials[0]+'", "name": "'+detials[1]+'", "quantity": '+detials[2]+', "price": '+detials[3]+', "total": '+detials[4]+'},'
        big_json += tiny_json[:-1]
        #System.Console.WriteLine('W '+str())
        big_json += ']},'''
    big_json = big_json[:-1]+']'
    ServerResult = big_json
    #System.Console.WriteLine("I "+str(big_json))
