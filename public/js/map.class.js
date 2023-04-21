import { Form } from "./form.class.js";

/**
 * Classe que representa um objeto Mapa.
 * @class
 */
class Map {

    id      = 'map'
    formId  = 'gm-drawing'

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
            id: '',
            title : ''
        }

        this.formId = this.getFormId()

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

    setFormId(id) {
        this.formId = id
    }

    getForm() {
        const form = document.getElementById(this.getFormId())
        return form
    }

    getFormId() {
        return this.formId
    }

    shape() {
        const self = this
        const inputs = self.getForm().querySelectorAll('[name]')
    
        return {
            add(shape) {

                inputs.forEach(input => {
                    shape[input.name] = input.value
                });

                self.shapes.push(shape)
                self.update()   
        
            },
            update(shape) {

                let code

                inputs.forEach(input => {
                    shape[input.name] = input.value
                    code = input.value
                });

                self.shapes.forEach((element, key) => {
                    if(element.code == code) {
                        self.shapes[key] = shape
                    }
                });

                self.update()

            },
            remove(shape) {

                let code = shape.stored.code
                
                if (confirm('Tem certeza que deseja remover a área '+ code +' ?')) {
                    self.shapes.forEach((element, key) => {
                        if(element.code == code) {
                            self.shapes.pop(key)
                        }
                    });
    
                    self.update()
                    shape.setMap(null);
                } 
                
            },
            get(code) {
                return self.shapes[code]
            },
            getAll() {
                return self.shapes
            },
        }
    }

    update() {
        localStorage.setItem("map", JSON.stringify(this.shapes));
    }

    loadMap() {

        let self    = this;

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
                let remove  = document.getElementById("cancel")

                // Preenche os campos do formulário
                fields.forEach((field) => {
                    field.value = shape.stored[field.name];
                });

                // Exibe o formulário
                gmForm.classList.add('visible')

                // Salva as alterações
                save.onclick = () => {
                    self.shape().update(shape.stored)
                }

                // remove o shape
                remove.onclick = () => {
                    self.shape().remove(shape)
                }

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
            const remove = document.getElementById("cancel")
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

            // Salva as alterações
            save.onclick = () => {
                parent.shape().add(shape.stored)
            }
            
            parent.clear(gmForm)
            

            // Adicione um listener para o evento 'click' para exibir as informações do shape no console
            google.maps.event.addListener(shape, 'click', function () {

                let fields  = parent.getForm().querySelectorAll('[name]')

                // Preenche os campos do formulário
                fields.forEach((field) => {
                    field.value = shape.stored[field.name];
                });

                // Exibe o formulário
                gmForm.classList.add('visible')

                save.onclick = () => {
                    parent.shape().update(shape.stored)
                }

                remove.onclick = () => {
                    parent.shape().remove(shape)
                }

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

    formUpdate(shape) {
  
        const self    = this
        const savebtn = document.getElementById('save')
        const primary = Object.keys( self.fields )[0]

        savebtn.addEventListener("click", function() {

            let create = true
            let update = false;
            let shapes = self.shapes
            let inputs = self.getForm().querySelectorAll('[name]')
            
            shapes.forEach((element, key) => {
                update = false
                inputs.forEach(input => {
                    if(input.value == element.code && input.name == primary) {
                        update = true
                        create = false
                    }

                    if(update) {
                        shape[input.name] = input.value
                    }
                });

                if(update) {
                    shapes.push(shape)
                }

               // element.code == inputs[element.name]
            });

            if(create) {
                inputs.forEach(element => {
                    shape[element.name] = element.value
                });

                shapes.push(shape)
            }

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

    setCenter() {
        
    }

}

export { Map };