import React from 'react';
import { Table } from "react-bootstrap";
import './table.css';

class EntityTable extends React.Component {
	constructor(props) {
		super(props)

		this.state = { selected: this.props.selected, changeParent: false, active: 0, type: '' }

		this.rowclick = this.rowclick.bind(this);
		this.tabClick = this.tabClick.bind(this);
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.selected !== this.props.selected) {
			this.setState({ selected: this.props.selected })
		} else if (this.state.changeParent === true) {
			this.setState({ changeParent: false });
			this.props.callback(this.state.selected);
		}
	}

	rowclick(e) {
		const id = e.currentTarget.getAttribute('data');

		if (this.state.selected.includes(id)) {
			var temp = this.state.selected;
			var index = temp.indexOf(id);
			temp.splice(index, 1);
			this.setState({ selected: temp, changeParent: true });
		} else {
			this.setState(prevState => ({
				selected: [...prevState.selected, id],
				changeParent: true,
			}));
		}
	}

	tabClick(e) {
		var value = e.currentTarget.getAttribute('value')
		var index = e.currentTarget.getAttribute('index')

		this.setState({ active: index, type: value });
		this.props.callback(this.state.selected);
	}

	render() {
		const data = this.props.data;
		var types = {};
		var setType = false;
		var type = '';
		var typeCount = {};

		for (var i in data) {
			if (setType === false) {
				type = data[i]['type'];
				setType = true;
			}

			if (types[data[i]['type']] === undefined) {
				types[data[i]['type']] = [data[i]]
				typeCount[data[i]['type']] = 0;
			} else {
				types[data[i]['type']].push(data[i]);
			}
		}

		type = this.state.type === '' ? type : this.state.type;


		return (
			<div id="table">
				<ul className="nav nav-tabs" id="table-tabs">
				{
					Object.keys(types).map((eType, i) => {
						return (
							<li key={i} role="presentation" onClick={this.tabClick} value={eType} index={i} className={type === eType ? 'active active-tab' : 'non-active'}><a href="#">{eType}</a></li>
						)
					})
				}
				</ul>

				<Table striped hover>
					<thead>
						<tr>
							<th>ID #</th>
							<th>Value</th>
							<th>Type</th>
						</tr>
					</thead>

					<tbody>
						{ data.map((row, i) => {
							if (row.type === type) {
								var typei = typeCount[row.type];
								typeCount[row.type] = typeCount[row.type] + 1;
								return (
									<tr id={typei % 2 === 0 ? 'data-row-even' : 'data-row-odd' } key={row.id + row.id} index={i} data={row.id} onClick={this.rowclick} className={this.state.selected.includes(String(row.id)) ? 'active' : ''}>
										<td key={row.id}>{row.id}</td>
										<td key={row.value}>{row.value}</td>
										<td key={row.type}>{row.type}</td>
									</tr>
								)
							}
						}) }
					</tbody>
				</Table>
			</div>
		)
	}
}

export default EntityTable;