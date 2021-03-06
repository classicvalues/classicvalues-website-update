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

/** Converts a Base64 encoded string to a binary string. */

export function decodeBase64(encoded: string): string {
  // Note: We used to validate the base64 string here via a regular expression.
  // This was removed to improve the performance of indexing.
  return Buffer.from(encoded, 'base64').toString('binary');
}

/** Converts a binary string to a Base64 encoded string. */
export function encodeBase64(raw: string): string {
  return Buffer.from(raw, 'binary').toString('base64');
}

/** True if and only if the Base64 conversion functions are available. */
export function isBase64Available(): boolean {
  return true;
}
