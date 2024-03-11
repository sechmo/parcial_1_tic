import * as BABYLON from '@babylonjs/core';

/**
 * Gets a mesh from the scene by its name, throwing an error if not found.
 * @param {BABYLON.Scene} scene - The BabylonJS scene.
 * @param {string} meshName - The name of the mesh to retrieve.
 * @returns {BABYLON.AbstractMesh} The requested mesh.
 * @throws {Error} If the mesh is not found in the scene.
 */
export function getMeshOrThrow(scene: BABYLON.Scene, meshName: string): BABYLON.AbstractMesh {
    const mesh = scene.getMeshByName(meshName);
    if (!mesh) {
        throw new Error(`Mesh "${meshName}" not found in scene.`);
    }
    return mesh;
}

/**
 * Gets a sound from the scene by its name, throwing an error if not found.
 * @param {BABYLON.Scene} scene - The BabylonJS scene.
 * @param {string} soundName - The name of the sound to retrieve.
 * @returns {BABYLON.Sound} The requested sound.
 * @throws {Error} If the sound is not found in the scene.
 */
export function getSoundOrThrow(scene: BABYLON.Scene, soundName: string): BABYLON.Sound {
    const sound = scene.getSoundByName(soundName);
    if (!sound) {
        throw new Error(`Sound "${soundName}" not found in scene.`);
    }
    return sound;
}

/**
 * Gets a material from the scene by its name, throwing an error if not found.
 * @param {BABYLON.Scene} scene - The BabylonJS scene.
 * @param {string} materialName - The name of the material to retrieve.
 * @returns {BABYLON.Material} The requested material.
 * @throws {Error} If the material is not found in the scene.
 */
export function getMaterialOrThrow(scene: BABYLON.Scene, materialName: string): BABYLON.Material {
    const material = scene.getMaterialByName(materialName);
    if (!material) {
        throw new Error(`Material "${materialName}" not found in scene.`);
    }
    return material;
}

/**
 * Gets an animation group from the scene by its name, throwing an error if not found.
 * @param {BABYLON.Scene} scene - The BabylonJS scene.
 * @param {string} animationGroupName - The name of the animation group to retrieve.
 * @returns {BABYLON.AnimationGroup} The requested animation group.
 * @throws {Error} If the animation group is not found in the scene.
 */
export function getAnimationGroupOrThrow(scene: BABYLON.Scene, animationGroupName: string): BABYLON.AnimationGroup {
    const animationGroup = scene.getAnimationGroupByName(animationGroupName);
    if (!animationGroup) {
        console.log(`Animation group "${animationGroupName}" not found in scene.`)
        throw new Error(`Animation group "${animationGroupName}" not found in scene.`);
    }

    return animationGroup;
}

/**
 * Gets a texture from the scene by its name, throwing an error if not found.
 * @param {BABYLON.Scene} scene - The BabylonJS scene.
 * @param {string} textureName - The name of the texture to retrieve.
 * @returns {BABYLON.BaseTexture} The requested texture.
 * @throws {Error} If the texture is not found in the scene.
 * @example
 * const texture = getTextureOrThrow(scene, 'myTexture');
 */

export function getTextureOrThrow(scene: BABYLON.Scene, textureName: string): BABYLON.BaseTexture {
    const texture = scene.getTextureByName(textureName);
    if (!texture) {
        throw new Error(`Texture "${textureName}" not found in scene.`);
    }
    return texture;
}