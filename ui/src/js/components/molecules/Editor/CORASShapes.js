import { riskSymbol } from "./svg//CorasSymbolsBase64.js";

function AddCorasShapes(joint) {
    joint.dia.Element.define("coras.unboxedElement", {
        attrs: {
            linkHandler: {
                refWidth: "225%",
                refHeight: "100%",
                fill: "#FFF",
                fillOpacity: 0,
                refX: "-75%",
                refY: "0",
                magnet: 'true'
            },
            text: {
                text: "Asset",
                refX: "50%",
                refY: "55%",
                textAnchor: "middle",
                textVerticalAnchor: "top"
            },
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "linkHandler"
            },
            {
                tagName: "image",
                selector: "icon",
            },
            {
                tagName: "text",
                selector: "text"
            }
        ]
    });
    joint.dia.Element.define("coras.ellipseElement", {
        attrs: {
            body: {
                refCx: "50%",
                refCy: "50%",
                refRx: "50%",
                refRy: "50%",
                fill: "#fff",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refCx: "50%",
                refCy: "50%",
                refRx: "40%",
                refRy: "40%",
                fill: "#FFF"
            },
            text: {
                refX: "50%",
                refY: "50%",
                textVerticalAnchor: 'middle',
                textAnchor: 'middle'
            },
            value: {
                refX: "50%",
                refY: "70%",
                textVerticalAnchor: 'middle',
                textAnchor: 'middle'
            },
            icon: {
                refWidth: "40%",
                refHeight: "40%",
                refX: "30%",
                refY: "-25%",
            }
        }
    }, {
        markup: [
            {
                tagName: "ellipse",
                selector: "body"
            },
            {
                tagName: "ellipse",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "text",
                selector: "value"
            }
        ]
    });
    joint.dia.Element.define("coras.rectElement", {
        attrs: {
            body: {
                refX: "0",
                refY: "0",
                refWidth: "100%",
                refHeight: "100%",
                fill: "#FFF",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refX: "15%",
                refY: "15%",
                refWidth: "70%",
                refHeight: "70%",
                fill: "#FFF"
            },
            icon: {
                refWidth: "50%",
                refHeight: "50%",
                refX: "75%",
                refY: "-25%"
            },
            text: {
                refX: "50%",
                refY: "40%",
                textVerticalAnchor: "middle",
                textAnchor: "middle"
            },
            value: {
                refX: "50%",
                refY: "70%",
                textVerticalAnchor: 'middle',
                textAnchor: 'middle'
            }
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "rect",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "text",
                selector: "value"
            }
        ]
    });
    joint.dia.Element.define("coras.indicatorElement", {
        attrs: {
            body: {
                refX: "0",
                refY: "0",
                refWidth: "100%",
                refHeight: "100%",
                fill: "#FFF",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refX: "15%",
                refY: "15%",
                refWidth: "70%",
                refHeight: "70%",
                fill: "#FFF"
            },
            icon: {
                refX: "90%",
                refY: "-25%"
            },
            text: {
                refX: "50%",
                refY: "40%",
                textVerticalAnchor: "middle",
                textAnchor: "middle"
            }
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "rect",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            }
        ]
    });
    joint.dia.Element.define("coras.riskElement", {
        attrs: {
            body: {
                refX: "0",
                refY: "0",
                refWidth: "100%",
                refHeight: "100%",
                fill: "#FFF",
                stroke: "#000",
                magnet: true
            },
            innerBody: {
                refX: "15%",
                refY: "15%",
                refWidth: "70%",
                refHeight: "70%",
                fill: "#FFF"
            },
            icon: {
                refWidth: "50%",
                refHeight: "50%",
                refX: "25%",
                refY: "-52%"
            },
            text: {
                refX: "50%",
                refY: "40%",
                textVerticalAnchor: "middle",
                textAnchor: "middle",
                overflow: "hidden"
            },
            value: {
                refX: "50%",
                refY: "70%",
                textVerticalAnchor: 'middle',
                textAnchor: 'middle'
            },
            sizeSelectorUL: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "1%",
                refY: "1%"
            },
            sizeSelectorUR: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "99%",
                refY: "1%"
            },
            sizeSelectorLL: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "1%",
                refY: "99%"
            },
            sizeSelectorLR: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "99%",
                refY: "99%"
            }
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "rect",
                selector: "innerBody"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "text",
                selector: "value"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorUL",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorUR",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorLL",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorLR",
                groupSelector: "corners"
            }
        ]
    });
    joint.dia.Element.define("coras.roundRectElement", {
        attrs: {
            body: {
                rx: 15,
                ry: 15,
                refX: "0",
                refY: "0",
                refWidth: "100%",
                refHeight: "100%",
                fill: "#FFF",
                stroke: "#000",
            },
            cornerBox: {
                fill: "none",
                stroke: "#000000",
                d: 'M 0 90 H 90 90 V 90 0'
            },
            icon: {
                refX: 34,
                refY: 10
            },
            text: {
                refX: 45,
                refY: 56,
                textVerticalAnchor: "top",
                textAnchor: "middle"
            },
            sizeSelectorUL: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "1%",
                refY: "1%"
            },
            sizeSelectorUR: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "99%",
                refY: "1%"
            },
            sizeSelectorLL: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "1%",
                refY: "99%"
            },
            sizeSelectorLR: {
                event: 'element:sizeSelector:pointerdown',
                visibility: 'hidden',
                r: 7,
                opacity: 0.5,
                refX: "99%",
                refY: "99%"
            }
        }
    }, {
        markup: [
            {
                tagName: "rect",
                selector: "body"
            },
            {
                tagName: "path",
                selector: "cornerBox"
            },
            {
                tagName: "image",
                selector: "icon"
            },
            {
                tagName: "text",
                selector: "text"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorUL",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorUR",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorLL",
                groupSelector: "corners"
            },
            {
                tagName: "circle",
                selector: "sizeSelectorLR",
                groupSelector: "corners"
            }
        ]
    });
    joint.dia.Link.define("coras.defaultLink", {
        defaultLabel: {
            markup: [
                {
                    tagName: 'rect',
                    selector: 'rect'
                }, {
                    tagName: 'text',
                    selector: 'text'
                }
            ],
            attrs: {
                text: {
                    fill: '#000000',
                    fontSize: 14,
                    textAnchor: 'middle',
                    yAlignment: 'middle',
                    pointerEvents: 'none'
                },
                rect: {
                    ref: 'text',
                    fill: '#ffffff',
                    rx: 3,
                    ry: 3,
                    refWidth: 1,
                    refHeight: 1,
                    refX: 0,
                    refY: 0
                }
            },
            position: {
                distance: 0.5,
                offset: 0,
                angle: 0,
                args: {
                    keepGradient: true
                }
            }
        },
        attrs: {
            line: {
                connection: 'paths',
                stroke: '#333333',
                strokeWidth: 2,
                //strokeDasharray: '4 2',
                strokeLineJoin: 'round',
                targetMarker: {
                    'type': 'path',
                    'd': 'M 10 -5 0 0 10 5 z'
                }
            },
            wrapper: {
                connection: true,
                strokeWidth: 10,
                strokeLinejoin: 'round'
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'wrapper',
            attributes: {
                'fill': 'none',
                'cursor': 'pointer',
                'stroke': 'transparent'
            }
        }, {
            tagName: 'path',
            selector: 'line',
            attributes: {
                'fill': 'none',
                'pointer-events': 'none'
            }
        }] 
    });
}

export default AddCorasShapes;
