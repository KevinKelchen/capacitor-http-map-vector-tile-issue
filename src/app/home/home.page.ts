import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { firstValueFrom } from "rxjs";
import { EsriLoaderService } from "../esri-loader.service";

declare type EsriProjectionType = typeof import('esri/geometry/projection');

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  esriProjection: EsriProjectionType | undefined;

  constructor(
    private httpClient: HttpClient,
    private esriLoaderService: EsriLoaderService,
  ) {}

  async loadWasm() {
    [this.esriProjection] = await this.esriLoaderService.loadModules([
      'esri/geometry/projection'
    ]);

    await this.esriProjection!.load();
  }
}
