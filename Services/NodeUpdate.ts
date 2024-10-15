export class NodeUpdate {
    public static hasChanged(node1: Node, node2: Node) {
        if (node1.nodeType !== node2.nodeType) return true;
        if (node1.nodeName !== node2.nodeName) return true;
        return node1.nodeType == Node.TEXT_NODE && node1.textContent !== node2.textContent;
    }

    public static updateAttributes(oldNode: Element, newNode: Element) {
        const attrToRm = oldNode.getAttributeNames().filter((attr) => newNode.getAttributeNames().indexOf(attr) === -1);
        attrToRm.forEach((attr) => oldNode.removeAttribute(attr));

        for (let i = 0; i < newNode.attributes.length; ++i) {
            if (
                !oldNode.hasAttribute(newNode.attributes[i].name) ||
                oldNode.getAttribute(newNode.attributes[i].name) != newNode.attributes[i].value
            ) {
                oldNode.setAttribute(newNode.attributes[i].name, newNode.attributes[i].value);
            }
        }
    }

    public static updateChildren(oldNode: Node, newNode: Node) {
        const newNodeLength = newNode.childNodes.length;
        const oldNodeLength = oldNode.childNodes.length;
        const maxLength = Math.max(newNodeLength, oldNodeLength);
        for (let i = 0; i < maxLength; i++) {
            if (i >= oldNodeLength) {
                try {
                    oldNode.appendChild(newNode.childNodes[i].cloneNode(true));
                } catch (e) {
                    console.log(e);
                }
            } else if (i >= newNodeLength) {
                oldNode.removeChild(oldNode.childNodes[newNodeLength]);
            } else {
                const oldChild = oldNode.childNodes[i];
                const newChild = newNode.childNodes[i];
                if (NodeUpdate.hasChanged(oldChild, newChild)) {
                    oldNode.replaceChild(newChild.cloneNode(true), oldChild);
                } else {
                    NodeUpdate.updateChildren(oldChild, newChild);

                    if (oldChild instanceof HTMLElement && newChild instanceof HTMLElement) {
                        NodeUpdate.updateAttributes(oldChild, newChild);
                    }
                }
            }
        }
    }

    public static updateDiv(id: string, html: string) {
        const oldDiv = document.getElementById(id);
        if (oldDiv != null) {
            const newDiv = document.createElement('div');
            newDiv.innerHTML = html;
            NodeUpdate.updateChildren(oldDiv, newDiv);
        }
    }
}
