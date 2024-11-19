from flask import Flask, request, redirect, jsonify, render_template
import db

app = Flask(__name__, template_folder="template")

# Conexión a la base de datos MySQL
app.config['MYSQL_HOST']='localhost'
app.config['MYSQL_USER']='root'
app.config['MYSQL_PASSWORD']='System'
app.config['MYSQL_DB']='ranchmaster_db'

# Inicializar la conexión a la base de datos con la configuración de Flask
db.init_app(app)


@app.route('/')
def basic():
    return render_template("PaginaInicio.html")


@app.route('/login')
def pagini():
    return render_template('iniciarSesion.html')

@app.route('/login', methods=["POST"])
def login():
    data= request.json
    username= data.get('role')
    password= data.get('password')

    info = db.login(username,password)

    if info:
        return jsonify({'message':'usuario encontrado'}, {'success':'True'}),200
    else:
        return jsonify({'message':'usuario no encontrado'},{'success':'False'}),200
    



#Datos del ganadero e informacion de este mismo
#numeros de sesiones del encargados
@app.route('/encargado')
def pagenca():
    return render_template('Encargado.html')

@app.route('/api/encargado')
def datoEncargado():
    info = db.datosEncargado()
    data={
        "ganado":info[0],
        "alimentacion":info[1],
        "alertas": info[2]
    }
    return jsonify(data)


@app.route('/encargado/ganado')
def encargadoGanado():
    return render_template('/encargado/ganadoE.html')

@app.route('/encargado/consultas', methods=["POST"])
def tablas():
    if not request.is_json:
        return jsonify({"error": "La solicitud debe ser de tipo JSON"}), 400  # Respuesta en caso de que no sea JSON

    dato = request.json
    info = db.consulta(dato.get('name'))
    
    # Si la consulta no devuelve datos, maneja ese caso
    if not info:
        return jsonify({"error": "No se encontraron datos"}), 404
    
    return jsonify(info)

@app.route('/encargado/consultasvinculacion', methods=['POST'])
def consultarVinculacion():
    if not request.is_json:
        return jsonify({"error": "La solicitud debe ser de tipo JSON"}), 400  # Respuesta en caso de que no sea JSON

    dato = request.get_json()
    print(dato)
    id_ganado = dato.get('id')  # Extraemos el id del ganado enviado en la solicitud

    # Llamar a la función que consulta la base de datos
    info = db.consultar_alimentacion_ganado(id_ganado)

    # Si la consulta no devuelve datos, manejamos ese caso
    if not info:
        return jsonify({"error": "No se encontraron datos"}), 404
    
    # Si se encontraron datos, los devolvemos en formato JSON
    return jsonify(info)

@app.route('/encargado/consultaestado')
def consultaEstadoAgua():

    # Llamar a la función que consulta la base de datos
    info = db.consultar_estado()
    print(info)
    # Si la consulta no devuelve datos, manejamos ese caso
    if not info:
        return jsonify({"error": "No se encontraron datos"}), 404
    
    # Si se encontraron datos, los devolvemos en formato JSON
    return jsonify(info)


@app.route('/encargado/registro', methods=["POST"])
def registros():
    try:
        # Usar el método correcto para obtener el JSON
        dato = request.get_json()
        print(dato)
        
        # Llamada a la función que maneja la inserción en la base de datos
        db.registroencargado(dato.get('tabla'), dato.get('tipo'), dato.get('cantidad'), dato.get('frecuencia'), dato.get('fecha'), dato.get('id_usuario'))

        # Devolver una respuesta adecuada
        return jsonify({'success': True, 'message': ' registrado con éxito'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error al registrar', 'error': str(e)}), 500


@app.route('/encargado/actualizar', methods=['PUT'])
def modificar():
    try:    
        dato = request.get_json()
        print('Datos recibidos en el servidor:', dato)  # Depuración
        info = db.actualizacionencargado(
            dato.get('tabla'),
            dato.get('nuevoTipo'),
            dato.get('nuevaCantidad'),
            dato.get('nuevaFrecuencia'),
            dato.get('id')
        )

        # Asegúrate de que `info` contenga lo que quieres devolver.
        if info.get('success'):
            return jsonify(info)  # Devuelve la respuesta de `actualizacionencargado()`
        else:
            return jsonify({'success': False, 'message': 'No se pudo actualizar el registro'}), 400

    except Exception as e:
        print('Error al actualizar:', str(e))  # Imprimir el error para depuración
        return jsonify({'success': False, 'message': 'Error al actualizar', 'error': str(e)}), 500



@app.route('/encargado/alimentacion')
def encargadoAlimentacion():
    return render_template('/encargado/alimentacionE.html')

@app.route('/encargado/alimentaciongrupo')
def encargadoAlimentacionGrupo():
    return render_template('/encargado/alimentacionGrupoE.html')

@app.route('/encargado/alertas')
def alertas():
    return render_template('/encargado/alertasAguaE.html')

@app.route('/encargado/alertascambio', methods=['POST'])
def cambioAlertas():
    try:
        dato= request.get_json()
        info= db.cambioAlerta(dato.get('idAlerta'),dato.get('estado'))
        if info.get('success'):
                return jsonify(info)  # Devuelve la respuesta de `actualizacionencargado()`
        else:
                return jsonify({'success': False, 'message': 'No se pudo actualizar el registro'}), 400
    except Exception as e:   
        print('Error al actualizar:', str(e))  # Imprimir el error para depuración
        return jsonify({'success': False, 'message': 'Error al actualizar', 'error': str(e)}), 500

#Datos del ganadero e informacion de este mismo
#numeros de sesiones del encargados
@app.route('/ganadero')
def pagenaca():
    return render_template('Ganadero.html')

@app.route('/ganadero/ganado')
def ganaderoganado():
    return render_template('/Ganadero/ganado.html')

@app.route('/ganadero/alimentacion')
def ganaderoalimentacion():
    return render_template('/Ganadero/alimentacion.html')

@app.route('/ganadero/alimentaciongrupo')
def ganaderoalimentaciongrupo():
    return render_template('/Ganadero/alimentacionGrupo.html')

@app.route('/ganadero/alertas')
def ganaderoalertas():
    return render_template('/Ganadero/alertasAgua.html')
    
if __name__ == '__main__':
    app.run(debug=True)


