import { Form } from "./form.class.js";

/**
 * Classe que representa um objeto Mapa.
 * @class
 */
class Map {

    /**
    * Cria um novo objeto da classe Mapa.
    * @constructor
    */
    constructor() {
        /**
         * O ID do mapa.
         * @type {string}
         */
        this.id

        /**
         * O objeto Mapa.
         * @type {object}
         */
        this.map

        /**
         * As opções do mapa.
         * @type {object}
         */
        this.options

        /**
         * As formas (shapes) do mapa.
         * @type {array}
         */
        this.shapes

        /**
         * Os modos do mapa.
         * @type {array}
         */
        this.modes

        /**
         * Os campos (fields) do mapa.
         * @type {object}
         */
        this.fields = {}

        this.form = {
            title : ''
        }
    }

    setId(id) {
        this.id = id
    }

    getId() {
        return this.id
    }

    setOptions(options = []) {
        this.options = options
    }

    getMap() {
        this.map
    }

    addShape(shape) {
        //this.shapes.push(shape)
    }

    setShapes(shapes = []) {
        this.shapes = shapes
    }

    getShapes() {
        return this.shapes
    }

    shape() {
        self = this
        return {
            add(code, json) {
                self.shapes[code] = json
            },
            get(code) {
                return self.shapes[code]
            },
            getAll() {
                return self.shapes
            }
        }
    }

    update() {
        localStorage.setItem("map", JSON.stringify(this.shapes));
    }

    loadMap() {

        let self = this;

        this.shapes.forEach(function (obj) {
            let shape;

            if (obj.type === "rectangle") {
                shape = new google.maps.Rectangle({
                    bounds: obj.bounds,
                    stored: obj
                });
            } else if (obj.type === "polygon") {
                shape = new google.maps.Polygon({
                    paths: obj.points,
                    stored: obj
                });

                shape.getPaths().forEach(function (path, index) {
                    google.maps.event.addListener(path, 'insert_at', onPathChange);
                    google.maps.event.addListener(path, 'set_at', onPathChange);

                    function onPathChange() {
                        console.log('O caminho do polígono foi alterado');
                    }
                });
            }

            google.maps.event.addListener(shape, 'click', function () {
                let gmForm  = document.getElementById('gm-drawing')
                let fields  = gmForm.querySelectorAll('[name]')

                // Preenche os campos do formulário
                fields.forEach((field) => {
                    field.value = shape.stored[field.name];
                });

                // Exibe o formulário
                gmForm.classList.add('visible')

                // Salva as alterações
                self.formUpdate(shape.stored, gmForm)

                // Limpa e fecha o formulário
                self.clear(gmForm);
            });

            google.maps.event.addListener(shape, 'bounds_changed', function () {
                console.log("Retângulo redimensionado.");
            });

            shape.setOptions(this.options.design);
            shape.setMap(this.map)

        }.bind(this));

    }

    render() {

        let parent = this

        this.map = new google.maps.Map(document.getElementById(this.id),
            this.options.map
        );

        if (this.shapes.length > 0) {
            this.loadMap()
        }

        const drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: this.options.modes
            },

            polygonOptions: this.options.design,
            rectangleOptions: this.options.design,
        });


        // Adicione um listener para o evento 'overlaycomplete' para obter informações do shape
        google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {

            const gmForm = document.getElementById('gm-drawing')
            const shape  = event.overlay;
            const save   = document.getElementById("save");
            // Adicione o shape ao mapa
            shape.setMap(this.map);

            // Exibe o formulário
            gmForm.classList.add('visible');

            let shapeInfo = {
                type: event.type,
            };
        
            for(const index in form.fields) {
                const field = gmForm.querySelector('input[name="'+index+'"]');
                shapeInfo[index] = field.value 
            }

            if (event.type == 'rectangle') {
                shapeInfo.bounds = shape.getBounds().toJSON();
            } else {
                shapeInfo.points = shape.getPath().getArray().map(function (latLng) {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            }

            shape.stored = shapeInfo

            console.log(shapeInfo)

            // Salva as alterações
            parent.formUpdate(shape.stored, gmForm)
            parent.clear(gmForm)
            

            // Adicione um listener para o evento 'click' para exibir as informações do shape no console
            google.maps.event.addListener(shape, 'click', function () {
                let gmForm  = document.getElementById('gm-drawing')
                let fields  = gmForm.querySelectorAll('[name]')

                // Preenche os campos do formulário
                fields.forEach((field) => {
                    field.value = shape.stored[field.name];
                });

                // Exibe o formulário
                gmForm.classList.add('visible')

                // Limpa e fecha o formulário
                parent.clear(gmForm)
            });

        });

        //reloadMap(shapes, map, design);

        drawingManager.setMap(this.map);

        let form = new Form(this)
        form.create()

    }

    field() {
        let self = this
        return {
            add(name, label = '') {
                self.fields[name] = label;
            },
            get(name) {
                return self.fields[name];
            },
            getAll() {
                return self.fields
            }
        };
    }

    formUpdate(form) {
  
        const self    = this
        const savebtn = document.getElementById('save')
        const primary = Object.keys( this.fields )[0]
        const mapdata = this.shapes;

        savebtn.addEventListener("click", function() {
            mapdata.forEach((element, key) => {
                if(itemkey == element[primary]) {
                    let data = form.querySelectorAll('[name]')
                    data.forEach(subdata => {
                        mapdata[key][subdata.name] = subdata.value
                    });
                }
            });

            self.shapes = mapdata
            self.update()
        }) 
    }

    clear(form) {
        const buttons = form.querySelectorAll('button')
        const fields  = form.querySelectorAll('[name]')
        buttons.forEach((button) => {
            button.addEventListener("click", function() {
                form.classList.remove('visible')
                setTimeout( () => {
                    fields.forEach((field) => {
                        field.value = ''
                    })
                }, 600)  
            })
        });
    }

}

export { Map };