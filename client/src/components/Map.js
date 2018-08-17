import React from 'react';
import GoogleMapReact from 'google-map-react';
import Geocode from 'react-geocode';

const AnyReactComponent = ({ text }) => (
    <div style={{
        backgroundImage: 'url(' + require('../icons/home.png') + ')',
        backgroundSize: 'contain',
        width: '50px',
        height: '50px',
        backgroundClip: 'none',
        transform: 'translate(-50%, -50%)'
      }}>
    </div>
);

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = { lat: 38.79768, lng: -77.400763, addresses: [], entityCount: 0 };

        this.getAddresses = this.getAddresses.bind(this);
    }
    static defaultProps = {
        center: {
            lat: 59.85,
            lng: 30.33
        },
        zoom: 11
    };

    componentDidUpdate(prevProps, prevState) { 
        if (Object.keys(this.props.entities).length !== this.state.entityCount) {
            this.setState({ entityCount: Object.keys(this.props.entities).length })
            this.getAddresses(this.props.entities);
        }
    }

	//getEntities() {
	//	return {
	//		1: {
	//			'Name': 'John Short',
	//			'firstName': 'John',
	//			'lastName': 'Short',
	//			'gender': 'male',
	//			'family': {
	//				'brother': 4
	//			},
	//			'Employed': 'Global Info Tek, Inc.',
	//			'DoB': '11/01/1997',
	//			'Address': '6705 Cedar View Court Clifton, Virginia, 20124',
	//			'Phone': '7034980832',
	//		},
	//		
	//		4: { 'Name': 'Matt Short',
	//			'firstName': 'Matt',
	//			'lastName': 'Short',
	//			'gender': 'male',
	//			'family': {
	//				'brother': 1
	//			},
	//			'DoB': '07/28/2001',
	//			'Address': '6705 Cedar View Court Clifton, Virginia, 20124',
	//			'Phone': '7034980834',
	//		},

	//		2: {
	//			'Name': 'Peter Myers',
	//			'firstName': 'Peter',
	//			'lastName': 'Myers',
	//			'gender': 'male',
	//			'family': {
	//			},
	//			'Employed': 'Global Info Tek, Inc.',
	//			'DoB': '10/09/1997',
	//			'Address': '297 Scott Street Westbury, New York, 11590',
	//			'Phone': '7034980833',
	//		},

	//		3: {
	//			'Name': 'Scott Sterling',
	//			'firstName': 'Scott',
	//			'lastName': 'Sterling',
	//			'gender': 'male',
	//			'family': {
	//				'Wife': 5
	//			},
	//			'Employed': 'Google',
	//			'DoB': '05/06/1994',
	//			'Address': '2387 Stadium Drive Framingham, Massachusetts, 01701',
	//			'Phone': '5089046624',
	//		},

	//		5: {
	//			'Name': 'Samantha Sterling',
	//			'firstName': 'Samantha',
	//			'lastName': 'Sterling',
	//			'gender': 'female',
	//			'family': {
	//				'Husband': 3
	//			},
	//			'Employed': 'Google',
	//			'DoB': '05/06/1994',
	//			'Address': '2387 Stadium Drive Framingham, Massachusetts, 01701',
	//			'Phone': '5089046624',
	//		}
	//	}
	//}

    getAddresses(entities) {
        if (entities !== undefined) {
            var addresses = {}

            for (var entity in entities) {
                if (entities[entity]['type'] === 'address') {
                    const addy = entities[entity]['value'];

                    if (addresses[addy] === undefined) {
                        const l =[entity];
                        addresses[addy] = l;
                    } else {
                        addresses[addy].push(entity);
                    }
                }
            }

            for (var key in addresses) {
                Geocode.fromAddress(key).then(
                    response => {
                        const { lat, lng } = response.results[0].geometry.location;
                        this.setState(prevState => ({
                            addresses: [...prevState.addresses, [lat, lng]]
                        }))

                        this.setState({ lat: this.state.addresses[0][0], lng: this.state.addresses[0][1] });
                    },
                    error => {
                      console.error(error);
                    }
                );
            }
        
            // this.props.callback();
        }
    }

    render() {
        const Markers = this.state.addresses.map(addy => (
            <AnyReactComponent
                key={Math.random()}
                lat={addy[0]}
                lng={addy[1]}
            />
        ));

        return (
            <div style={{ height: this.props.height, width: '100%' }}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: 'AIzaSyA470KWxMoVnZ5SfW7uj3vqmU5qzY97QBU'}}
                    defaultCenter={{ lat: this.state.lat, lng: this.state.lng }}
                    defaultZoom={this.props.zoom}
                >
                    { Markers }
                </GoogleMapReact>

            </div>
        )
    }
}

export default Map;