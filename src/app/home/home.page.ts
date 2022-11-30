import { Component, ElementRef, ViewChild } from '@angular/core';
import { EsriLoaderService } from '../esri-loader.service';

declare type EsriVectorTileLayerType = typeof import('esri/layers/VectorTileLayer');
declare type EsriMapType = typeof import('esri/map');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('map', { read: ElementRef }) mapElRef: ElementRef | undefined;

  esriMap: EsriMapType | undefined;
  esriVectorTileLayer: EsriVectorTileLayerType | undefined;

  constructor(
    private esriLoaderService: EsriLoaderService
  ) {}

  async loadMap() {
    // Using sample from https://developers.arcgis.com/javascript/3/jssamples/layers_vector.html
    this.esriLoaderService.loadCss();

    [this.esriMap, this.esriVectorTileLayer] =
      await this.esriLoaderService.loadModules([
        'esri/map',
        'esri/layers/VectorTileLayer',
      ]);

    const map = new this.esriMap!(this.mapElRef?.nativeElement, {
      center: [2.3508, 48.8567], // longitude, latitude
      zoom: 2,
    });

    //The URL referenced in the constructor may point to a style url JSON (as in this sample)
    //or directly to a vector tile service
    var vtlayer = new this.esriVectorTileLayer!(
      'https://www.arcgis.com/sharing/rest/content/items/4cf7e1fb9f254dcda9c8fbadb15cf0f8/resources/styles/root.json'
    );
    map.addLayer(vtlayer);
  }
}
