import * as BABYLON from '@babylonjs/core';

export type context = {
    fontData: BABYLON.IFontData
}

export type cleanCallback = () => Promise<void>;
export interface State {
    loadState: (scene: BABYLON.Scene, ctx: context) => Promise<void>;
    cleanState: (scene: BABYLON.Scene, ctx: context) => Promise<void>;
}


export class StateManager {
    private initialState: State
    private currentState: State
    private nextState: State
    private stateChange: boolean = false;
    private scene: BABYLON.Scene
    private ctx: context
    private isChangingState = false;

    constructor(initialState: State, scene: BABYLON.Scene, ctx: context) {
        this.initialState = initialState;
        this.currentState = initialState;
        this.nextState = initialState;
        this.scene = scene;
        this.ctx = ctx;
    }


    public start(): void {
        this.initialState.loadState(this.scene, this.ctx)
    }

    public requestChange(newState: State): boolean {
        if (this.stateChange || this.isChangingState) {
            return false;
        }
        this.nextState = newState;
        this.stateChange = true;
        return true;
    }


    public changeIfRequested(): void {
        if (this.stateChange && !this.isChangingState) {
            this.isChangingState = true;

            this.currentState.cleanState(this.scene, this.ctx).then(async () => {
                console.log("fin de estado terminado");
                console.log("iniciado nuevo estado");
                await this.nextState.loadState(this.scene, this.ctx);
                this.isChangingState = false;
                this.currentState = this.nextState;
                this.stateChange = false;
            })
        }
    }

}
