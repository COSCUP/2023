// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Map as OlMap, View, Feature } from 'ol'
import Point from 'ol/geom/Point'
import { defaults } from 'ol/interaction'
import TileLayer from 'ol/layer/Tile'
import LayerVector from 'ol/layer/Vector'
import { fromLonLat } from 'ol/proj'
import OSM from 'ol/source/OSM'
import SourceVector from 'ol/source/Vector'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import IconAnchorUnits from 'ol/style/IconAnchorUnits'

import 'ol/ol.css'

export interface MapOptions {
  target: string | HTMLElement;
  center: { lng: number; lat: number };
  zoom: number;
  mapMarkers?: MapMarkerOptions[];
}

export interface MapMarkerOptions {
  name: string;
  imageSrc: string;
  position: { lng: number; lat: number };
  scale: number;
  anchor: { x: number; y: number };
}

export interface Map {
  resetView: () => void;
  destroy: (forRefresh?: boolean) => void;
}

class MapConcrete implements Map {
  private _options: MapOptions
  private _map: OlMap | null = null
  private _mapMarkerOptionsSet: { [name: string]: MapMarkerOptions } = {}

  constructor (options: MapOptions) {
    this._options = options
    this._addMapMarker(...(this._options.mapMarkers || []))
    this._map = this._createMap()
  }

  private _createMapMarker (options: MapMarkerOptions): LayerVector {
    const { name, imageSrc, position, scale, anchor } = options
    const icon = new Feature({
      name,
      geometry: new Point(fromLonLat([position.lng, position.lat]))
    })
    const iconStyle = new Style({
      image: new Icon({
        scale,
        anchor: [anchor.x, anchor.y],
        anchorXUnits: IconAnchorUnits.FRACTION,
        anchorYUnits: IconAnchorUnits.FRACTION,
        src: imageSrc
      })
    })
    icon.setStyle(iconStyle)
    return new LayerVector({
      source: new SourceVector({ features: [icon] }),
      style: iconStyle
    })
  }

  private _createMap (): OlMap {
    const mapMarkers = Object.values(this._mapMarkerOptionsSet)
      .map((mapMarkerOptions) => this._createMapMarker(mapMarkerOptions))

    return new OlMap({
      target: this._options.target,
      interactions: defaults({ mouseWheelZoom: false }),
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        ...mapMarkers
      ],
      view: new View({
        center: fromLonLat([this._options.center.lng, this._options.center.lat]),
        zoom: this._options.zoom
      })
    })
  }

  public resetView (): void {
    this._map && this._map.setView(new View({
      center: fromLonLat([this._options.center.lng, this._options.center.lat]),
      zoom: this._options.zoom
    }))
  }

  public destroy (): void {
    this._map && this._map.setTarget(undefined)
    this._map = null
    Object.keys(this._mapMarkerOptionsSet)
      .forEach((key) => delete this._mapMarkerOptionsSet[key])
  }

  public _addMapMarker (...optionsList: MapMarkerOptions[]) {
    optionsList.forEach((options) => {
      if (this._mapMarkerOptionsSet[options.name]) return
      this._mapMarkerOptionsSet[options.name] = options
    })
  }
}

export function createMap (options: MapOptions): Map {
  return new MapConcrete(options)
}
