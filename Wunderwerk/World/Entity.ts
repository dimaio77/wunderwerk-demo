///<reference path='./Transform.ts' />
///<reference path='./EntityComponent.ts' />

///<reference path='./../Containers/Map.ts' />

module Wunderwerk {

    class EntityComponentMap extends HashMap<EntityComponent> {

        constructor(private m_entity: Entity) {
            super();
        }

        clear(): boolean {
            super.each((key: string, entityComponent: EntityComponent) => {
                entityComponent.transform = null;
            });

            super.clear();

            return true;
        }
        
        add(key: string, entityComponent: EntityComponent): boolean {
            if (super.add(key, entityComponent)) {
                entityComponent.transform = this.m_entity;

                return true;
            }

            return false;
        }

        replace(key: string, entityComponent: EntityComponent): null | EntityComponent {
            let replacedComponent = super.replace(key, entityComponent);

            if (replacedComponent !== null) {
                replacedComponent.transform = null;
            }

            entityComponent.transform = this.m_entity;

            return replacedComponent;
        }

        remove(entityComponent: EntityComponent): boolean {
            if (super.remove(entityComponent)) {
                entityComponent.transform = null;

                return true;
            }

            return false;
        }

        removeAt(key: string): null | EntityComponent {
            let entityComponent = super.removeAt(key);

            if (entityComponent !== null) {
                entityComponent.transform = null;

                return entityComponent;
            }

            return null;
        }

    }

    export class Entity extends Transform {

        private m_components: HashMap<EntityComponent>;

        constructor(private m_lifetime = Infinity, active = true) {
            super(active);

            this.m_components = new EntityComponentMap(this);
        }

        get lifetime() {
            return this.m_lifetime;
        }

        get expired() {
            return (this.m_lifetime !== Infinity) && (this.m_lifetime <= 0);
        }

        get components() {
            return this.m_components;
        }

        expire() {
            this.m_lifetime = 0;
        }

        update(deltaTime: number, forceUpdate = false) {
            if (this.m_lifetime !== Infinity) {
                this.m_lifetime -= deltaTime;
            }

            return super.update(deltaTime, forceUpdate);
        }
    }

}