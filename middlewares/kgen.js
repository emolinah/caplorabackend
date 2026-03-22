console.log('Hola, estos son los parámetros que me pasaste:', process.argv);


//createModelsFile();
`
import 'package:flutter/material.dart';
import 'package:raab_admin/kplugin/components/dialog.dart';
import 'package:raab_admin/proyect/supervisor/instalacion_create.dart';
import 'package:raab_admin/proyect/supervisor/instalacion_edit.dart';
import '../../client/clientData.dart';
import '../../client/theme.dart';
import '../../kplugin/components/container.dart';
import '../../kplugin/components/table.dart';
import '../../kplugin/request.dart';

class PageEtapaInstalacionIndex extends StatefulWidget {
  const PageEtapaInstalacionIndex({super.key, required this.etapaID});
  
  final int etapaID;
  @override
  State<PageEtapaInstalacionIndex> createState() => _PageEtapaInstalacionIndexState();
}

class _PageEtapaInstalacionIndexState extends State<PageEtapaInstalacionIndex> {
  
  List modelList = [];
  Map filters = {};

  @override
  void initState() {
    super.initState();
    filters = {
      'etapa_id': widget.etapaID,
    };
    load();
  }
  
  void load() async {
    modelList = await KRequest.get(
      url: '\${ClientData.serverUrl}/supervisor/instalacion_index',
      urlParameters: filters
    );
    setState(() {
      
    });
  }

  @override
  Widget build(BuildContext context) {

    return KBox(
      color: UI.backgroundAlt,
      title: 'INSTALACIONES',
      icon: Icons.handyman,
      actions: [
        KButtonIcon(
          text: 'Instalacion', 
          icon: Icons.add,
          onTap: () {
            if(UI.isPortrait(context: context)){
              Navigator.push(context, ItemComponentePageRoute(builder: (context) => 
                PageInstalacionCreate(etapaID: widget.etapaID),
              )).then((value) => load());
            }
            else{
              KDialog.open(
                type: KDialogType.full,
                widget: PageInstalacionCreate(etapaID: widget.etapaID),
                context: context,
                onClose: load
              );
            }
          } 
        ),
      ],
      child: Column(
        children: [
        if(UI.isLandscape(context: context))...[
          KBox(
            child: Row(
              children: [
                Expanded(child: KTText(text: "id"),),
                Expanded(child: KTText(text: "codigo"),),
                Expanded(child: KTText(text: "estado"),),
              ],
            ),
          )
        ],
        KList(
          data: modelList, 
          template: (index, instance) => KBox(
            color: UI.background,
            child: Row(
              children: [
                Expanded(child: KTText(text: instance["id"]),),
                Expanded(child: KTText(text: instance["codigo"]),),
                Expanded(child: KBButton(
                    theme: UITheme(
                      buttonBackground: Colors.transparent,
                      buttonBorder: colorEstado(instance['estado']),
                      buttonText: colorEstado(instance['estado']),
                    ),
                    text: instance["estado"],
                  ),
                ),
              ],
            ),
          ),
          templateMobile: (index, instance) => KBox(
            color: UI.background,
            icon: Icons.handyman,
            title: instance["codigo"],
            subtitle: '12 dic',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                UI.divider,
                KBButton(
                  theme: UITheme(
                    buttonBackground: Colors.transparent,
                    buttonBorder: colorEstado(instance['estado']),
                    buttonText: colorEstado(instance['estado']),
                  ),
                  scale: .75,
                  text: instance["estado"],
                ),
              ],
            ),
          ),
          onTap: (instance) {
            if(UI.isPortrait(context: context)){
              Navigator.push(context, ItemComponentePageRoute(builder: (context) => 
                PageInstalacionEdit(instalacionID: instance["id"], etapaID: widget.etapaID)
              )).then((value) => load());
            }
            else{
              KDialog.open(
                type: KDialogType.full,
                widget: PageInstalacionEdit(instalacionID: instance["id"], etapaID: widget.etapaID),
                context: context,
                onClose: load
              );
            }
          },
        )
      ],
      )
    );
  }
}
`

function createModelsFile(){

    var jsonModels = {};
    var modelsDir = path.join(__dirname, '');

    fs.readdirSync(modelsDir)
    .filter(function(file) {
        return !file.endsWith('index.js') && file.match(/\.js/);
    })
    .forEach(function(file) {
        var model = require(path.join(__dirname, '', file))(sequelize, DataTypes);
        
        //json models
        jsonModels[model.name] = {}
        Object.keys(model.rawAttributes).forEach(attributeName => {
            let attribute = model.rawAttributes[attributeName];
            jsonModels[model.name][attributeName] = {
                field : attribute['field'],
                type : attribute['type']['key'],
            };
            if(attribute.hasOwnProperty('value')) jsonModels[model.name][attributeName].value = attribute['value'];
            if(attribute.hasOwnProperty('allowNull')) jsonModels[model.name][attributeName].allowNull = attribute['allowNull'];
        });
    });
    let json_models_rute = path.join(__dirname, '../config/models.json');
    //console.log(jsonModels);
    crearOActualizarArchivoJSON(json_models_rute, jsonModels);
    
}

function crearOActualizarArchivoJSON(nombreArchivo, objetoParametro) {
    try {
      // Lee el archivo JSON existente (si existe)
      let datosArchivo = {};
      if (fs.existsSync(nombreArchivo)) {
        const archivoExistente = fs.readFileSync(nombreArchivo);
        datosArchivo = JSON.parse(archivoExistente);
      }
  
      // Combina los datos existentes con el objeto parámetro
      const nuevosDatos = Object.assign(datosArchivo, objetoParametro);
      //const nuevosDatos = { ...datosArchivo, ...objetoParametro };
  
      // Convierte los datos combinados a formato JSON
      const datosJSON = JSON.stringify(nuevosDatos, null, 2);
  
      // Escribe los datos en el archivo
      fs.writeFileSync(nombreArchivo, datosJSON);
  
      console.log('Archivo JSON actualizado correctamente.');
    } catch (error) {
      console.error('Error al crear o actualizar el archivo JSON:', error);
    }
}