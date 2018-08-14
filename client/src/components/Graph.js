import React, { Component } from 'react';
import { cytoscape } from 'react-cytoscape';
import CytoContainer from './CytoContainer';
import Map from './Map';
import EntityTable from './EntityTable';
import { Grid, Row, Col, Navbar, Nav, NavItem, NavDropdown, MenuItem, Alert, Button } from "react-bootstrap";
import './style.css';
import gql from 'graphql-tag';
import { createApolloFetch } from 'apollo-fetch';
import { runInThisContext } from 'vm';
import SaveAlert from './SaveAlert';
import AddEntity from './AddEntity';
import NodeData from './NodeData';
import CreateLink from './CreateLink';
import SaveChanges from './SaveChanges';

const fetch = new createApolloFetch({
  uri: 'http://localhost:4000/graphql',
});

const entitiesQuery = gql`
   query entitiesQuery {
	 entities {
	   id
	   name
	   firstName
	   lastName
	   address
	   phone
	   gender
	   employed
	   dob
	 }
   }
 `;

 var shouldFetch = false;

class Graph extends Component {
	constructor(props) {
		super(props);

		this.state = { cytoscapeLayout: 'grid', elements: {}, elementIds: [], links: [], linkDict: {}, selectedNodeId: '', shouldUpdatePositions: false, size: 12, table: false, map: false, mapHeight: '900px', graphs: [], showAlert: false, showAddEntity: false, shouldChangeGraph: true, selected: [], selectedNodes: [], loaded: true, justStoredPostions: false, positions: {}, storedNodesAndPositions: [], entities: {}, newData: false, canAddLink: false, nodesToLink: [], showEditNode: false, graphLoaded: false, graphId: 0, graphName: '', showCreateLink: false, showSaveChanges: false, shouldClearOnSave: false };
		this.changeLayout = this.changeLayout.bind(this);
		this.showTable = this.showTable.bind(this);
		this.showMap = this.showMap.bind(this);
		this.getData = this.getData.bind(this);
		this.getEntities = this.getEntities.bind(this);
		this.saveData = this.saveData.bind(this);
		this.tableMadeChange = this.tableMadeChange.bind(this);
		this.loadData = this.loadData.bind(this);
		this.loadElements = this.loadElements.bind(this);
		this.getData = this.getData.bind(this);
		this.hideAlert = this.hideAlert.bind(this);
		this.showAlert = this.showAlert.bind(this);
		this.savePositions = this.savePositions.bind(this);
		this.getPositions = this.getPositions.bind(this);
		this.highlight = this.highlight.bind(this);
		this.addEntity = this.addEntity.bind(this);
		this.addLink = this.addLink.bind(this);
		this.createLink = this.createLink.bind(this);
		this.showEntity = this.showEntity.bind(this);
		this.hideEntity = this.hideEntity.bind(this);
		this.expand = this.expand.bind(this);
		this.newChart = this.newChart.bind(this);
		this.editNode = this.editNode.bind(this);
		this.hideEditNode = this.hideEditNode.bind(this);
		this.saveAs = this.saveAs.bind(this);
		this.showCreateLink = this.showCreateLink.bind(this);
		this.hideCreateLink = this.hideCreateLink.bind(this);
		this.showSaveChanges = this.showSaveChanges.bind(this);
		this.hideSaveChanges = this.hideSaveChanges.bind(this);
		this.saveChanges = this.saveChanges.bind(this);
	}

	componentDidMount() {
		this.getEntities();
		this.getGraphs();
	}

	componentDidUpdate() {
		if (this.state.shouldHighlight) {
			this.highlight();
			this.setState({ shouldHighlight: false });
		}
	}

	getEntities() {
		if (shouldFetch) {
			shouldFetch = false;
			fetch({
				query: entitiesQuery,
			}).then(res => {
				var entities = {};
				var data = res.data;

				for (var i in data['entities']) {
					entities[i] = data['entities'][i]
				}

				this.setState({ entities: entities });
			})
		}
	}

	// getElements() {
	// 	var entities = this.state.entities;
	// 	var nodes = [];
	// 	var edges = [];
	// 	var attributes = {};
	// 	var sharedAttributes = ['address', 'phone', 'employed'];
	// 	var attributesToShow = ['address', 'phone', 'employed'];

	// 	for (var entity in entities) {
	// 		nodes.push({ data: { id: entities[entity]['id'], name: entities[entity]['name'], entityId: entities[entity]['id'], label: entities[entity]['name'], attribute: entities[entity]['gender'] } });
	// 		nodes.push({ data: { id: 'id' + entity, name: entity, entityId: entities[entity]['id'], attribute: 'ID' } });
	// 		edges.push({ data: { source: entities[entity]['id'], target: 'id' + entity, label: "Issued ID"}, classes: 'autorotate' });
	// 	}

	// 	for (var id in entities) {
	// 		for (var key in entities[id]) {
	// 			if (key === 'id') {
	// 				continue;
	// 			} else if (key === 'employed' && entities[id][key] === null) {
	// 				continue;
	// 			} else if (key === 'family') {
	// 				for (var relationship in entities[id][key]) {
	// 					edges.push({ data: { source: id, target: entities[id][key][relationship], label: relationship}, classes: 'autorotate' });
	// 				}
	// 			} else if (key !== 'name' && key !== 'gender') {
	// 				if (!(key in attributes)) {
	// 					var testDict = {};
	// 					testDict[entities[id][key]] = 1;
	// 					attributes[key] = testDict;

	// 					if (sharedAttributes.includes(key)) {
	// 						nodes.push({ data: { id: entities[id][key], name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
	// 						edges.push({ data: { source: entities[id]['id'], target: entities[id][key] , label: key}, classes: 'autorotate' });
	// 					} else { 
	// 						if (attributesToShow.includes(key)) {
	// 							nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
	// 							edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
	// 						}
	// 					}

	// 				} else {
	// 					if (!(entities[id][key] in attributes[key])) {
	// 						attributes[key][entities[id][key]] = 1;

	// 						if (sharedAttributes.includes(key)) {
	// 							nodes.push({ data: { id: entities[id][key], name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
	// 							edges.push({ data: { source: entities[id]['id'], target: entities[id][key] , label: key}, classes: 'autorotate' });
	// 						} else {
	// 							if (attributesToShow.includes(key)) {
	// 								nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
	// 								edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
	// 							}
	// 						}
	// 					} else {
	// 						if (sharedAttributes.includes(key)) {
	// 							edges.push({ data: { source: entities[id]['id'], target: entities[id][key], label: key}, classes: 'autorotate' });
	// 						} else {
	// 							if (attributesToShow.includes(key)) {
	// 								nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
	// 								edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}
	// 		} }

	// 	return { nodes, edges };
	// }

	getElements() {
		var elements = this.state.elements;
		var links = this.state.links;
		var nodes = [];
		var edges = [];
		var attributes = {};
		var sharedAttributes = ['address', 'phone', 'employed'];
		var attributesToShow = ['address', 'phone', 'employed'];

		for (var key in elements) {
			nodes.push({ data: { id: elements[key]['entityId'], name: elements[key]['value'], label: elements[key]['value'], attribute: elements[key]['type'], entityId: elements[key]['entityId'] } });
			//edges.push({ data: { source: entities[entity]['id'], target: 'id' + entity, label: "Issued ID"}, classes: 'autorotate' });
		}

		for (var key in links) {
			edges.push({ data: { source: links[key]['source'], target: links[key]['target'], label: links[key]['value'] }, classes: 'autorotate' });
		}

		// for ( var key in elements) {
		// 	for (var link in elements[key]['links']) {
		// 		if (!links.includes(elements[key]['links'][link]['id'])) {
		// 			links.push(elements[key]['links'][link]['id']);
		// 			edges.push({ data: { source: elements[key]['links'][link]['source']['id'], target: elements[key]['links'][link]['target']['id'], label: elements[key]['links'][link]['value'] }, classes: 'autorotate' });
		// 		}
		// 	}
		// }

		//for (var id in entities) {
		//	for (var key in entities[id]) {
		//		if (key === 'id') {
		//			continue;
		//		} else if (key === 'employed' && entities[id][key] === null) {
		//			continue;
		//		} else if (key === 'family') {
		//			for (var relationship in entities[id][key]) {
		//				//edges.push({ data: { source: id, target: entities[id][key][relationship], label: relationship}, classes: 'autorotate' });
		//			}
		//		} else if (key !== 'name' && key !== 'gender') {
		//			if (!(key in attributes)) {
		//				var testDict = {};
		//				testDict[entities[id][key]] = 1;
		//				attributes[key] = testDict;

		//				if (sharedAttributes.includes(key)) {
		//					nodes.push({ data: { id: entities[id][key], name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
		//					//edges.push({ data: { source: entities[id]['id'], target: entities[id][key] , label: key}, classes: 'autorotate' });
		//				} else { 
		//					if (attributesToShow.includes(key)) {
		//						nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
		//						//edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
		//					}
		//				}

		//			} else {
		//				if (!(entities[id][key] in attributes[key])) {
		//					attributes[key][entities[id][key]] = 1;

		//					if (sharedAttributes.includes(key)) {
		//						nodes.push({ data: { id: entities[id][key], name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
		//						//edges.push({ data: { source: entities[id]['id'], target: entities[id][key] , label: key}, classes: 'autorotate' });
		//					} else {
		//						if (attributesToShow.includes(key)) {
		//							nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
		//							//edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
		//						}
		//					}
		//				} else {
		//					if (sharedAttributes.includes(key)) {
		//						//edges.push({ data: { source: entities[id]['id'], target: entities[id][key], label: key}, classes: 'autorotate' });
		//					} else {
		//						if (attributesToShow.includes(key)) {
		//							nodes.push({ data: { id: entities[id][key] + id, name: entities[id][key], entityId: entities[id]['id'], attribute: key } });
		//							//edges.push({ data: { source: entities[id]['id'], target: entities[id][key] + id, label: key}, classes: 'autorotate' });
		//						}
		//					}
		//				}
		//			}
		//		}
		//	} }

		return { nodes, edges };
	}

	getStyle() {
		return cytoscape.stylesheet()
			.selector('core')
				.css({
					'selection-box-color': '#AAD8FF',
					'selection-box-border-color': '#8BB0D0',
					'selection-box-opacity': '0.5',
			}).selector('node')
				.css({
					'shape' : 'roundrectangle',
					'content': 'data(name)',
					'width': '150px',
					'height': '150px'
			}).selector(':selected')
				.css({
					'border-width': '6px',
					'border-color': '#AAD8FF',
					'border-opacity': '0.5',
					'background-color': '#77828C',
					'text-outline-color': '#77828C'
			}).selector('edge')
			  	.css({
			  		'curve-style': 'bezier',
			  		'target-arrow-shape': 'triangle',
			  		'source-arrow-shape': 'triangle',
			  		'label': 'data(label)',
			  		'width': 4,
			  		'line-color': '#ddd',
			  		'target-arrow-color': '#ddd',
			  		'source-arrow-color': '#ddd'
		  	}).selector('edge.family')
		  		.css({
			 	 	'source-arrow-shape': 'triangle',
			 	 	'source-arrow-color': '#ddd'
		  	}).selector('[attribute="male"]')
				.css({
					'background-image': 'http://localhost:8080/male.png',
					'background-clip': 'none',
					'border-width': '0',
					'shape' : 'roundrectangle',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('[attribute="female"]')
				.css({
					'background-image': 'http://localhost:8080/female.png',
					'background-clip': 'none',
					'border-width': '0',
					'shape' : 'roundrectangle',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('[attribute="address"]')
				.css({
					'background-image': 'http://localhost:8080/home.png',
					'background-clip': 'none',
					'border-width': '0',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('[attribute="phone"]')
				.css({
					'background-image': 'http://localhost:8080/phone.png',
					'background-clip': 'none',
					'border-width': '0',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('[attribute="ID"]')
				.css({
					'background-image': 'http://localhost:8080/id.png',
					'background-clip': 'none',
					'border-width': '0',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('[attribute="employed"]')
				.css({
					'background-image': 'http://localhost:8080/work.png',
					'background-clip': 'none',
					'border-width': '0',
					'background-fit': 'contain',
					'background-opacity': '0'
			}).selector('.highlighted')
		  		.css({
					'border-width': '12px',
					'border-color': '#AAD8FF',
					'shape' : 'roundrectangle',
					'text-outline-color': '#394855',
					'background-color': '#cfcfcf',
					'background-opacity': '1',
					'border-opacity': '0.5',
					'background-image-opacity': '0.5',
			});
	}
	
	getLayout() {
		return {
			name: this.state.cytoscapeLayout,
			directed: true,
			padding: 10
		}
	}

	changeLayout(newLayout) {
		this.setState({ cytoscapeLayout: newLayout, loaded: false, justStoredPostions: false });
	}

	showTable() {
		if (!this.state.table) {
			if (this.state.map) {
				this.setState({ size: 6, table: true, shouldChangeGraph: false, mapHeight: '450px', loaded: false, justStoredPostions: false });
			} else {
				this.savePositions();
				this.setState({ size: 6, table: true, shouldChangeGraph: true, mapHeight: '450px', loaded: false, justStoredPostions: false });
			}
		} else {
			if (this.state.map) {
				this.setState({ size: 6, table: false, mapHeight: '900px', shouldChangeGraph: false, loaded: false, justStoredPostions: false });
			} else {
				this.savePositions();
				this.setState({ size: 12, table: false, shouldChangeGraph: true, loaded: false, justStoredPostions: false });
			}
		}
	}

	showMap() {
		if (!this.state.map) {
			if (this.state.table) {
				this.setState({ size: 6, map: true, mapHeight: '450px', shouldChangeGraph: false, loaded: false, justStoredPostions: false });
			} else {
				this.setState({ size: 6, map: true, mapHeight: '900px', shouldChangeGraph: true, loaded: false, justStoredPostions: false });
			}
		} else {
			if (this.state.table) {
				this.setState({ map: false, loaded: false, shouldChangeGraph: false, justStoredPostions: false });
			} else {
				this.setState({ size: 12, map: false, shouldChangeGraph: true, loaded: false, justStoredPostions: false });
			}
		}
	}

	getData(selected) {
		const entities = this.state.entities;
		const selectedData = [];

		for (var i in selected) {
			var id = selected[i];

			var data = entities[id];
			data['id'] = id;
			selectedData.push(data);
		}

		return selectedData;
	}

	getData() {
		var data = [];

		for (var key in this.state.elements) {
			data.push(this.state.elements[key]);
		}

		return data;
	}

	storeData() {
		let positions = {};
		this.cy.nodes().map(node => {
			positions[node.id()] = node.relativePosition();
			return true;
		});

		if (this.state.justStoredPostions == false) {
			this.setState({ positions: positions, justStoredPostions: true });
		}
	}

	overwriteData(name) {
		const query = `
		mutation deleteGraph($id: Int!) {
			deleteGraph(id: $id) {
				id
			}
		  }
		`;

		const variables = {
			id: this.state.graphId,
		};

		fetch({ query, variables }).then( res => {
			let positions = [];
			this.cy.nodes().map(node => {
				var dict = {}
				var relPosition = node.relativePosition();
				dict["x"] = relPosition['x'];
				dict["y"] = relPosition['y'];
				dict['type'] = 'pair';
				dict['value'] = node.data('name');
				dict['type'] = node.data('attribute');
				dict['entityId'] = node.data('entityId');
				dict['fields'] = this.state.elements[node.id()]['fields'];
				dict['values'] = this.state.elements[node.id()]['values'];
				positions.push(dict);
				return true;
			});

			const query = `
			mutation createGraph($nodes: [NodesInput], $links: [LinksInput], $name: String!) {
				createGraph(name: $name, nodes: $nodes, links: $links) {
					name
				  	id
				  	nodes {
						id
				  	}
				}
			  }
			`;

			const variables = {
				nodes: positions,
				name: name,
				links: this.state.links
			};

			fetch({ query, variables }).then( res => {
				this.getGraphs();
			});
		});
	}

	saveData(name) {
		let positions = [];
		this.cy.nodes().map(node => {
			var dict = {}
			var relPosition = node.relativePosition();
			dict["x"] = relPosition['x'];
			dict["y"] = relPosition['y'];
			dict['type'] = 'pair';
			dict['value'] = node.data('name');
			dict['type'] = node.data('attribute');
			dict['entityId'] = node.data('entityId');
			dict['fields'] = this.state.elements[node.id()]['fields'];
			dict['values'] = this.state.elements[node.id()]['values'];
			positions.push(dict);
			return true;
		});

		const query = `
		mutation createGraph($nodes: [NodesInput], $links: [LinksInput], $name: String!) {
			createGraph(name: $name, nodes: $nodes, links: $links) {
				name
			  	id
			  	nodes {
					id
			  	}
			}
		  }
		`;

		const variables = {
			nodes: positions,
			name: name,
			links: this.state.links
		};

		fetch({ query, variables }).then( res => {
			this.getGraphs();
			if (this.state.shouldClearOnSave) {
				this.newChart();
			} else {
				this.setState({ graphLoaded: true, graphId: res.data['createGraph']['id'], graphName: res.data['createGraph']['name'] });
			}
		});
	}

	showSaveChanges() {
		this.setState({ showSaveChanges: true, shouldChangeGraph: false });
	}

	hideSaveChanges() {
		this.setState({ showSaveChanges: false, shouldChangeGraph: false });
	}

	saveChanges(shouldSave) {
		if (shouldSave == 1) {
			if (this.state.graphLoaded) {
				this.overwriteData(this.state.graphName);
			} else {
				this.setState({ showAlert: true, shouldChangeGraph: false, shouldClearOnSave: true });
			}
		} else {
			this.newChart();
		}
	}

	addEntity(data) {
		var elements = this.state.elements;
		var elementIds = this.state.elementIds;

		const node = {
			'id': parseInt(data['id']),
			'type': data['type'],
			'entityId': parseInt(data['id']),
			'value': data['value'],
			'fields': data['fields'],
			'values': data['values']
		}

		elements[node['id']] = node;
		elementIds.push(parseInt(data['id']));

		this.setState({ elements: elements, elementIds: elementIds, showAddEntity: false, shouldChangeGraph: true });
	}

	showEntity() {
		this.setState({ showAddEntity: true, shouldChangeGraph: false });
	}

	hideEntity() {
		this.setState({ showAddEntity: false, shouldChangeGraph: false });
	}

	addLink() {
		this.setState({ canAddLink: !this.state.canAddLink, shouldChangeGraph: false });
	}

	createLink(value) {
		this.savePositions();
		if (this.state.selected.length == 2) {
			const sourceId = this.state.selected[0];
			const targetId = this.state.selected[1];

			if (this.state.linkDict[sourceId] === undefined || this.state.linkDict[sourceId][targetId] === undefined) {
				var linkDict = this.state.linkDict;

				if (linkDict[sourceId] === undefined) {
					linkDict[sourceId] = { [targetId]: true }
				} else {
					linkDict[sourceId][targetId] = true
				}

				if (linkDict[targetId] === undefined) {
					linkDict[targetId] = { [sourceId]: true }
				} else {
					linkDict[targetId][sourceId] = true
				}

				const link = {
					'value': value,
					'source': sourceId,
					'target': targetId
				}

				this.setState(prevState => ({
					links: [...prevState.links, link],
					linkDict: linkDict,
					shouldUpdatePositions: true,
					shouldChangeGraph: true,
				}))
			}
		}

		// const source = {
		// 	'id': this.state.nodesToLink[0]
		// }

		// const target = {
		// 	'id': this.state.nodesToLink[1]
		// }

		// const query = `
		// mutation createLink($source: SourceInput!, $target: SourceInput!) {
		// 	createLink(value: "test", source: $source, target: $target) {
		// 	  	id
		// 	}
		//   }
		// `;

		// const variables = {
		// 	source: source,
		// 	target: target
		// };

		// fetch({ query, variables }).then( res => {
		// 	console.log(res)
		// });
	}

	savePositions() {
		var elements = this.state.elements;
		this.cy.nodes().map(node => {
			var relPosition = node.relativePosition();
			elements[node.id()]["x"] = relPosition['x'];
			elements[node.id()]["y"] = relPosition['y'];
		});

		this.setState({ elements: elements });
	}

	getPositions() {
		let positions = [];
		this.cy.nodes().map(node => {
			var dict = {}
			var relPosition = node.relativePosition();
			dict["id"] = node.id();
			dict["x"] = relPosition['x'];
			dict["y"] = relPosition['y'];
			positions.push(dict);
			return true;
		});

		return positions;
	}

	setPositions() {
		this.cy.nodes().forEach(node => {
			node.relativePosition({
				x: this.state.elements[node.id()]['x'],
				y: this.state.elements[node.id()]['y']
			});
		});
	}

	highlight() {
		var selected = this.state.selected;

		this.cy.filter(function(element, i) {
			if(element.isNode()) {
				return true;
			}

			return false;
		}).map(node => {
			if (this.state.selected.includes(node.id())) {
				node.addClass('highlighted');
			} else {
				node.removeClass('highlighted');
			}
		});
	}

	showAlert() {
		if (this.state.graphLoaded) {
			this.overwriteData(this.state.graphName);
		} else {
			this.setState({ showAlert: true, shouldChangeGraph: false });
		}
	}

	saveAs() {
		this.setState({ showAlert: true, shouldChangeGraph: false });
	}

	hideAlert() {
		this.setState({ showAlert: false, shouldChangeGraph: false });
	}

	showCreateLink() {
		this.setState({ showCreateLink: true, shouldChangeGraph: false });
	}

	hideCreateLink() {
		this.setState({ showCreateLink: false, shouldChangeGraph: false });
	}

	loadData(id) {
		const query = gql`
			query getGraphs($id: Int!) {
				graph(id: $id) {
				  name
				  nodes {
					  id
					  x
					  y
					  type
					  value
					  entityId
					  fields
					  values
					}
					links {
						value
						source
						target
					}
				}
			}
		`;

		const variables = {
			id: parseInt(id),
		};


		fetch({ query, variables }).then(res => {
			var elementIds = this.state.elementIds;
			var dict = {}
			var links = [];
			const name = res.data['graph']['name'];

			res.data['graph']['nodes'].forEach(node => {
				node['id'] = node['entityId'];
				dict[node['id']] = node;
				elementIds.push(node['id']);
			});
			
			this.setState({ elements: dict, elementIds: elementIds, links: res.data['graph']['links'], graphId: id, graphName: name, graphLoaded: true, shouldUpdatePositions: true });
		});
	}

	expand() {
		for (var i in this.state.selected) {
			const query = gql`
  	      	query entityQuery($id: Int!) {
  	      	    entity(id: $id) {
						links {
							value
							source {
								id
								type
								value
							}
							target {
								id
								type
								value
							}
						}
  	      	    }
  	      	}
			`;

			const id = parseInt(this.state.selected[i]);
  	      const variables = {
  	          id: id
  	      }

  	      fetch({ query, variables }). then( res => {
				var links = this.state.links;
				var elementIds = this.state.elementIds;
				var elements = this.state.elements;
				var linkDict = this.state.linkDict;

				for (var link in res.data['entity']) {
					for (var data in res.data['entity'][link]['links']) {
						const sourceId = parseInt(res.data['entity'][link]['links'][data]['source']['id']);
						const targetId = parseInt(res.data['entity'][link]['links'][data]['target']['id']);
						var targetNode = (id === sourceId) ? res.data['entity'][link]['links'][data]['target'] : res.data['entity'][link]['links'][data]['source'];
						targetNode = {
							'id': parseInt(targetNode['id']),
							'type': targetNode['type'],
							'entityId': parseInt(targetNode['id']),
							'value': targetNode['value']
						}

						if (!elementIds.includes(targetNode['id'])) {
							elements[targetNode['id']] = targetNode;
							elementIds.push(targetNode['id']);

							const linkToNode = {
								'value': res.data['entity'][link]['links'][data]['value'],
								'source': parseInt(sourceId),
								'target': parseInt(targetId)
							}


							if (linkDict[sourceId] === undefined) {
								linkDict[sourceId] = { [targetId]: true };
							} else {
								linkDict[sourceId][targetId] = true;
							}

							linkDict[targetId] = { [sourceId]: true };
							links.push(linkToNode)
						} else {
							if (linkDict[sourceId] === undefined) {
								const linkToNode = {
									'value': res.data['entity'][link]['links'][data]['value'],
									'source': parseInt(sourceId),
									'target': parseInt(targetId)
								}

								links.push(linkToNode)
								linkDict[sourceId] = { [targetId]: true };

								if (linkDict[targetId] === undefined) {
									linkDict[targetId] = { [sourceId]: true };
								} else {
									linkDict[targetId][sourceId] = true;
								}
							} else if (linkDict[sourceId][targetId] === undefined) {
								const linkToNode = {
									'value': res.data['entity'][link]['links'][data]['value'],
									'source': parseInt(sourceId),
									'target': parseInt(targetId)
								}

								linkDict[sourceId][targetId] = true;

								if (linkDict[targetId] === undefined) {
									linkDict[targetId] = { [sourceId]: true };
								} else {
									linkDict[targetId][sourceId] = true;
								}

								links.push(linkToNode)
							}
						}
					}
				}
				console.log(linkDict);

				this.setState({
					elements: elements,
					linkDict: linkDict,
					elementIds: elementIds,
					links: links,
					shouldChangeGraph: true,
				})
			});
		}
	}

	editNode() {
		this.setState({ showEditNode: true, shouldChangeGraph: false });
	}

	hideEditNode(nodeData) {
		this.setState({ showEditNode: false, shouldChangeGraph: false, elements: nodeData });
	}

	newChart() {
		this.setState({
			elements: {},
			elementIds: [],
			links: [],
			linkDict: {},
			graphId: 0,
			graphName: '',
			shouldUpdatePositions: false,
			shouldClearOnSave: false,
			shouldChangeGraph: true
		})
	}

	loadElements(data) {
		var nodes = [];
		var edges = [];

		for (var node in data) {

		}
	}

	getGraphs() {
		const query = gql`
		   query graphsQuery {
			 graphs {
				 id
				 name
				}
		   }
		`;

		fetch({ query: query }).then(res => {
			this.setState({ graphs: res.data['graphs'] })
		});
	}

	tableMadeChange(selected) {
		this.setState({ selected: selected, shouldChangeGraph: false, shouldHighlight: true });
	}

	render() {
		var data = this.getData(this.state.selected);
		var graphs = this.state.graphs;

		return (
			<Grid style={{ height: '100vh', width: '100%' }}>
				<SaveAlert shouldShow={this.state.showAlert} callback={this.hideAlert} saveData={this.saveData} />
				<AddEntity shouldShow={this.state.showAddEntity} callback={this.hideEntity} saveData={this.addEntity} />
				<NodeData shouldShow={this.state.showEditNode} callback={this.hideEditNode} nodeId={this.state.selected[0]} nodeData={this.state.elements} />
				<CreateLink shouldShow={this.state.showCreateLink} callback={this.hideCreateLink} saveData={this.createLink} />
				<SaveChanges shouldShow={this.state.showSaveChanges} callback={this.hideSaveChanges} saveData={this.saveChanges} />

				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#home"> Lattyce </a>
						</Navbar.Brand>
					</Navbar.Header>

					<Nav>
						<NavDropdown eventKey={1} title="Layout" id="basic-nav-dropdown">
							<MenuItem eventKey={1.1} onClick={() => this.changeLayout('grid')}>Grid</MenuItem>
							<MenuItem eventKey={1.2} onClick={() => this.changeLayout('breadthfirst')}>Breadth First</MenuItem>
							<MenuItem eventKey={1.3} onClick={() => this.changeLayout('cose')}>Cose</MenuItem>
							<MenuItem eventKey={1.3} onClick={() => this.changeLayout('concentric')}>Concentric</MenuItem>
							<MenuItem eventKey={1.3} onClick={() => this.changeLayout('circle')}>Circle</MenuItem>
						</NavDropdown>

						<NavDropdown eventKey={17} title="View" id="view">
							<MenuItem eventKey={2} onClick={this.showTable}>Table</MenuItem>
							<MenuItem eventKey={3} onClick={this.showMap}>Map</MenuItem>
						</NavDropdown>

						<NavDropdown eventKey={18} title="Edit" id="edit">
							<MenuItem eventKey={4} onClick={this.showAlert}>Save</MenuItem>
							<MenuItem eventKey={4} onClick={this.saveAs}>Save As</MenuItem>
							<MenuItem eventKey={5} onClick={this.showEntity}>Add Entity</MenuItem>
							<MenuItem eventKey={6} onClick={this.showCreateLink}>Add Link</MenuItem>
							<MenuItem eventKey={7} onClick={this.expand}>Expand</MenuItem>
							<MenuItem eventKey={8} onClick={this.newChart}>New Chart</MenuItem>
							<MenuItem eventKey={9} onClick={this.editNode}>Edit Node</MenuItem>
						</NavDropdown>


						<NavDropdown eventKey={5} title="Load" id="basic-nav-dropdown">
							{ graphs.map( (graph, i) => {
								return (
									<MenuItem key={ 5 + .1 * i } eventKey={ 5 + .1 * i } onClick={ () => this.loadData(graph.id) } >{ graph.name }</MenuItem>
								)
							}) }
						</NavDropdown>
					</Nav>
				</Navbar>

				<ul className="nav nav-tabs">
					<li role="presentation" className="active" >
						<a href="#">
							<button className="close closeTab" type="button" onClick={this.showSaveChanges} >
								×
							</button>
							{this.state.graphName === '' ? 'Undefined' : this.state.graphName}
						</a>
					</li>
				</ul>

				<Row style={{ width: '100%' }}>
					{/* <Col sm={this.state.size}> */}
					<Col sm={this.state.size}>
						<CytoContainer elements={this.getElements()} cytoRef={(cy) => {this.cyRef(cy)}} layout={this.getLayout()} style={this.getStyle()} table={this.state.table} newData={this.state.newData} shouldChangeGraph={this.state.shouldChangeGraph} />
					</Col>

					{/* <Col sm={this.state.size} hidden={!this.state.map}> */}
					<Col sm={this.state.size} hidden={!this.state.map && !this.state.table}>
						<Row hidden={!this.state.map}>
							<Map entities={this.state.entities} height={this.state.mapHeight} />
						</Row>
						<Row hidden={!this.state.table}>
							<EntityTable data={this.getData()}  selected={this.state.selected} callback={this.tableMadeChange} />
						</Row>
					</Col>

				</Row>
			</Grid>
		);
	}

	cyRef(cy) {
		this.cy = cy;

		//if (this.cy.nodes().length !== 0) {
		//	this.storeData();
		//}


		this.highlight();

		if (this.state.shouldUpdatePositions) {
			this.setPositions();
		}

		cy.on('tap', 'node', function (evt) {
			var node = evt.target;
			var id = node.id();

			if (!this.state.selected.includes(id)) {
				this.setState(prevState => ({
					selected: [...prevState.selected, id],
					shouldChangeGraph: false,
					shouldHighlight: true
				}))
			} else {
				var temp = this.state.selected;
				var index = temp.indexOf(id);
				temp.splice(index, 1);
				this.setState({ selected: temp, shouldChangeGraph: false, shouldHighlight: true });
			}
		}.bind(this));
	}
}

export default Graph;