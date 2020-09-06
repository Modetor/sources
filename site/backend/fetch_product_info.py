# -*- coding: utf-8 -*-


from datetime import datetime 

serialnumber = ServerParams.Get('product')
quantity = int(ServerParams.Get('quantity'))
con = MySqlConnection('server=localhost;user=root;database=db_test;port=3333;password=Mqlprovider_0')

try:
    con.Open()
    fields = 'name, price, wholesaleprice,quantity, expdate, measurable, hasexp'
    commandString = "SELECT " + fields + " FROM products WHERE serialnumber = '" + serialnumber + "';"

    cmd = MySqlCommand(commandString,con)
    rdr = cmd.ExecuteReader();
    if not rdr.Read():
        ServerResult = "Product did not found"
        rdr.Close()
    else:
        current_quantity = rdr[3]
        expdate = datetime.strptime(rdr[4], '%d-%m-%Y')
        if current_quantity <= 0:
            ServerResult = "quantity is 0"
        elif quantity > current_quantity:
            ServerResult = "product's quantity is less than required"
        elif rdr[6] == 1 and datetime.now() >= expdate:
            ServerResult = "Product expired"
        else:
            ServerResult = '1{"sn": "' + serialnumber + '", "name": "' + rdr[0] + '", "price": ' + str(rdr[1]) + ', "wsprice": ' + str(rdr[2]) + ', "quantity": ' + str(quantity) + ',"cquantity": ' + str(current_quantity) + ', "measurable": ' + str(rdr[5]) + '}'
        rdr.Close()
    con.Close()
except Exception as err:
    ServerResult = 'ERR: '+str(err)
finally:
    con.Close()
