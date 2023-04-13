<?php 
/**
 * Arquivo de exibição do mapa
 *
 * Este arquivo exibe um mapa usando a API do Google Maps.
 * Ele inclui folhas de estilo e scripts necessários para a exibição do mapa.
 *
 *
 * @package Map
 */
?>

<!-- Cria um elemento de mapa -->
<div id="map" class="map"></div>

<!-- Inclui a folha de estilo do mapa -->
<link rel="stylesheet" href="../public/css/map.css">

<!-- Inclui a biblioteca Polyfill para garantir compatibilidade com navegadores antigos -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>

<!-- Inclui o arquivo de funções JS -->
<script src="../public/js/functions.js"></script>

<!-- Inclui o arquivo de script do mapa -->
<script src="../public/js/map.js"></script>

<!-- Inclui a API do Google Maps com a chave de API do usuário -->
<script src="https://maps.googleapis.com/maps/api/js?key=<?php echo $this->key ?>&callback=initMap&libraries=drawing&v=weekly" defer></script>