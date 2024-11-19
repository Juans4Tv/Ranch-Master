from flask_mysqldb import MySQL
import MySQLdb.cursors

mysql = None

def init_app(app):
    """Inicializa la conexión a MySQL con la configuración de Flask."""
    global mysql
    mysql = MySQL(app)

def login(rol, password):
            cur=mysql.connection.cursor()
            cur.execute('SELECT * FROM usuarios where rol = %s AND contraseña = %s ',(rol,password,))
            account = cur.fetchone()
            cur.close()
            if account:
                return account
            else:
                return account

def consulta(tableName):
    # Usar una consulta parametrizada para evitar inyección SQL
    query = f"SELECT * FROM {tableName}"  # Aquí construimos la consulta SQL
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute(query)  # Ejecutamos la consulta
    account = cur.fetchall()  # Recuperamos todos los registros
    cur.close()  # Cerramos el cursor para liberar recursos
    return account


def consultar_alimentacion_ganado(id):
    query = """SELECT a.id_alimentacion, a.tipo_alimento, a.cantidad, a.frecuencia, a.fecha_registro
        FROM ganado g
        INNER JOIN alimentacion_ganado ag ON g.id_ganado = ag.id_ganado
        INNER JOIN alimentacion a ON ag.id_alimentacion = a.id_alimentacion
        WHERE g.id_ganado = %s"""  # Usamos un marcador de parámetro
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute(query, (id,))  # Pasamos id como un parámetro
    account = cur.fetchall()  # Recuperamos todos los registros
    cur.close()  # Cerramos el cursor para liberar recursos    
    return account

def consultar_estado():
    query= """select * from alertas_agua where estado_alerta='activa'"""
    cur = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cur.execute(query)  # Pasamos id como un parámetro
    account = cur.fetchall()  # Recuperamos todos los registros
    cur.close()  # Cerramos el cursor para liberar recursos    
    return account




def registro(tabla,tipo_agua,cantidad_estado,frecuencia,fecha,id_usuario):
    cur = mysql.connection.cursor()
    if tabla == 'alimentacion':
        query= "INSERT INTO alimentacion (tipo_alimento,cantidad,frecuencia,fecha_registro,id_usuario) VALUES (%s,%s,%s,%s,%s)"
        cur.execute(query, (tipo_agua, cantidad_estado, frecuencia,fecha,id_usuario))
    elif tabla == 'alertas':
        query= "INSERT INTO alertas_agua (nivel_agua,fecha_alerta,id_usuario,estado_alerta) VALUES (%s, %s,%s,%s)"
        cur.execute(query, (tipo_agua,fecha,id_usuario,cantidad_estado))
    elif tabla == 'vinculacion':
        query= "INSERT INTO alimentacion_ganado (id_ganado,id_alimentacion) VALUES (%s,%s)"
        cur.execute(query, (id_usuario,cantidad_estado))
    elif tabla == 'ganado':
         query="INSERT INTO ganado (raza,edad,peso,estado,id_usuario) VALUES (%s,%s,%s,%s,%s)"
         cur.execute(query,(tipo_agua,cantidad_estado,frecuencia,fecha,id_usuario))        
    
    if cur.rowcount > 0:
        resultado = {'message': 'Dato insertado exitosamente'}
    else:
        resultado = {'message': 'No se insertaron datos'}
    # Confirmar la inserción
    mysql.connection.commit()
    cur.close()
    return resultado
     
def actualizacion(tabla, tipo_agua, cantidad_estado, frecuencia, id,estadoser='null'):
    try:
        cur = mysql.connection.cursor()
        if tabla == 'alimentacion':
            query = """
                UPDATE alimentacion 
                SET tipo_alimento = COALESCE(%s, tipo_alimento), 
                    cantidad = COALESCE(%s, cantidad), 
                    frecuencia = COALESCE(%s, frecuencia)
                WHERE id_alimentacion = %s
            """
            print("Ejecutando consulta:", query)  # Depuración
            print("Valores:", (tipo_agua, cantidad_estado, frecuencia, id))  # Depuración
            cur.execute(query, (tipo_agua, cantidad_estado, frecuencia, id))
        
        elif tabla == 'alertas':
            query = """
                UPDATE alertas_agua 
                SET nivel_agua = COALESCE(%s, nivel_agua), 
                    estado_alerta = COALESCE(%s, estado_alerta)
                WHERE id_alerta = %s
            """
            print("Ejecutando consulta:", query)  # Depuración
            print("Valores:", (tipo_agua, cantidad_estado, id))  # Depuración
            cur.execute(query, (tipo_agua, cantidad_estado, id))
        elif tabla=='ganado':
            query = """
                UPDATE ganado
                SET raza = COALESCE(%s, raza), 
                    edad = COALESCE(%s, edad),
                    peso = COALESCE(%s, peso),
                    estado = COALESCE(%s, estado)
                WHERE id_ganado = %s
            """
            print("Ejecutando consulta:", query)  # Depuración
            print("Valores:", (tipo_agua, cantidad_estado,frecuencia,estadoser,id))  # Depuración
            cur.execute(query, (tipo_agua, cantidad_estado,frecuencia,estadoser,id))           
        
        mysql.connection.commit()
        
        if cur.rowcount > 0:
            resultado = {'success': True, 'message': 'actualizacion modificado correctamente'}
        else:
            resultado = {'success': False, 'message': 'No se encontró un registro con el ID proporcionado'}
        
        return resultado

    except Exception as e:
        print("Error al actualizar en la base de datos:", str(e))  # Imprime el error
        return {'success': False, 'message': 'Error interno al actualizar', 'error': str(e)}
    finally:
        cur.close()

def cambioAlerta(id,estado):
    cur= mysql.connection.cursor()
    query="""UPDATE alertas_agua 
            SET estado_alerta = COALESCE(%s, estado_alerta) 
                WHERE id_alerta = %s"""
    cur.execute(query,(estado,id))
    mysql.connection.commit()
            
    if cur.rowcount > 0:
            resultado = {'success': True, 'message': 'actualizacion modificado correctamente'}
    else:
            resultado = {'success': False, 'message': 'No se encontró un registro con el ID proporcionado'}
    cur.close()
    return resultado

def datosGenerales():
    tablas = ["ganado", "alimentacion", "alertas_agua"]
    consultar = []
    cur = mysql.connection.cursor()

    for tabla in tablas:
        # Formar la consulta con el nombre de la tabla directamente
        cur.execute(f'SELECT COUNT(*) FROM {tabla}')
        account = cur.fetchone()
        consultar.append(account[0])  # Agrega el número de registros en lugar de la tupla completa
    
    cur.close()
    return consultar



#consultas propias del ganadero
def consultaIDGanado(id):
    cur = mysql.connection.cursor()
    query="""select id_ganado from ganado where id_ganado=%s"""
    cur.execute(query,(id,))
    account= cur.fetchone()
    cur.close()
    return account

