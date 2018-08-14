import React from 'react';
import { Table } from "react-bootstrap";

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

		for (var i in data) {
			if (setType === false) {
				type = data[i]['type'];
				setType = true;
			}

			if (types[data[i]['type']] === undefined) {
				types[data[i]['type']] = [data[i]]
			} else {
				types[data[i]['type']].push(data[i]);
			}
		}

		type = this.state.type === '' ? type : this.state.type;

		return (
			<div>
				<ul className="nav nav-tabs">
				{
					Object.keys(types).map((type, i) => {
						return (
							<li key={i} role="presentation" onClick={this.tabClick} value={type} index={i} className={this.state.active === i ? 'active' : ''}><a href="#">{type}</a></li>
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
								return (
									<tr key={row.id + row.id} index={i} data={row.id} onClick={this.rowclick} className={this.state.selected.includes(String(row.id)) ? 'active' : ''}>
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