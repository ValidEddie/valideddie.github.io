var AND = 'ellipse';
var OR = 'triangle';
var SWITCH = 'diamond';
// var SWITCH = 'round-rectangle';
var NONE = 'ellipse';
var HUB = 'hub';
var TEMP = 'tempSensor';
var HUM = 'humSensor';
var COOLER = 'actuator';
var CAPSULE = 'round-rectangle'

var nodeDrawType = NONE

var tokenCounter = 0;
var initToken = false;

var tokenArray = new Array();
var nextTokenArray = new Array();

var fired = false;

var allTokenArray = new Array();
var tokenArray2 = new Array();
allTokenArray.push(tokenArray);
allTokenArray.push(tokenArray2);

var tokenMap = new HashMap();
var tokensMap = new HashMap(); /*all tokens*/
var nodesMap = new HashMap(); /* all node objects */

function Node(id, position, currentNode) {
    const nodeObj = {};

    nodeObj.id = currentNode.data().id;
    nodeObj.test = "test";
    nodeObj.position = position;
    nodeObj.currentNode = currentNode;

    nodeObj.nodeTokensMap = new HashMap();/* Real-time tokens on the node */

    nodeObj.move = function () {

        if (!(nodeObj.currentNode.data().id.includes("sw"))) {  /* it is not sw node*/
            let targets = nodeObj.currentNode.outgoers();/* all target nodes and edges*/

            /*move all tokens*/
            let values = nodeObj.nodeTokensMap.values(); /* all tokens in the node*/
            for (let i = 0; i < values.length; i++) {
                // let token = values[i]; /* get all tokens in a node*/

                console.log("typeof(values["+i+"])"+ typeof(values[i]));
                values[i].move(targets[1].data().id);
                values[i].currentNode = targets[1];
                console.log("targets[1].data().id------->"+targets[1].data().id);

                // token.move(targets[1].data().id);    /* animate of moving to next node*/
                // token.currentNode = targets[1];   /*change current node of per token*/

                if (!nodesMap.containsKey(targets[1].data().id)) {  /* not exist target node obj in nodesMap */
                    /* create new node in nodesMap*/
                    let key = targets[1].data().id;
                    let nodePosition = cy.$('#' + nodeObj.currentNode.outgoers()[1]).renderedPosition();
                    let value = Node(key, {x: nodePosition.x, y: nodePosition.y}, targets[1]);
                    nodesMap.put(key, value);
                }

                nodesMap.get(targets[1].data().id).nodeTokensMap.put(values[i].id, values[i]);
                // let targetNode = nodesMap.get(targets[1].data().id);
                // targetNode.nodeTokensMap.put(token.id, token);
                // nodesMap.put(targets[1].data().id, targetNode);

                // nodeObj.nodeTokensMap.remove(values[i].id);
            }

            for (let i = 0; i < values.length; i++) {
                nodeObj.nodeTokensMap.remove(values[i].id);
            }


        } else {

        }
    }


    return nodeObj;
}


/**************************************************************************/

/**
 * *********  functions of HashMap()  **************
 *   var map = new HashMap();
 *   map.put("key1","Value1");
 *   map.put("key2","Value2");
 *   map.put("key3","Value3");
 *   map.put("key4","Value4");
 *   map.put("key5","Value5");
 *   alert("size："+map.size()+" key1："+map.get("key1"));
 *   map.remove("key1");
 *   map.put("key3","newValue");
 *   var values = map.values();
 *   for(var i in values){
 *       document.write(i+"："+values[i]+"   ");
 *   }
 *   document.write("<br>");
 *   var keySet = map.keySet();
 *   for(var i in keySet){
 *       document.write(i+"："+keySet[i]+"  ");
 *   }
 *   alert(map.isEmpty());
 */

function HashMap() {
    //定义长度
    var length = 0;
    //创建一个对象
    var obj = new Object();

    /**
     * 判断Map是否为空
     */
    this.isEmpty = function () {
        return length == 0;
    };

    /**
     * 判断对象中是否包含给定Key
     */
    this.containsKey = function (key) {
        return (key in obj);
    };

    /**
     * 判断对象中是否包含给定的Value
     */
    this.containsValue = function (value) {
        for (var key in obj) {
            if (obj[key] == value) {
                return true;
            }
        }
        return false;
    };

    /**
     *向map中添加数据
     */
    this.put = function (key, value) {
        if (!this.containsKey(key)) {
            length++;
        }
        obj[key] = value;
    };

    /**
     * 根据给定的Key获得Value
     */
    this.get = function (key) {
        return this.containsKey(key) ? obj[key] : null;
    };

    /**
     * 根据给定的Key删除一个值
     */
    this.remove = function (key) {
        if (this.containsKey(key) && (delete obj[key])) {
            length--;
        }
    };

    /**
     * 获得Map中的所有Value
     */
    this.values = function () {
        var _values = new Array();
        for (var key in obj) {
            _values.push(obj[key]);
        }
        return _values;
    };

    /**
     * 获得Map中的所有Key
     */
    this.keySet = function () {
        var _keys = new Array();
        for (var key in obj) {
            _keys.push(key);
        }
        return _keys;
    };

    /**
     * 获得Map的长度
     */
    this.size = function () {
        return length;
    };

    /**
     * 清空Map
     */
    this.clear = function () {
        length = 0;
        obj = new Object();
    };
}

/**************************************************************************/


function openIt() {
    window.open("./test/page2.html", 400, 300);
}

/* change attributes*/
function popWin(ele) {
    let nodeName = ele.id();

    /* make change page appear*/
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block';

    /* show id on page */
    document.getElementById('nodeName').innerHTML = nodeName;

    // document.getElementById('swTarget').value= checkValue(nodeName, "flag");
}

function closeWin() {

    let isConfirm = confirm("Are you sure?");

    if (isConfirm) {
        /*make change page disappear*/
        document.getElementById('light').style.display = 'none';
        document.getElementById('fade').style.display = 'none';

        let nodeName = document.getElementById('nodeName').innerHTML;
        //
        // console.log("document.getElementById('swTarget').value:"+ document.getElementById('swTarget').value);
        //
        // setValue(nodeName, 'flag', document.getElementById('swTarget').value);

        let node1 = document.getElementById('node1').value;
        let node2 = document.getElementById('node2').value;
        let symbol = document.getElementById('symbol').value;
        let target1 = document.getElementById('target1').value;
        let target2 = document.getElementById('target2').value;


        let value1 = checkValue(node1, 'value');
        let value2 = checkValue(node2, 'value');
        //
        let order = value1 + symbol + value2;
        console.log("order:" + order);

        if (eval(order)) {
            setValue(nodeName, 'flag', target1);
        } else {
            setValue(nodeName, 'flag', target2);
        }

        console.log(node1, node2, symbol, value1, value2);
    }

}

function cyInitialize(jsonUrl) {
    let toJson = function (res) {
        return res.json();
    };

    let cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: {
            // name: 'cose'
            name: 'preset'
            // name: 'random'
            // name: 'grid'
            // name: 'circle'
            // name: 'concentric'
            // name: 'breadthfirst'
        },

        //fetch shape object
        //style: sbgnStylesheet(cytoscape),

        style: [
            {
                selector: 'node',
                style: {
                    'shape': 'data(type)',
                    'label': 'data(id)',
                    'height': 40,
                    'width': 60,
                    'background-color': 'grey',
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'curve-style': 'straight',
                    'line-color': '#000',
                }
            },
            {
                selector: "edge[arrow]",
                style: {
                    "target-arrow-shape": "data(arrow)"
                }
            },
            {
                selector: '.token',
                style: {
                    'shape': 'ellipse',
                    'label': 'data(id)',
                    'width': '20',
                    'height': '20',
                    'background-color': '#000',
                }
            },
            {
                selector: '.and',
                style: {
                    'height': 50,
                    'width': 100,
                    'label': 'data(id)',
                    'shape': 'round-rectangle',
                    'background-image': './img/btn-and.png',
                    'background-opacity': 0,    /*make background disappear but reserve img*/
                    /*make img fit to node*/
                    'background-fit': 'contain'
                }
            },

            {
                selector: '.or',
                style: {
                    'height': 50,
                    'width': 100,
                    'label': 'data(id)',
                    // 'shape': 'data(type)',
                    'shape': 'round-rectangle',
                    'background-color': '#55c720',
                    'background-image': './img/btn-or.png',
                    'background-fit': 'contain',
                    'background-opacity': 0
                }
            },
            {
                selector: '.capsule',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                    'shape': 'data(type)',
                    'background-color': '#fff',
                    'font-weight': 'bold',
                    'color': '#848484',
                    'font-size': '15px'
                }
            },
            {
                selector: '.switch',
                style: {
                    'width': 100,
                    'height': 60,
                    'label': 'data(id)',
                    // 'shape': 'data(type)',
                    'shape': 'round-rectangle', /*set shape of 'switch', make switch png appear*/

                    'background-color': '#f29d3d',
                    'background-image': './img/btn-switch.png',
                    'background-opacity': 0,    /*make background disappear but reserve img*/

                    // 'background-fit': 'cover'

                    /*make img fit to node*/
                    'background-fit': 'contain'

                    // 'background-clip': 'none',
                    // 'bounds-expansion': 50
                }
            },

            {
                selector: '.cond',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                }
            },

            {
                selector: '.hub',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                    'shape': 'rectangle',
                    'background-color': '#fff',
                    'background-image': './img/dev-hub.png'

                }
            },
            {
                selector: '.temp',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                    'shape': 'rectangle',
                    'background-color': '#fff',
                    'background-image': './img/dev-temp.png'

                }
            },
            {
                selector: '.hum',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                    'shape': 'rectangle',
                    'background-color': '#fff',
                    'background-image': './img/dev-hum.png'

                }
            },
            {
                selector: '.act',
                style: {
                    'width': 60,
                    'label': 'data(id)',
                    'shape': 'rectangle',
                    'background-color': '#fff',
                    'background-image': './img/dev-hum.png'

                }
            },
        ],
        //{ data: { id:'z4', label: 'IH=0.5 * {T + 61.0 + [(T-68.0)*1.2] + (RH*0.094)}' }},

        // elements: fetch('./data_3.json').then(toJson),/*efe*/
        elements: fetch(jsonUrl).then(toJson),/*efe*/
    });

    cy.fit(100); // fit to all the layouts

    // cy.autolock( true );

    cy.$('#s, #z1, #z2', '#z4', '#z5', '#z6', '#z7').makeLayout({
        name: 'circle',
        boundingBox: {
            x1: 0,
            y1: 0,
            x2: 500,
            y2: 500
        }

    }).run();

    /*cy.automove({
        nodesMatching: cy.$('#z3'),
        reposition: 'mean',
        meanOnSelfPosition: function( node ){ return false; }
    });

    // dragging mid drags its neighbourhood with it
    cy.automove({
        nodesMatching: cy.$('#z3').neighbourhood().nodes(),
        reposition: 'drag',
        dragWith: cy.$('#z3')
    });

    cy.automove({
        nodesMatching: cy.$('#SW1'),
        reposition: 'mean',
        meanOnSelfPosition: function( node ){ return false; }
    });

    // dragging mid drags its neighbourhood with it
    cy.automove({
        nodesMatching: cy.$('#SW1').neighbourhood().nodes(),
        reposition: 'drag',
        dragWith: cy.$('#SW1')
    });*/

    cy.fit(100); // fit to all the layouts

    // .automove-viewport nodes kept in viewport (even if added after this call)
    // convenient but less performant than `nodesMatching: collection`

    cy.automove({
        nodesMatching: '.automove-viewport',
        reposition: 'viewport'
    });

    var tgt1 = null;
    var tgt2 = null;
    var counter = 0;
    /*left mouse click*/
    cy.on('tap', function (evt) {
        var tgt = evt.target || evt.cyTarget; // 3.x || 2.x
        var nodeColor;


        if (tgt === cy) {

            if (nodeDrawType == OR) {
                /*draw on OR operator*/
                var capsID = 'zr' + Math.round(Math.random() * 2000);/*caption or random id for module*/
                var orID = 'or' + Math.round(Math.random() * 2000);/*random id for single node*/
                var edgeID = 'e' + Math.round(Math.random() * 2000);/*not used now*/

                /*add the element into the canvas*/
                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: orID, parent: capsID, label: 'data(id)', type: '' + nodeDrawType,},
                    classes: 'or',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

            } else if (nodeDrawType == SWITCH) {
                /*draw SWitch*/
                var capsID = 'z' + Math.round(Math.random() * 2000);
                var swID = 'sw' + Math.round(Math.random() * 2000);
                // var andID = 'cond' + Math.round(Math.random() * 2000);
                var condID = 'cond' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);
                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


                cy.add({
                    classes: 'automove-viewport',
                    data: {id: swID, parent: '' + capsID, type: '' + nodeDrawType},

                    classes: 'switch',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    // data: { id: andID, parent: '' + capsID, type: 'AND'},
                    // data: { id: condID, parent: '' + capsID, type: 'AND'},
                    // data: { id: condID, parent: '' + capsID, type: 'AND', flag: 0},
                    data: {id: condID, parent: '' + capsID, type: 'COND', flag: 0},

                    classes: 'cond',
                    position: {
                        x: evt.position.x + 80,
                        y: evt.position.y
                    }
                });

                cy.add({
                    // data: { id: edgeID, source: andID, target: swID, arrow: 'triangle',}
                    data: {id: edgeID, source: condID, target: swID, arrow: 'triangle',}
                });

            } else if (nodeDrawType == HUB) {

                var capsID = 'HUB(Condition)' + Math.round(Math.random() * 2000);
                var swID = 'sw' + Math.round(Math.random() * 2000);
                var andID = 'cond' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);
                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


                cy.add({
                    classes: 'automove-viewport',
                    data: {id: swID, parent: '' + capsID, type: '' + nodeDrawType},

                    classes: 'switch',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: andID, parent: '' + capsID, type: 'AND'},

                    classes: 'and',
                    position: {
                        x: evt.position.x + 80,
                        y: evt.position.y
                    }
                });

                cy.add({
                    data: {id: edgeID, source: andID, target: swID, arrow: 'triangle',}
                });

            } else if (nodeDrawType == TEMP) {

                var capsID = 'zn' + Math.round(Math.random() * 2000);
                var andID = 'SENSOR(Temp)' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);

                if (cy.nodes().length < 1) {
                    andID = 's';
                }

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: andID, parent: capsID, type: '' + nodeDrawType},
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


            } else if (nodeDrawType == HUM) {

                var capsID = 'zn' + Math.round(Math.random() * 2000);
                var andID = 'SENSOR(Humidity)' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);

                if (cy.nodes().length < 1) {
                    andID = 's';
                }

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: andID, parent: capsID, type: '' + nodeDrawType},
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


            } else if (nodeDrawType == COOLER) {

                var capsID = 'zn' + Math.round(Math.random() * 2000);
                var andID = 'ACTUATOR(Cooler)' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);

                if (cy.nodes().length < 1) {
                    andID = 's';
                }

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: andID, parent: capsID, type: '' + nodeDrawType},
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


            } else {

                var capsID = 'zn' + Math.round(Math.random() * 2000);
                var andID = 'z' + Math.round(Math.random() * 2000);
                var edgeID = 'e' + Math.round(Math.random() * 2000);

                let classesName = 'and';

                if (cy.nodes().length < 1) {
                    andID = 's';
                    classesName = 's';
                }

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: capsID, type: 'CAPSULE'},

                    classes: 'capsule',
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

                cy.add({
                    classes: 'automove-viewport',
                    data: {id: andID, parent: capsID, type: '' + nodeDrawType},

                    classes: classesName,
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });


            }

            tgt1 = tgt2 = null;
            counter = 0;

        } else if (tgt.isNode()) {
            //console.log(tgt.selectionType());

            if (tgt1 == null) {
                tgt1 = tgt;
                console.log('Saved ' + tgt1.id());
                counter = counter + 1;
            } else if (tgt2 == null) {
                tgt2 = tgt;
                console.log('Saved' + tgt2.id());
                counter = counter + 1;
            }
            if (counter == 2) {
                console.log('Connected!' + tgt1.id() + ' to ' + tgt2.id());
                cy.add({
                    data: {source: '' + tgt1.id(), target: '' + tgt2.id(), "arrow": "triangle"},
                });
                tgt1 = tgt2 = null;
                counter = 0;
                console.log("Cleared!")
            }
        } else if (tgt.isEdge()) {
            console.log('Is edge!');
        }
    });

    // /*right mouse click*/
    // cy.on('cxttap', 'node', function (evt) {
    //     console.log("evt:"+evt);
    //     let tgt = evt.target || evt.cyTarget; // 3.x || 2.x
    //     //
    //     // tgt.remove();
    //     // if (tgt.isEdge()) {
    //     //     source = tgt.getS
    //     //     tgt.remove('edge[target=\'' + nodeId + '\']');
    //     // }
    //
    //     console.log("tgt.data().id:"+ tgt.data().id);
    //     console.log(checkValue(tgt.data().id, "parent"));
    //
    // });

    /*right mouse click*/
    cy.cxtmenu({
        selector: 'node, edge, .cond',

        commands: [
            {
                content: 'edit',
                select: function (ele) {
                    // var str = "cy.$(\'" + id + "\').data()." + dataName; /* Splicing string */

                    console.log("ele.id():" + ele.id());
                    // openIt();

                    popWin(ele);
                }
            },

            {
                // content: '<span class="fa fa-star fa-2x"></span>',
                content: 'delete',
                select: function (ele) {
                    // console.log(ele.data().id);
                    console.log("delete:" + ele.id());
                    cy.$('#' + ele.id()).remove();
                },
                // enabled: false
            },

            // {
            //     content: 'Text',
            //     select: function (ele) {
            //         console.log(ele.position());
            //     }
            // },

        ]
    });

    /*right mouse click*/
    // cy.cxtmenu({
    //     // selector: 'core',
    //     // selector: 'capsule',
    //
    //     commands: [
    //         {
    //             content: 'bg1',
    //             select: function () {
    //                 console.log('bg1');
    //             }
    //         },
    //
    //         {
    //             content: 'bg2',
    //             select: function () {
    //                 console.log('bg2');
    //             }
    //         },
    //
    //     ]
    // });

}


document.addEventListener('DOMContentLoaded', function () {

    let jsonUrl = './data_default.json';
    jsonUrl = './data_3.json';
    // jsonUrl = './data (17).json';
    // jsonUrl = './data_improvement.json';

    cyInitialize(jsonUrl);
});

// function openFile(){
// 	console.log("there is openFile:");
// }

function saveFile() {
    var jdata = cy.elements().jsons();
    console.log("" + jdata);

    /// write to file
    var txtFile = "test.json";

    // (A) CREATE BLOB OBJECT
    var myBlob = new Blob([JSON.stringify(jdata, null, 2)], {type: 'text/plain'});

    // (B) CREATE DOWNLOAD LINK
    var url = window.URL.createObjectURL(myBlob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "data.json";

    // (C) "FORCE DOWNLOAD"
    // NOTE: MAY NOT ALWAYS WORK DUE TO BROWSER SECURITY
    // BETTER TO LET USERS CLICK ON THEIR OWN
    anchor.click();
    window.URL.revokeObjectURL(url);
    document.removeChild(anchor);
}

function setCAPSULE() {
    nodeDrawType = CAPSULE;
}

function setAND() {
    nodeDrawType = AND;
}

function setOR() {
    nodeDrawType = OR;

}

function setSWITCH() {
    nodeDrawType = SWITCH;

}

function setHUB() {
    nodeDrawType = HUB;

}

function setTEMP() {
    nodeDrawType = TEMP;

}

function setHUM() {
    nodeDrawType = HUM;

}

function setCOOLER() {
    nodeDrawType = COOLER;

}

function deleteElement() {
    cy.$(':selected').remove();
}

function Token(id, label, data, position, cNode, color) {
    const obj = {};
    // obj.id = id;
    obj.id = tokenCounter++;
    obj.label = "token" + obj.id;
    obj.data = data;
    obj.color = color;
    obj.position = position;
    obj.currentNode = cNode;

    obj.node = cy.add({
        classes: 'token',
        data: {id: "t" + obj.id, label: obj.label},
        renderedPosition: {x: obj.position.x, y: obj.position.y},
        position: {x: obj.position.x, y: obj.position.y}
    });

    // tokenCounter = tokenCounter + 1;
    //console.log(obj.id);

    obj.testFunction = function () {
        console.log("There is testFunction:"+obj.id);
    }

    obj.moveBySelf = function () {
        let currentNode = obj.currentNode;
        let allTargetNodes = currentNode.outgoers();//output node of source. For example, for s, it is z542, z12, z138
        let inPathNums = currentNode.incomers().length / 2;
        let outPathNums = allTargetNodes.length / 2;/* because of edge nodes, divided by 2*/

        /* for test */
        var initPos = cy.$('#' + currentNode.outgoers()[1]).renderedPosition();
        console.log("cy.$('#' + currentNode.outgoers()[1]).renderedPosition():" + initPos.x);

        obj.move(currentNode.outgoers()[1].data().id);

        // if(inPathNums == 0){    /* it's a start node*/
        //
        //     if(outPathNums == 1){
        //         obj.move(currentNode.outgoers()[1].data().id);  /* move to next node*/
        //     }else{
        //         for (let i = 0; i < outPathNums; i++) {
        //             let x = Token(null, null, obj.data, obj.position, cNode, 'green');
        //             tokenMap.put(x.id, x);
        //         }
        //         cy.$('#t' + obj.id).style("opacity", "0");
        //         tokenArray = arrayRemove(tokenArray, tokenArray[0]);
        //     }
        //
        // }else{
        //     obj.move(currentNode.outgoers()[1].data().id);
        // }

    }

    obj.move = function (targetNode) {
        var target = cy.$('#' + targetNode);
        console.log('(Move) Target id :' + targetNode);

        var targetEdge = target.connectedEdges();
        console.log(target.connectedEdges());

        console.log("time111111:" + Date());
        obj.node.animate({
            //position: { x: "300", y: "140" },
            // position: {x: target.position().x, y: target.position().y - 30},
            position: {x: target.position().x, y: target.position().y},
            style: {backgroundColor: 'red'}
        }, {
            duration: 1000  /* move speed */
        });
        obj.position = target.position();
        //cy.$('#' + obj.id).position = target.position();
        // cy.$('#' + obj.id).renderedPosition = target.position();
        cy.$('#t' + obj.id).shift({
            x: target.position().x - obj.node.position().x,
            y: target.position().y - obj.node.position().y
        });
        obj.position = cy.$('#t' + obj.id).renderedPosition();
        //obj.position().y = cy.$('#t' + obj.id).renderedPosition().y;
        console.log(obj.node);
        obj.currentNode = target;
        //cy.$('#t' + obj.id).style("opacity", "0.5");

        console.log("time2222:" + Date());

    }

    obj.copy = function (num, cNode) {
        var copyArray = new Array();
        var i = 0;
        console.log('>Copy from:' + obj.id);

        for (i = 0; i < num; i++) {
            var newid = tokenCounter + 1;
            var x = Token(newid, 'token' + newid, obj.data, obj.position, cNode, 'green');
            copyArray.push(x);
            console.log('>Generated new token:' + cy.$('#t' + newid).data().id + ' Pos:' + obj.position.x + ',' + obj.position.y);
            cy.$('#t' + obj.id).style("opacity", "0");
            //cy.$('#t' + newid).style("display", "none");
        }

        return copyArray;
    }

    obj.merge = function (cNode) {
        /*****************************************************************************************/
        /*****************************************************************************************/

        /* create new token*/
        var y = obj;
        var newid = tokenCounter + 1;
        y = Token(newid, 'token' + newid, obj.data, obj.position, cNode, 'green');


        var count = tokenArray.length;
        for (var k = 0; k < count; k++) {
            // if(tokenArray[0].id != tokenArray[k].id && tokenArray[0].position.x == tokenArray[k].position.x){
            // 	cy.$('#t' + tokenArray[k].id).style("opacity", "0");
            // 	tokenArray = arrayRemove(tokenArray, tokenArray[k]);
            // }
            cy.$('#t' + tokenArray[0].id).style("opacity", "0");/*make token disappear*/
            tokenArray = arrayRemove(tokenArray, tokenArray[0]);
        }
        tokenArray.push(y);
        return y;
        /*****************************************************************************************/
        /*****************************************************************************************/


        // var i = 0;
        // var j = 0;
        // var x = obj;

        // for (i = 0; i < tokenArray.length; i++) {
        // 	for (j = 0; j < tokenArray.length; j++) {
        // 		//console.log("Merging node i:" + tokenArray[i].currentNode.data().id);
        //        // console.log("Merging node j:" + tokenArray[j].currentNode.data().id);
        //
        //         // if (tokenArray[i].id != tokenArray[j].id && tokenArray[i].position == tokenArray[j].position) {
        //         if (tokenArray[i].id != tokenArray[j].id && tokenArray[i].position.x == tokenArray[j].position.x) {
        //         // if (tokenArray[i].id != tokenArray[j].id ) {
        // 			console.log("Merging...");
        //
        //             var newid = tokenCounter + 1;
        // 			x = Token(newid, 'token' + newid, obj.data, obj.position, cNode, 'green');
        //
        //             //cy.$('#t' + newid).style("opacity", "0");
        // 			//console.log('>Generated new MERGED token: t' + x.id + ' Pos:' + x.position.x + ',' + x.position.y);
        // 			//console.log("POPED: t" + tokenArray[j].id);
        // 			//tokenArray.pop(tokenArray[j]);
        // 			//tokenArray.pop(tokenArray[i]);
        //
        //             cy.$('#t' + tokenArray[j].id).style("opacity", "0");
        //             cy.$('#t' + tokenArray[i].id).style("opacity", "0");
        //             tokenArray = arrayRemove(tokenArray, tokenArray[j]);
        //             tokenArray = arrayRemove(tokenArray, tokenArray[i]);
        // 			tokenArray.push(x);
        //             //nextTokenArray.push(x);
        //             console.log("After Merged:");
        //
        //             showTokenArray("MERGE");
        //         }
        //     }
        // }
        //
        // return x;


    }

    return obj;
}

/*function to fire token*/
function fireToken(token, index) {

    //console.log("Firing token... with " + tokenArray.length + " tokens.");
    //console.log(token);
    console.log("console.log(index);" + index);

    var n = tokenArray.length;//number of tokens
    var newMergedToken = null;

    //for (i = 0; i < n; i++) {
    console.log("NOW Firing : t" + token.id);

    //console.log(token);
    //console.log("Current Node : " + source.data().id);
    //console.log(source);


    //console.log('Source id:' + source.id());
    //console.log('Outgoers num:' + pathnum);
    //console.log('Outgoers num:' + targets[0].data().id);
    var source = token.currentNode;//for initial token for example is 's'

    var copiedTokens = new Array();
    //var mergedToken = null;
    var tokenNum = 1;

    /*******************for test****************************/
    /*******************for test****************************/
        // cy.$('#t'+newid).data().id
    var incomersList = source.incomers();
    console.log("incomersList.length==>>>" + incomersList.length);

    if (incomersList.length > 0) {
        for (var i = 0; i < incomersList.length; i++) {
            console.log("incomersList[" + i + "].data().id--->" + incomersList[i].data().id);
            console.log("incomersList[" + i + "].data().flag--->" + incomersList[i].data().flag);
        }
        // console.log("incomersList[0].data().id==>>>"+incomersList[1].data().id);
    }
    // console.log("source.incomers()[0]----->"+ (source.incomers()[0].data().id) );
    /*******************for test****************************/
    /*******************for test****************************/

    //for merging
    // if (source.incomers().length > 1) {
    if (source.incomers().length > 2) {/*************************************************************/
        /* incomers().length/2 is pathNum*/
        // tokenArray = arrayRemove(tokenArray, token);
        token = token.merge(source);
        source = token.currentNode;

    }
    console.log(source.incomers().length);

    var targets = source.outgoers();//output node of source for example of s is z542, z12, z138
    console.log("source.outgoers():" + targets.length);
    var pathnum = targets.length / 2;

    if (pathnum > 1) {
        /*if the path is more than 1 */
        copiedTokens = token.copy(pathnum, source);
        //tokenArray.pop(token);
        tokenArray = arrayRemove(tokenArray, token);
        //console.log('New Array(pop):' + tokenArray.length);
        tokenNum = copiedTokens.length;

        // if (token.currentNode.data().id.includes('swc')) {//if it is switch
        if (token.currentNode.data().id.includes('sw')) {//if it is switch
            //SWITCH
            /* tokenArray = arrayRemove(tokenArray, token);
             token = token.merge(source);
             source = token.currentNode;
             targets = source.outgoers();
             token.move(targets[Math.floor(Math.random()*k)].data().id);*/

            console.log('Copied new tokens:' + tokenNum);
            console.log('New Array length:' + tokenArray.length);
            //n = tokenArray.length;
            var k = 1;
            //console.log('k:' + k);

            var randPath = Math.floor(Math.random() * 1);//for example only one output for the token
            console.log("Move Copied Token: t" + copiedTokens[0].id + "--> " + targets[1].data().id);

            /**************** new ******************/
            /**************** new ******************/

                // cy.$('#cond1831').data().flag = 2;/*set value of flag of cond1831 module*/
            var incomersList1 = token.currentNode.incomers();/*get incomers' Array*/
            for (var i = 0; i < incomersList.length; i++) {
                if (incomersList1[i].data().id.includes('cond')) {/*find condition module from incomers*/
                    var condFlag = incomersList1[i].data().flag;/* get flag of cond*/
                    console.log("condFlag--->" + condFlag);
                }
            }

            /*if cond exist*/
            // if(condFlag>0){
            // 	copiedTokens[0].move(targets[condFlag * 2 - 1].data().id);/*move by condFlag*/
            // 	copiedTokens[0].currentNode = targets[condFlag * 2 - 1];
            // 	tokenArray.push(copiedTokens[0]);
            // }
            if (condFlag != 0) {
                for (var i = 0; i < targets.length; i++) {
                    if (targets[i].data().id.includes(condFlag)) {
                        copiedTokens[0].move(targets[i].data().id);
                        copiedTokens[0].currentNode = targets[i];
                        tokenArray.push(copiedTokens[0]);
                    }
                }
            }


            /**************** new ******************/
            /**************** new ******************/

            /****************old***************/
            /****************old***************/
            // /*can change*/
            // copiedTokens[0].move(targets[1].data().id);/*move token from switch*/
            // /*if target is switch s then output is z1,z2 target[0].data.id = 'z1', target[1].data.id*/
            //
            // copiedTokens[0].currentNode = targets[1];
            // tokenArray.push(copiedTokens[0]);
            /****************old***************/
            /****************old***************/

            /*two importants tokenArray function is tokenArray.push() and tokenArray.remove()*/
            /*tokenArray.push() saves token into the arrayRemove*/
            /*tokenArray.remove() deletes token from the array*/

            //cy.$('#t' + copiedTokens[j].id).style("opacity", "0");
            // k = k + 2;
            // }

            for (j = 1; j < copiedTokens.length; j++) {
                tokenArray = arrayRemove(tokenArray, copiedTokens[j]);
            }

        } else {
            //current node is not switch
            console.log('Copied new tokens:' + tokenNum);
            console.log('New Array length:' + tokenArray.length);
            //n = tokenArray.length;
            var k = 1;

            for (j = 0; j < copiedTokens.length; j++) {

                //console.log('k:' + k);
                console.log("Move Copied Token: t" + copiedTokens[j].id + "--> " + targets[k].data().id);
                copiedTokens[j].move(targets[k].data().id);
                copiedTokens[j].currentNode = targets[k];
                //cy.$('#t' + copiedTokens[j].id).style("opacity", "0");
                k = k + 2;
            }


            var l = 0;
            for (l = 0; l < copiedTokens.length; l++) {
                if (!tokenArray.includes(copiedTokens[l])) {
                    tokenArray.push(copiedTokens[l]);
                }

            }

        }

        //tokenArray.fireToken();
        //fired = true;
        //tokenArray.pop(token);
        //showTokenArray();
        //console.log(copiedTokens[i]);
        //copiedTokens[k].move('z4');

    } else {
        /*if pathnum is 1*/
        //console.log("ONE PATH to : " + source.outgoers()[1].data().id);
        var copiedToken = token.copy(1, source.outgoers()[1])[0];/* outgoers()[1] means next node */
        //tokenArray.pop(token);
        tokenArray = arrayRemove(tokenArray, token);
        copiedToken.move(source.outgoers()[1].data().id);
        copiedToken.currentNode = source.outgoers()[1];
        //cy.$('#t' + copiedToken.id).style("opacity", "0");
        if (!tokenArray.includes(copiedToken)) {
            tokenArray.push(copiedToken);
        }
        //fired = true;
        //console.log(source.outgoers()[1].data().id);
    }
    //for copying () pathnum is the number of path from current node

    showTokenArray("FIRED");
    //tokenArray = nextTokenArray();
}

// function initializeCond() {
// 	cy.$('#cond1831').data().flag = "z509";
// }
function initializeCond() {
    /*get value of attributes */
    let signal = checkValue("#s", "signal");
    let speed = Number(checkValue("#s", "speed"));
    let pedestrian = checkValue("#cond489", "pedestrian")

    let value;
    if (signal == "red") {
        value = "z1205"
    } else if (signal == "yellow") {
        value = (speed > 40) ? "z1289" : "z35"
    } else if (signal == "green") {
        value = (speed > 60) ? "z1166" : "z35";
    }
    setValue("#cond1140", "flag", value);/*set value by conditions*/

    value = (pedestrian == true) ? "z972" : "z186";
    setValue("#cond489", "flag", value);
}

/**
 * check value of nodes
 * @param id
 * @param dataName
 * @returns {any}
 */
function checkValue(id, dataName) {
    var str = "cy.$(\'#" + id + "\').data()." + dataName; /* Splicing string */
    console.log("str:" + str);
    // console.log("checkValue test:" + eval(str));

    return eval(str);/*make String become code */
}

/**
 * set value of nodes
 * @param id
 * @param dataName
 * @param value
 */
function setValue(id, dataName, value) {
    var str = "cy.$(\'#" + id + "\').data()." + dataName + "= \'" + value + "\';"; /* Splicing string */
    /*cy.$('#cond1140').data().flag= 'z35';*/
    console.log("str:" + str);

    eval(str);/*make String become code */
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}


function initializeToken(source) {
    var initPos = cy.$('#' + source).renderedPosition();//initial position(x,y) is = '#s'
    //console.log(initPos);
    var i = 0;
    if (!initToken) {
        //Token(id, label, data, position, color)
        for (i = 0; i < 1; i++) {
            /*generate new token*/
            // var newToken = Token(tokenArray.length + 1, 'token1', 'true', {
            var newToken = Token(null, 'token1', 'true', {
                x: initPos.x + 10,
                y: initPos.y + 10
                // x: initPos.x ,
                // y: initPos.y
            }, cy.$('#' + source), 'red');
            //newToken.currentNode = cy.$('#' + source);
            console.log(newToken.label);

            tokenArray.push(newToken);/*save the new token into the data array*/
            tokenMap.put(newToken.id, newToken);
            tokensMap.put(newToken.id, newToken);

            if (!nodesMap.containsKey(source)){
                let nodeObj = Node(source, {x: initPos.x + 10, y: initPos.y + 10}, cy.$('#' + source));
                nodesMap.put(source, nodeObj);
            }

            nodesMap.get(source).nodeTokensMap.put(newToken.id, newToken);

            console.log("nodesMap--->" + nodesMap);
            console.log("newToken.id--->" + newToken.id);
            console.log("nodesMap.get('s').nodeTokensMap.get(newToken.id).label------>" + nodesMap.get('s').nodeTokensMap.get(0).label);

            console.log(tokenArray);
        }

        // initToken = true;

        console.log("Initialized token.");
    }
}

function Play() {
    console.log("time:" + Date());
    initializeToken('s');
    // initializeToken('z1538');
    // initToken = true;

    /*for test*/
    // let newNode = Node("eddie", null, cy.$('#z138'));
    // nodesMap.put("eddie", newNode);
    // let keys = nodesMap.keySet();
    // for(let i=0;i<keys.length;i++){
    //     console.log("key---->"+keys[i]);
    // }

    /*initialize condition of switch*/
    // initializeCond();
}

var testNum = 0;
function forwardPlay() {
    // tokenArray[0].moveBySelf();
    console.log("tokenMap.keySet():" + tokenMap.keySet());

    // nodesMap.get('s').move();


    let initPos = cy.$('#s' ).renderedPosition();

    for(let i=0;i<10;i++){
        let newNode = Node(i, null, cy.$('#s'));
        var newToken = Token(null, 'token1', 'true', {
            x: initPos.x + 10,
            y: initPos.y + 10
            // x: initPos.x ,
            // y: initPos.y
        }, cy.$('#s'), 'red');
        newNode.nodeTokensMap.put(i,newToken);
        // newNode.nodeTokensMap.put(i,i);

        var newToken = Token(null, 'token1', 'true', {
            x: initPos.x + 10,
            y: initPos.y + 10
            // x: initPos.x ,
            // y: initPos.y
        }, cy.$('#s'), 'red');
        newNode.nodeTokensMap.put(i+1,newToken);

        nodesMap.put(i, newNode);
    }


    // console.log("newNode.nodeTokensMap.values().length: "+newNode.nodeTokensMap.values().length );

    let nodes = nodesMap.values();
    for(let i=0;i<nodes.length;i++){
        let tokens = nodes[i].nodeTokensMap.values();
        for(let j=0;j<tokens.length;j++){
            console.log("------------>nodes["+i+"]:token["+j+"]:"+tokens[j].id);
            tokens[j].testFunction();
        }
    }

    // let values = newNode.nodeTokensMap.values();
    // for(let i=0;i<10;i++){
    //     console.log("------------>"+newNode.nodeTokensMap.get(i).id);
    //     console.log("------------>values"+i+"))))"+values[i].id);
    //     // console.log("------------>"+newNode.nodeTokensMap.get(i));
    // }

    // let move_loop = setInterval(function(){moveTimer()},2000);
    // function moveTimer(){
    //     /*for test*/
    //     let keys = nodesMap.keySet();
    //     let nodeValues = nodesMap.values();
    //     for(let i = 0 ; i < keys.length;i++){
    //         console.log("keys["+i+"]--------->" + keys[i]);
    //
    //         // let tokens = nodeValues[i].nodeTokensMap.keySet();
    //         let tokens = nodesMap.get(keys[i]).nodeTokensMap.keySet();
    //         for(let j =0; j<tokens.length;j++){
    //             console.log("--------->nodesMap.get(keys["+i+"]).nodeTokensMap.keySet("+j+")"+tokens[j]);
    //         }
    //
    //     }
    //
    //
    //     let initPos = cy.$('#s').renderedPosition();
    //     let newToken = Token(null, 'token1', 'true', {
    //         x: initPos.x + 10,
    //         y: initPos.y + 10
    //         // x: initPos.x ,
    //         // y: initPos.y
    //     }, cy.$('#s'), 'red');
    //     // nodesMap.get('s').nodeTokensMap.put(newToken);
    //
    //     // initToken = true;
    //     let values = nodesMap.values();
    //     for (let i = 0; i<values.length ; i++){
    //         values[i].move();
    //     }
    // }



    // tokenMap.get('0').moveBySelf();

    // if (initToken) {/*if initial token 'token1' is exist*/
    //     tokenArray.forEach(fireToken);/*call fire toke function every time forwardPlay is called*/
    // }

    /*timer */
    // let myVar = setInterval(function(){myTimer()},2000);
    //
    // function myTimer(){
    //     for (let i = 0; i < tokenArray.length; i++) {
    //         console.log("forwardPlay() -> tokenArray "+i+":id: "+tokenArray[i].id);
    //     }
    //
    //     //initializeToken('s');
    //     //console.log(tokenArray[0]);
    //
    //     if (initToken) {/*if initial token 'token1' is exist*/
    //         //console.log(tokens[0]);
    //         /*tokenArray[0].move("z3");
    //         tokenArray[0].move("z1");
    //         tokenArray[0].move("z4");
    //         tokenArray[0].move("z2");*/
    //
    //         // var count = tokenArray.length;
    //         // for (var i = 0; i < count; i++) {
    //         // 	fireToken(tokenArray[i]);
    //         // }
    //
    //         tokenArray.forEach(fireToken);/*call fire toke function every time forwardPlay is called*/
    //         //fireToken(tokenArray);
    //         //console.log("Token Array NOW:");
    //         //console.log(tokenArray);
    //
    //     }
    //
    //     //console.log(cy.nodes());
    //     // initializeToken('s');
    //     //initToken = false;
    //     console.log('Animating nodes...');
    //
    // }


}

function showTokenArray(label) {
    console.log(label + " Token Array:");
    console.log(tokenArray);
}

function openFile() {
    let fileInput = document.getElementById('btn-open');

    let jsonUrl = URL.createObjectURL(new Blob([fileInput.files[0]]));

    console.log("fileInput.files[0].name:" + fileInput.files[0].name);

    cyInitialize(jsonUrl);

    /* initialize attributes again*/
    tokenCounter = 0;
    initToken = false;
    fired = false;
    tokenArray.length = 0;
    nodeDrawType = NONE;
}
