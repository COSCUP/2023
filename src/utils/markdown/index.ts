// Copyright (c) 2020 DevilTea
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default async function markdown (content: string) {
  const { default: render } = await import(
    /* webpackChunkName: "markdown" */
    /* webpackPreload: true */
    '@/utils/markdown/render')
  return render(content)
}
