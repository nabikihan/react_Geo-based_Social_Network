import React, { Component } from 'react';
import { Form, Label } from 'semantic-ui-react';
import Script from 'react-load-script';
import PlacesAutocomplete from 'react-places-autocomplete';

//这就是让autocomplete的下拉菜单不透明，把后面的表单选项遮住。
const styles = {
    autocompleteContainer: {
        zIndex: 1000
    }
}


// scriptLoaded： flag，用来标记Google map script是否被LOAD
class PlaceInput extends Component {
    state = {
        scriptLoaded: false
    };

    handleScriptLoaded = () => this.setState({ scriptLoaded: true });

    render() {
        const {
            input,
            width,
            onSelect,
            placeholder,
            options,
            meta: { touched, error }
        } = this.props;
        return (
            <Form.Field error={touched && !!error} width={width}>
                <Script
                    url="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSw65gIWzeV2Em-taXsJZua2pudKI56dw&libraries=places"
                    onLoad={this.handleScriptLoaded}
                />

                {/*// autocomplete，就是下拉框给你一些location选项，你不用都type全你的地址*/}
                {this.state.scriptLoaded && (
                    <PlacesAutocomplete
                        inputProps={{ ...input, placeholder }}
                        options={options}
                        onSelect={onSelect}
                        styles={styles}
                    />
                )}
                {touched &&
                error && (
                    <Label basic color="red">
                        {error}
                    </Label>
                )}
            </Form.Field>
        );
    }
}

export default PlaceInput;