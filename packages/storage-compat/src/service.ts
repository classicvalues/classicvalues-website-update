/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as types from '@firebase/storage-types';
import { FirebaseApp } from '@firebase/app-types';

import {
  ref,
  connectStorageEmulator,
  FirebaseStorage,
  _Location,
  _invalidArgument,
  _FirebaseStorageImpl
} from '@firebase/storage';
import { ReferenceCompat } from './reference';
import { Compat, EmulatorMockTokenOptions } from '@firebase/util';

/**
 * A service that provides firebaseStorage.Reference instances.
 * @param opt_url gs:// url to a custom Storage Bucket
 */
export class StorageServiceCompat
  implements types.FirebaseStorage, Compat<FirebaseStorage>
{
  constructor(public app: FirebaseApp, readonly _delegate: FirebaseStorage) {}

  get maxOperationRetryTime(): number {
    return this._delegate.maxOperationRetryTime;
  }

  get maxUploadRetryTime(): number {
    return this._delegate.maxUploadRetryTime;
  }

  /**
   * Returns a firebaseStorage.Reference for the given path in the default
   * bucket.
   */
  ref(path?: string): types.Reference {
    if (isUrl(path)) {
      throw _invalidArgument(
        'ref() expected a child path but got a URL, use refFromURL instead.'
      );
    }
    return new ReferenceCompat(ref(this._delegate, path), this);
  }

  /**
   * Returns a firebaseStorage.Reference object for the given absolute URL,
   * which must be a gs:// or http[s]:// URL.
   */
  refFromURL(url: string): types.Reference {
    if (!isUrl(url)) {
      throw _invalidArgument(
        'refFromURL() expected a full URL but got a child path, use ref() instead.'
      );
    }
    try {
      _Location.makeFromUrl(url, (this._delegate as _FirebaseStorageImpl).host);
    } catch (e) {
      throw _invalidArgument(
        'refFromUrl() expected a valid full URL but got an invalid one.'
      );
    }
    return new ReferenceCompat(ref(this._delegate, url), this);
  }

  setMaxUploadRetryTime(time: number): void {
    this._delegate.maxUploadRetryTime = time;
  }

  setMaxOperationRetryTime(time: number): void {
    this._delegate.maxOperationRetryTime = time;
  }

  useEmulator(
    host: string,
    port: number,
    options: {
      mockUserToken?: EmulatorMockTokenOptions | string;
    } = {}
  ): void {
    connectStorageEmulator(this._delegate, host, port, options);
  }
}

function isUrl(path?: string): boolean {
  return /^[A-Za-z]+:\/\//.test(path as string);
}
