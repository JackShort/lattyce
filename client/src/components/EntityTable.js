import React from 'react';
import { Table } from "react-bootstrap";

class EntityTable extends React.Component {
    constructor(props) {
        super(props)

        this.state = { selected: this.props.selected, changeParent: false}

        this.rowclick = this.rowclick.bind(this);
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

    render() {
        const data = this.props.data;

        return (
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
            			return (
            				<tr key={row.id + row.id} index={i} data={row.id} onClick={this.rowclick} className={this.state.selected.includes(String(row.id)) ? 'active' : ''}>
            					<td key={row.id}>{row.id}</td>
            					<td key={row.value}>{row.value}</td>
            					<td key={row.type}>{row.type}</td>
            				</tr>
            			)
            		}) }
            	</tbody>
            </Table>
        )
    }
}

export default EntityTable;