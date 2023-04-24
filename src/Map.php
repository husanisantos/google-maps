<?php
namespace HusaniSantos\GoogleMaps;

class Map {
    private $key;
    private $type;
    private $id;

    public function getKey()
    {
        return $this->key;
    }

    public function setKey($key): self
    {
        $this->key = $key;

        return $this;
    }

    public function getType()
    {
        return $this->type;
    }

    public function setType($type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setId($id = 'map'): self
    {
        $this->id = $id;

        return $this;
    }

    public function render()
    {
        require __DIR__ . '/../views/map.php';
    }
}