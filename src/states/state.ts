import * as BABYLON from '@babylonjs/core';

type context = {
    fontData: any
}

export interface State {
    loadState: (scene: BABYLON.Scene, ctx: context) => void;
    cleanState: (scene:BABYLON.Scene, ctx: context) => void;
}


export class StateManager {
    private initialState: State
    private currentState: State
    private nextState: State
    private stateChange: boolean = false;
    private scene: BABYLON.Scene
    private ctx: context
    
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
        if (this.stateChange) {
            return false;
        }
        this.nextState = newState;
        this.stateChange = true;
        return true;
    }


    public changeIfRequested(): void {
        if (this.stateChange) {
            this.currentState.cleanState(this.scene,this.ctx);
            this.currentState = this.nextState;
            this.currentState.loadState(this.scene,this.ctx);
            this.stateChange = false;
        }
    }



}
