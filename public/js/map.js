import { Form } from './form.class.js';
import { Map } from './map.class.js';

function initMap() {
    
    // Define as opções do mapa
    let options = {
        map: { 
            center: { lat: -25.4284, lng: -49.2733 },
            zoom: 19,
            mapTypeId: 'satellite'
        },
        design : {
            fillColor: "#F7B72D",
            fillOpacity: 0.75,
            strokeColor: "#F7B72D",
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1,
        },
        modes : ['polygon', 'rectangle'],
        form : {
            title : 'Informações do lote'
        }
    }

    // Objeto com o JSON dos shapes a serem recarregados
    let shapes = JSON.parse(localStorage.getItem("map")) || [];

    // Cria uma nova instância da classe Map
    let map = new Map

    // Define o ID do mapa como "map"
    map.setId('map')

    // Define as opções do mapa criado anteriormente
    map.setOptions(options)

    // Define as shapes (formas) do mapa
    map.setShapes(shapes)

    map.field().add('code','Código')
    map.field().add('area','Área')
    map.field().add('cost','Preço')

    map.render()
    

}
/*
function initMap() {

    // Crie um array para armazenar os shapes desenhados
    let shapes = JSON.parse(localStorage.getItem("map")) || [];

    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -25.4284, lng: -49.2733 },
        zoom: 19,
        mapTypeId: 'satellite'
    });

    const design = {
        fillColor: "#F7B72D",
        fillOpacity: 0.75,
        strokeColor: "#F7B72D",
        strokeWeight: 3,
        clickable: true,
        editable: true,
        zIndex: 1,
    }

    const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['polygon', 'rectangle']
        },

        polygonOptions: design,
        rectangleOptions: design,
    });

    // Adicione um listener para o evento 'overlaycomplete' para obter informações do shape
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
        let shape = event.overlay;
        // Adicione o shape ao mapa
        shape.setMap(map);

        // Peça ao usuário para inserir informações sobre o shape
        let codigo = prompt("Insira o código do shape:");
        let area = prompt("Insira a área do shape:");
        let preco = prompt("Insira o preço do shape:");

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
        shapes.push(shapeInfo);

        // Adicione um listener para o evento 'click' para exibir as informações do shape no console
        google.maps.event.addListener(shape, 'click', function () {
            console.log("Tipo de Shape: ", shapeInfo.type);
            console.log("Código: ", shapeInfo.codigo);
            console.log("Área: ", shapeInfo.area);
            console.log("Preço: ", shapeInfo.preco);
        });

        // Salve o array de shapes no localStorage com o nome "map"
        localStorage.setItem("map", JSON.stringify(shapes));
    });

    reloadMap(shapes, map, design);

    drawingManager.setMap(map);
}
*/

window.initMap = initMap;
