import joint from 'jointjs';
import ToolDefinitions from './ToolDefinitions';

const THREAT_SOURCES_TYPES = new Set(['human_threat_non_malicious', 'human_threat_malicious', 'non_human_threat']);
const RESIZE_ELEMENTS = new Set(['threat_scenario', 'unwanted_incident']);
const ELEMENT_TEXT_LINE_THRESHOLD = 25;

function formatElement(text) {
    let length = 0;
    let formattedText = "";
    let lines = 1;
    let maxLength = 0;

    for (const word of text.split(" ")) {
        formattedText += (length == 0 ? "" : " ") + word;
        length += word.length;
        if (length > ELEMENT_TEXT_LINE_THRESHOLD) {
            formattedText += "\n";
            lines += 1;
            maxLength = (length > maxLength) ? length : maxLength;
            length = 0;
        }
    }

    return { 
        text: formattedText, 
        elementWidth: Math.floor(maxLength * 3.5), 
        elementHeight: lines * 10 
    };
}

function createElementFromDAG(type, id, label, posX, posY) {
    if (type == "asset" || type == "impacted_asset") {
        type = "direct_asset";
    } else if (type == "non_human_threat") {
        type = "threat_non_human";
    } 
    
    // console.log("Looking for svg of " + type); 
    const svg = ToolDefinitions.find(tool => tool.id === type);
    if (svg == undefined) {
        console.log("Crashed on type: " + type);
    }
    const shape = svg.shapeFn();
    // console.log(`SVG `, svg)

    if (svg.attrs) {
        Object.keys(svg.attrs).map((key, index) => shape.attr(key, svg.attrs[key]));
    }
    
    const formatted = formatElement(label);
    const styles = svg.perspectives[0];
    //console.log(`STYLES `, styles)
    Object.keys(styles).forEach((ref) => shape.attr(ref, styles[ref]));
    //shape.attr("text/text", svg.text);
    shape.attr("text/text", formatted.text);
    shape.attr("value/text", "");
    //shape.set('perspective', currentPerspective); // Unsure if needed
    shape.set('perspectives', svg.perspectives);
    shape.set('role', svg.role);
    shape.set('id', id);
    shape.set('valueType', svg.valueType); //maybe store info outside svg object instead?
    // a bit careful with these, some assumptions are made
    // set custom fill color in ellipse and rect
    if (svg.indicatorType) {
        shape.set('indicatorType', svg.indicatorType);
        shape.set('indicatorValue', 2); //sets indicator value to 1.0 by default
        shape.attr("body/fill", indicatorTypes[svg.indicatorType]);
        shape.attr("innerBody/fill", indicatorTypes[svg.indicatorType]);
    }
    // set magnet attribute, only used for vulnerabilities now.
    if (svg.magnet) {
        shape.attr("linkHandler/magnet", svg.magnet);
    }

    if (RESIZE_ELEMENTS.has(type)) {
        shape.resize(svg.width + formatted.elementWidth, svg.height + formatted.elementHeight);
    } else {
        shape.resize(svg.width || 100, svg.height || 60);
    }
    
    shape.position(posX, posY);
    return shape;
}

function existingNode(node, existingNodes) {
    for (const existing of existingNodes) {
        if (existing.type !== node.type) {
            continue;
        } 
        if (existing.text !== node.text) {
            continue;
        }
        return existing;
    }
    return null;
}

function contentWithoutDuplicates(content) {
    let prunedContent = {
        vertices: [],
        edges: []
    };
    // Map of nodes (id -> node) for quick lookup
    let allNodes = new Map();
    for (const node of content.vertices) {
        allNodes.set(node.id, node);
    }
    // Unique nodes
    let prunedNodes = new Map();

    // Copy all unique vertices
    for (let node of content.vertices) {
        if (existingNode(node, prunedContent.vertices) == null) {
            prunedContent.vertices.push(node);
            prunedNodes.set(node.id, node);
        }
    }
    // Copy edges and replace with new ids
    for (let edge of content.edges) {
        if (!prunedNodes.has(edge.source)) {
            const originalNode = allNodes.get(edge.source);
            const newNode = existingNode(originalNode, prunedContent.vertices);
            edge.source = newNode.id;
        }
        if (!prunedNodes.has(edge.target)) {
            const originalNode = allNodes.get(edge.target);
            const newNode = existingNode(originalNode, prunedContent.vertices);
            edge.target = newNode.id;
        }
        prunedContent.edges.push(edge);
    }

    return prunedContent;
}

export function createGraphFromDAG(content) {
    // Create a new JointJS graph from the DAG content using iterative layout.
    const graph = new joint.dia.Graph(); //stupid hack
    if (!content.hasOwnProperty("vertices") || !content.hasOwnProperty("edges")) {
        return graph;
    }
    // Log occupied positions on the canvas
    const occupiedPositions = {};

    // Content with unique nodes (the LLM can generate multiple times the same element)
    content = contentWithoutDuplicates(content);
    console.log("Content with unique nodes: ", content);

    // Create a map for quick node lookup.
    const nodeMap = {};
    content.vertices.forEach(node => {
        nodeMap[node.id] = node;
    });
    const nodePositions = {};

    // Build mapping for outgoing edges: source id -> array of target ids.
    const outgoing = {};
    content.edges.forEach(edge => {
        if (!outgoing[edge.source]) {
            outgoing[edge.source] = [];
        }
        outgoing[edge.source].push(edge.target);
    });
    console.log("Outgoing", outgoing);   
    // Determine levels via BFS.
    // Level 0: all threat sources placed at X = 0.
    const nodeLevels = {};
    const queue = [];
    content.vertices.forEach(node => {
        if (THREAT_SOURCES_TYPES.has(node.type)) {
            nodeLevels[node.id] = 0;
            queue.push(node.id);
        }
    });
    while (queue.length) {
        const currId = queue.shift();
        const currLevel = nodeLevels[currId];
        const targets = outgoing[currId] || [];
        targets.forEach(targetId => {
            if (nodeLevels[targetId] === undefined || nodeLevels[targetId] > currLevel + 1) {
                nodeLevels[targetId] = currLevel + 1;
                queue.push(targetId);
            }
        });
    }

    // Group nodes by level.
    const levels = {};
    Object.keys(nodeLevels).forEach(nodeId => {
        const level = nodeLevels[nodeId];
        if (!levels[level]) levels[level] = [];
        levels[level].push(nodeMap[nodeId]);
    });

    // Create elements level by level.
    // For each level, X is level * 500.
    // Y positions: nodes are spaced 400 apart and centered (middle element near y=0).
    Object.keys(levels).forEach(levelKey => {
        const level = parseInt(levelKey, 10);
        const nodesInLevel = levels[level];
        // Sort nodes to get deterministic ordering.
        nodesInLevel.sort((a, b) => a.id.localeCompare(b.id));
        const count = nodesInLevel.length;
        const yOffset = ((count - 1) / 2) * 400;
        nodesInLevel.forEach((node, index) => {
            const posX = level * 500;
            const posY = index * 400 - yOffset;
            if (node == undefined) {
                console.log("Skipped undefined node");
                return;
            }
            nodePositions[node.id] = {x: posX, y: posY};
            const element = createElementFromDAG(node.type, node.id, node.text, posX, posY);
            console.log("element", element);
            //new joint.shapes.basic.Rect({
            //    id: node.id,
            //    position: { x: posX, y: posY },
            //    size: { width: node.width || 100, height: node.height || 60 },
            //    attrs: { text: { text: node.label } }
            //});
            graph.addCell(element);
        });
    });

    // Add edges and vulnerabilities
    content.edges.forEach(edge => {
        // const link = new joint.shapes.coras.defaultLink({
        //     relation: "impacts"    
        // });

        const link = new joint.shapes.coras.defaultLink();
        link.source({ id: edge.source, magnet: "body" });
        link.target({ id: edge.target, magnet: "body" });
        graph.addCell(link);
        
        for (let v of getVulnerabilitiesProperties(edge, nodePositions)) {
            const element = createElementFromDAG("vulnerability", v.id, v.text, v.x, v.y);
            graph.addCell(element);
        }
    });

    /*
    const v1 = createElementFromDAG("vulnerability", generateUUID(), "(0, 0)", 0, 0);
    graph.addCell(v1);    
    const v2 = createElementFromDAG("vulnerability", generateUUID(), "(0, 100)", 0, 100);
    graph.addCell(v2);    
    const v3 = createElementFromDAG("vulnerability", generateUUID(), "(100, 0)", 100, 0);
    graph.addCell(v3);    
    */ 

    return graph; 
}

function getVulnerabilitiesProperties(edge, nodePositions) {
    let vulnerabilities = [];
    if (!edge.hasOwnProperty("vulnerabilities")) {
        return vulnerabilities;    
    }
    if (edge.vulnerabilities.length == 0) {
        return vulnerabilities;
    }
    
    // minimum distance between a vulnerability and an element
    const margin = 150;
    const sourcePos = nodePositions[edge.source];
    const targetPos = nodePositions[edge.target];
    if (sourcePos == undefined || targetPos == undefined) {
        console.log("Error: undefined node position when displaying vulnerability");
        return vulnerabilities;
    }

    // distance between the two elements
    const distance = Math.abs(targetPos.x - sourcePos.x);
    // distance between two vulnerabilities
    const gap = Math.max(25, distance - 2*margin) / edge.vulnerabilities.length;
    const a = (targetPos.y - sourcePos.y) / (targetPos.x - sourcePos.x);
    const b = sourcePos.y - a*(sourcePos.x);
    // x-middle point between the two elements
    const center = sourcePos.x + Math.abs(targetPos.x - sourcePos.x)/2;
   
    let i = 0;
    for (let vulnerability of edge.vulnerabilities) {
        let spacing = (Math.floor(i/2) + 1) * gap * (i%2 == 0 ? 1 : -1);
        let x = (edge.vulnerabilities.length == 1) ? center : center + spacing;

        vulnerabilities.push({
            x: x + 16,
            y: a*x + b + 21,
            text: vulnerability,
            id: `vulnerability-${generateUUID()}` 
        });
        console.log(`vulnerability at (${x}, ${a*x+b})`);
        i += 1;
    }

    // console.log("source: " + sourcePos.x, sourcePos.y + ", target: " + targetPos.x, targetPos.y);
    return vulnerabilities;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
