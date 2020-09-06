# -*- coding: utf-8 -*-

if ServerParams.HasKey('data'):
    import json
    import System
    data = json.loads(ServerParams.Get('data'))

    con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')
    try:
        con.Open()
        affect = False
        for item in data:
            SelectCommand = 'select quantity from products where serialnumber="'+item['sn']+'"'
            #System.Console.WriteLine('W Command > '+SelectCommand)
            cmd = MySqlCommand(SelectCommand,con)
            rdr = cmd.ExecuteReader();
            if not rdr.Read():
                rdr.Close()
                ServerResult = 'لم يتم التعرف على المنتج'
            else:
                newQuantity = item['quantity']+rdr[0]
                System.Console.WriteLine('Q Quantity '+str(rdr[0]) + ', Item\'s quantity '+str(item['quantity']) + ', new > '+str(newQuantity))
                rdr.Close()
                UpdateCommand = 'update products set quantity='+str(newQuantity)+' where serialnumber="'+item['sn']+'"'
                cmd = MySqlCommand(UpdateCommand,con)
                if cmd.ExecuteNonQuery() == 0:
                    affect = False
                    System.Console.WriteLine('W [File:restore_products] Message: No effected items')
                else:
                    affect = True
                #System.Console.WriteLine('I Done :-)')
                
            #System.Console.WriteLine('W Something here'+str(item))
        ServerResult = '{"affected":'+str(affect)+', "state": 1'+'}'

        con.Close()
    except Exception as exp:
        con.Close()
        ServerResult = '{"affected":false, "state": 0,"errmsg":"'+str(exp)+'"}' 

else:
    ServerResult = '{"affected":false, "state": 0,"errmsg":"err"}' 