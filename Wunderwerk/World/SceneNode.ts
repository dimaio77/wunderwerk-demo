///<reference path='./../Containers/Map.ts' />

module Wunderwerk {

    class NodeMap extends HashMap<SceneNode> {

        constructor(private m_parent: null | SceneNode) {
            super();
        }

        clear(): boolean {
            super.each((key: string, node: SceneNode) => {
                node.parent = null;
            });

            super.clear();

            return true;
        }

        add(key: string, node: SceneNode): boolean {
            if (super.add(key, node)) {
                node.parent = this.m_parent;

                return true;
            }

            return false;
        }

        replace(key: string, node: SceneNode): null | SceneNode {
            let replacedNode = super.replace(key, node);

            if (replacedNode !== null) {
                replacedNode.parent = null;
            }

            node.parent = this.m_parent;

            return replacedNode;
        }

        remove(node: SceneNode): boolean {
            if (super.remove(node)) {
                node.parent = null;

                return true;
            }

            return false;
        }

        removeAt(key: string): null | SceneNode {
            let node = super.removeAt(key);

            if (node) {
                node.parent = null;

                return node;
            }

            return null;
        }

    }

    /**
    * Representation of a single node in a scene graph.
    */

    export class SceneNode {

        private m_parent: null | SceneNode;

        private m_nodes: HashMap<SceneNode>;

        /**
         * Constructor.
         * @param {boolean} m_active: true to set the node initially active, false to set it inactive.
         */

        constructor(private m_active = true) {
            this.m_parent = null;

            this.m_nodes = new NodeMap(this);
        }

        /**
         * Returns a reference to the node's children.
         * @return {HashMap<SceneNode>} The node's children.
         */

        get nodes(): HashMap<SceneNode> {
            return this.m_nodes;
        }

        /**
         * Recursively checks whether the node and all of its parent nodes are active.
         * @return {boolean} True if the node and all of its parent nodes are active, false otherwise.
         */

        get active(): boolean {
            if (!this.m_active)
                return false;

            let node: null | SceneNode = this;

            while (node = node.parent) {
                if (!node.active)
                    return false;
            }

            return true;
        }

        /**
         * Activates or deactivates the node.
         * @param {boolean} active
         */

        set active(active: boolean) {
            this.m_active = active;
        }

        /**
         * Returns a reference to the parent node (or null if the node is not attached).
         * @return {null | SceneNode} The parent node.
         */

        get parent(): null | SceneNode {
            return this.m_parent;
        }

        /**
         * Manually sets the parent node. Call this.detach() or parent.add() instead!
         * @param {null | SceneNode} parent: New parent node.
         */

        set parent(parent: null | SceneNode) {
            this.m_parent = parent;
        }

        /**
         * Returns a reference to the root node (or a reference to itself if it is not attached to any node).
         * @return {SceneNode} The root node.
         */

        get root(): SceneNode {
            let root: SceneNode = this;
            let parent: null | SceneNode = null;

            while (true) {
                parent = root.parent;

                if (!parent)
                    return root;

                root = parent;
            }
        }

        /**
         * Detaches the scene node from its parent (if any).
         * @return {boolean} True if sucessfully detached, false otherwise.
         */

        detach(): boolean {
            if (this.m_parent !== null) {
                if (this.m_parent.nodes.remove(this)) {
                    return true;
                }

                return false;
            }

            return true;
        }

    }

}