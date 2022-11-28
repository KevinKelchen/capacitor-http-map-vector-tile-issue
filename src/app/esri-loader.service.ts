import { Injectable } from '@angular/core';
import { ILoadScriptOptions, loadCss, loadModules } from 'esri-loader';

@Injectable({providedIn: 'root'})
export class EsriLoaderService {
  private readonly arcGisJSApiRoot = 'https://js.arcgis.com/3.42';

  loadCss() {
    const urls = ['esri/css/esri.css', 'dijit/themes/claro/claro.css'];
    urls.map((url) =>
      loadCss(`${this.arcGisJSApiRoot}/${url}`)
    );

    document.body.classList.add('claro');
  }

  loadModules(modules: string[]) {
    (window as any).dojoConfig = {
      async: true,
    };

    insertScriptWorkaround();

    const options: ILoadScriptOptions = {
      url: `${this.arcGisJSApiRoot}/init.js`,
    };

    const modulesLoadedPromise = loadModules(modules, options);
    modulesLoadedPromise.catch((e) => {
      console.error(e);
    });
    return modulesLoadedPromise;
  }
}

/**
 * Workaround for an esri 3.x issue with loading JS modules.
 *
 * The issue is a bad timing interaction between loading JS modules in the esri API
 * and loading Ionic Framework at the same time.
 *
 * Issue description: In preparation for loading JS modules, esri queries the document
 * for <script> elements and will sometimes pick up a transient Ionic Framework
 * <script> element.
 * When esri tries to later utilize the stale query results and use the Ionic Framework
 * <script> element as a reference for where to insert esri <script> elements in the
 * DOM, the Ionic Framework <script> element by that point is no longer in the DOM
 * and esri throws an error similar to:
 * "Cannot read properties of null (reading 'insertBefore')"
 * This error can not only result in the esri API failing to load but also cause the
 * rest of the app to fail to load correctly.
 *
 * Workaround description: Add our own, stable <script> element to the DOM so that esri
 * uses that element as a reference for <script> insertion rather than the transient
 * Ionic Framework element.
 *
 * @returns void
 */
const insertScriptWorkaround = () => {
  // If our workaround element has already been added to the DOM,
  // there's nothing we need to do.
  const workaroundElement = document.querySelector("[data-esri-script-workaround]");
  if (workaroundElement) return;

  // Create a <script> element with an attribute that identifies it as the
  // workaround element.
  const newScript = document.createElement("script");
  newScript.setAttribute("data-esri-script-workaround", "true");

  // Find the first <script> element within the <head> element
  // and insert our workaround script before it so that it
  // becomes the first <script> element within <head>.
  // esri should then reference our workaround element
  // instead of the transient Ionic Framework element.
  const firstScriptInHead = document.head.querySelector("script");
  document.head.insertBefore(newScript, firstScriptInHead);
};
