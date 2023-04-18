function reloadMap(shapes, map, design) {
    if (shapes && shapes.length > 0) {
        shapes.forEach(function (shapeInfo) {
            let shape;

            if (shapeInfo.type === "rectangle") {
                shape = new google.maps.Rectangle({
                    bounds: shapeInfo.bounds,
                });
            } else if (shapeInfo.type === "polygon") {
                shape = new google.maps.Polygon({
                    paths: shapeInfo.points,
                });

                shape.getPaths().forEach(function (path, index) {
                    google.maps.event.addListener(path, 'set_at', function () {
                        console.log('Pontos alterados')
                    });
                });
            }

            shape.setOptions(design);


            google.maps.event.addListener(shape, 'click', function () {
                console.log("Tipo de Shape: ", shapeInfo.type);
                console.log("Código: ", shapeInfo.codigo);
                console.log("Área: ", shapeInfo.area);
                console.log("Preço: ", shapeInfo.preco);
            });

            google.maps.event.addListener(shape, 'bounds_changed', function () {
                console.log("Retângulo redimensionado.");
            });

            shape.setMap(map);
        });
    }
}