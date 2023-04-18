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
        console.log('Teste')
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

    loadMap() {

        this.shapes.forEach(function (obj) {
            let shape;

            if (obj.type === "rectangle") {
                shape = new google.maps.Rectangle({
                    bounds: obj.bounds,
                });
            } else if (obj.type === "polygon") {
                shape = new google.maps.Polygon({
                    paths: obj.points,
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
                console.log("Clicou");
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
            drawingMode: google.maps.drawing.OverlayType.MARKER,
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

            let shape = event.overlay;
            // Adicione o shape ao mapa
            shape.setMap(this.map);

            // Armazene as informações do shape em um objeto
            let shapeInfo = {
                type: event.type,
                codigo: codigo,
                area: area,
                preco: preco,
            };

            if (event.type == 'rectangle') {
                shapeInfo.bounds = shape.getBounds().toJSON();
            } else {
                shapeInfo.points = shape.getPath().getArray().map(function (latLng) {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                });
            }

            // Adicione o objeto shapeInfo ao array de shapes
            parent.shapes.push(shapeInfo)
            console.log(parent.shapes)

            // Adicione um listener para o evento 'click' para exibir as informações do shape no console
            google.maps.event.addListener(shape, 'click', function () {

            });

            // Salve o array de shapes no localStorage com o nome "map"
            localStorage.setItem("map", JSON.stringify(parent.shapes));
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

}

export { Map };