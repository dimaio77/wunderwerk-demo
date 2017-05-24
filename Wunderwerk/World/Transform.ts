///<reference path='./SceneNode.ts' />

///<reference path='./../Math/vec3.ts' />
///<reference path='./../Math/vec4.ts' />

///<reference path='./../Math/mat3.ts' />
///<reference path='./../Math/mat4.ts' />

///<reference path='./../Math/quat.ts' />


module Wunderwerk {

    export class Transform extends SceneNode {

        private m_scaling: vec3;
        private m_rotation: quat;
        private m_translation: vec3;

        protected m_modelMatrix: mat4;
        protected m_rotationMatrix: mat3;

        protected m_lastRotation: quat;
        protected m_lastTranslation: vec3;

        private m_absoluteTranslation: vec3;
        private m_rotationAsEulerAngles: vec3;

        protected m_updateRequired: boolean;

        constructor(active = true) {
            super(active);

            this.m_scaling = vec3.one.copy();
            this.m_rotation = quat.identity.copy();
            this.m_translation = vec3.zero.copy();

            this.m_modelMatrix = new mat4();
            this.m_rotationMatrix = new mat3();

            this.m_lastRotation = new quat();
            this.m_lastTranslation = new vec3();

            this.m_absoluteTranslation = new vec3();
            this.m_rotationAsEulerAngles = new vec3();

            this.m_updateRequired = true;
        }

        get parent(): null | Transform {
            return super.parent as Transform;
        }

        set parent(parent: null | Transform) {
            super.parent = parent;
        }

        get nodes(): HashMap<Transform> {
            return super.nodes as HashMap<Transform>;
        }

        get modelMatrix(): mat4 {
            return this.m_modelMatrix;
        }

        get rotationMatrix(): mat3 {
            return this.m_rotationMatrix;
        }

        get absoluteTranslation(): vec3 {
            return this.m_absoluteTranslation;
        }

        get rotationAsEulerAngles(): vec3 {
            return this.m_rotationAsEulerAngles;
        }

        get scaling() {
            return this.m_scaling;
        }

        set scaling(scaling: vec3) {
            scaling.copy(this.m_scaling);

            this.m_updateRequired = true;
        }

        get rotation() {
            return this.m_rotation;
        }

        set rotation(rotation: quat) {
            rotation.copy(this.m_rotation);
            rotation.copy(this.m_lastRotation);

            this.m_updateRequired = true;
        }

        get translation() {
            return this.m_translation;
        }

        set translation(translation: vec3) {
            translation.copy(this.m_translation);
            translation.copy(this.m_lastTranslation);

            this.m_updateRequired = true;
        }

        scale(scaling: vec3) {
            vec3.product(this.m_scaling, scaling, this.m_scaling);

            this.m_updateRequired = true;
        }

        rotate(rotation: quat, rotateGlobally = false) {
            if (rotateGlobally) {
                quat.product(rotation, this.m_rotation, this.m_rotation);
            } else {
                quat.product(this.m_rotation, rotation, this.m_rotation);
            }

            this.m_rotation.copy(this.m_lastRotation);

            this.m_updateRequired = true;
        }

        translate(translation: vec3, translateGlobally = false) {
            if (translateGlobally) {
                vec3.sum(this.m_translation, translation, this.m_translation);
            } else {
                let rotatedTranslation = this.m_rotation.multiplyVec3(translation);
                vec3.sum(this.m_translation, rotatedTranslation, this.m_translation);
            }

            this.m_translation.copy(this.m_lastTranslation);

            this.m_updateRequired = true;
        }

        lookAt(target: vec3) {
            mat3.lookAt(this.m_translation, target).toQuat(this.m_rotation).inverse();

            this.m_updateRequired = true;
        }

        update(deltaTime: number, forceUpdate = false): boolean {
            let updateRequired = forceUpdate || this.m_updateRequired || this.nodes.updated;

            if (updateRequired) {
                mat4.construct(this.m_rotation, this.m_translation, this.m_modelMatrix).scale(this.m_scaling);
                
                if (this.parent !== null) {
                    mat4.product(this.parent.modelMatrix, this.m_modelMatrix, this.m_modelMatrix);
                }

                this.m_modelMatrix.toMat3(this.m_rotationMatrix);

                this.m_absoluteTranslation.x = this.m_modelMatrix.at(12);
                this.m_absoluteTranslation.y = this.m_modelMatrix.at(13);
                this.m_absoluteTranslation.z = this.m_modelMatrix.at(14);

                this.m_rotationAsEulerAngles.x = this.m_rotation.pitch;
                this.m_rotationAsEulerAngles.y = this.m_rotation.yaw;
                this.m_rotationAsEulerAngles.z = this.m_rotation.roll;

                this.m_updateRequired = false;
            }

            this.nodes.each((name, transform: Transform) => {
                transform.update(deltaTime, updateRequired);
            });

            return updateRequired;
        }

    }

    export namespace Transform {

        export const origin = new Transform();

    }

}