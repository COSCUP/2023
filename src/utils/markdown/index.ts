export default async function markdown (content: string) {
  const { default: render } = await import(/* webpackChunkName: "markdown" */ '@/utils/markdown/render')
  return render(content)
}
