import { create } from 'zustand'

interface IUseCanvas {
canvas: HTMLCanvasElement | null
context:CanvasRenderingContext2D | null | undefined
setCanvas:(canvas:HTMLCanvasElement | null) => void
setContext:(context:CanvasRenderingContext2D | null | undefined) => void
}

export const useCanvasStore = create<IUseCanvas>()(set => ({
canvas : null,
context:null,
setCanvas:(canvas) => set(() => ({canvas})),
setContext:(context) => set(() => ({context}))
}))