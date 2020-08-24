/**
 * Mainnet Cash
 * \"A developer friendly bitcoin cash wallet api  This API is currently in active development, breaking changes may \\nbe made prior to release of version\\ \\ 1.\\n\\n**Important:** modifying this library to prematurely operate on mainnet\\n\\ \\ may result in loss of funds\\n\"
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: hello@mainnet.cash
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import localVarRequest = require("request");
import http = require("http");

/* tslint:disable:no-unused-locals */
import { SendRequest } from "../model/sendRequest";
import { SendResponse } from "../model/sendResponse";

import {
  ObjectSerializer,
  Authentication,
  VoidAuth,
  Interceptor,
} from "../model/models";

import { HttpError, RequestFile } from "./apis";

let defaultBasePath = "http://localhost:3000/v1";

// ===============================================
// This file is autogenerated - Please do not edit
// ===============================================

export enum SendApiApiKeys {}

export class SendApi {
  protected _basePath = defaultBasePath;
  protected _defaultHeaders: any = {};
  protected _useQuerystring: boolean = false;

  protected authentications = {
    default: <Authentication>new VoidAuth(),
  };

  protected interceptors: Interceptor[] = [];

  constructor(basePath?: string);
  constructor(
    basePathOrUsername: string,
    password?: string,
    basePath?: string
  ) {
    if (password) {
      if (basePath) {
        this.basePath = basePath;
      }
    } else {
      if (basePathOrUsername) {
        this.basePath = basePathOrUsername;
      }
    }
  }

  set useQuerystring(value: boolean) {
    this._useQuerystring = value;
  }

  set basePath(basePath: string) {
    this._basePath = basePath;
  }

  set defaultHeaders(defaultHeaders: any) {
    this._defaultHeaders = defaultHeaders;
  }

  get defaultHeaders() {
    return this._defaultHeaders;
  }

  get basePath() {
    return this._basePath;
  }

  public setDefaultAuthentication(auth: Authentication) {
    this.authentications.default = auth;
  }

  public setApiKey(key: SendApiApiKeys, value: string) {
    (this.authentications as any)[SendApiApiKeys[key]].apiKey = value;
  }

  public addInterceptor(interceptor: Interceptor) {
    this.interceptors.push(interceptor);
  }

  /**
   *
   * @summary Send some amount to a given address
   * @param body place a send request
   */
  public async sendRequest(
    body: SendRequest,
    options: { headers: { [name: string]: string } } = { headers: {} }
  ): Promise<{ response: http.IncomingMessage; body: SendResponse }> {
    const localVarPath = this.basePath + "/send";
    let localVarQueryParameters: any = {};
    let localVarHeaderParams: any = (<any>Object).assign(
      {},
      this._defaultHeaders
    );
    const produces = ["application/json"];
    // give precedence to 'application/json'
    if (produces.indexOf("application/json") >= 0) {
      localVarHeaderParams.Accept = "application/json";
    } else {
      localVarHeaderParams.Accept = produces.join(",");
    }
    let localVarFormParams: any = {};

    // verify required parameter 'body' is not null or undefined
    if (body === null || body === undefined) {
      throw new Error(
        "Required parameter body was null or undefined when calling sendRequest."
      );
    }

    (<any>Object).assign(localVarHeaderParams, options.headers);

    let localVarUseFormData = false;

    let localVarRequestOptions: localVarRequest.Options = {
      method: "POST",
      qs: localVarQueryParameters,
      headers: localVarHeaderParams,
      uri: localVarPath,
      useQuerystring: this._useQuerystring,
      json: true,
      body: ObjectSerializer.serialize(body, "SendRequest"),
    };

    let authenticationPromise = Promise.resolve();
    authenticationPromise = authenticationPromise.then(() =>
      this.authentications.default.applyToRequest(localVarRequestOptions)
    );

    let interceptorPromise = authenticationPromise;
    for (const interceptor of this.interceptors) {
      interceptorPromise = interceptorPromise.then(() =>
        interceptor(localVarRequestOptions)
      );
    }

    return interceptorPromise.then(() => {
      if (Object.keys(localVarFormParams).length) {
        if (localVarUseFormData) {
          (<any>localVarRequestOptions).formData = localVarFormParams;
        } else {
          localVarRequestOptions.form = localVarFormParams;
        }
      }
      return new Promise<{
        response: http.IncomingMessage;
        body: SendResponse;
      }>((resolve, reject) => {
        localVarRequest(localVarRequestOptions, (error, response, body) => {
          if (error) {
            reject(error);
          } else {
            body = ObjectSerializer.deserialize(body, "SendResponse");
            if (
              response.statusCode &&
              response.statusCode >= 200 &&
              response.statusCode <= 299
            ) {
              resolve({ response: response, body: body });
            } else {
              reject(new HttpError(response, body, response.statusCode));
            }
          }
        });
      });
    });
  }
}
