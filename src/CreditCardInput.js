import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactNative, {
  NativeModules,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  ViewPropTypes,
} from "react-native";
import { Icon } from "native-base";

import CreditCard from "./CardView";
import CCInput from "./CCInput";
import CardNumberInput from "./CardNumberInput";
import { InjectedProps } from "./connectToState";

const s = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  form: {
    marginTop: 20,
  },
  inputContainer: {
    marginLeft: 20,
  },
  inputLabel: {
    fontWeight: "bold",
  },
  input: {
    height: 40,
  },
});

const CVC_INPUT_WIDTH = 70;
const EXPIRY_INPUT_WIDTH = CVC_INPUT_WIDTH;
const CARD_NUMBER_INPUT_WIDTH_OFFSET = 40;
const CARD_NUMBER_INPUT_WIDTH = Dimensions.get("window").width - EXPIRY_INPUT_WIDTH - CARD_NUMBER_INPUT_WIDTH_OFFSET;
const NAME_INPUT_WIDTH = CARD_NUMBER_INPUT_WIDTH;
const PREVIOUS_FIELD_OFFSET = 40;
const POSTAL_CODE_INPUT_WIDTH = 120;

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardInput extends Component {
  static propTypes = {
    ...InjectedProps,
    labels: PropTypes.object,
    placeholders: PropTypes.object,

    labelStyle: Text.propTypes.style,
    inputStyle: Text.propTypes.style,
    inputContainerStyle: ViewPropTypes.style,

    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    cardImageFront: PropTypes.number,
    cardImageBack: PropTypes.number,
    cardScale: PropTypes.number,
    cardFontFamily: PropTypes.string,
    cardBrandIcons: PropTypes.object,

    allowScroll: PropTypes.bool,

    additionalInputsProps: PropTypes.objectOf(PropTypes.shape(TextInput.propTypes)),
  };

  static defaultProps = {
    cardViewSize: {},
    labels: {
      name: "CARDHOLDER'S NAME",
      number: "CARD NUMBER",
      expiry: "EXPIRY",
      cvc: "CVC/CCV",
      postalCode: "POSTAL CODE",
    },
    placeholders: {
      name: "Full Name",
      number: "1234 5678 1234 5678",
      expiry: "MM/YY",
      cvc: "CVC",
      postalCode: "34567",
    },
    inputContainerStyle: {
      borderBottomWidth: 1,
      borderBottomColor: "black",
    },
    validColor: "",
    invalidColor: "red",
    placeholderColor: "gray",
    allowScroll: false,
    additionalInputsProps: {},
  };

  componentDidMount = () => this._focus(this.props.focused);

  componentWillReceiveProps = newProps => {
    if (this.props.focused !== newProps.focused) this._focus(newProps.focused);
  };

  _focus = field => {
    if (!field) return;

    const scrollResponder = this.refs.Form.getScrollResponder();
    const nodeHandle = ReactNative.findNodeHandle(this.refs[field]);

    NativeModules.UIManager.measureLayoutRelativeToParent(nodeHandle,
      e => { throw e; },
      x => {
        scrollResponder.scrollTo({ x: Math.max(x - PREVIOUS_FIELD_OFFSET, 0), animated: true });
        this.refs[field].focus();
      });
  }

  _inputProps = field => {
    const {
      inputStyle, labelStyle, validColor, invalidColor, placeholderColor,
      placeholders, labels, values, status,
      onFocus, onChange, onBecomeEmpty, onBecomeValid,
      additionalInputsProps,
    } = this.props;

    return {
      inputStyle: [s.input, inputStyle],
      labelStyle: [s.inputLabel, labelStyle],
      validColor, invalidColor, placeholderColor,
      ref: field, field,

      label: labels[field],
      placeholder: placeholders[field],
      value: values[field],
      status: status[field],

      onFocus, onChange, onBecomeEmpty, onBecomeValid,

      additionalInputProps: additionalInputsProps[field],
    };
  };

  render() {
    const {
      cardImageFront, cardImageBack, inputContainerStyle,
      values: { number, expiry, cvc, name, type }, focused,
      allowScroll, requiresName, requiresCVC, requiresPostalCode,
      cardScale, cardFontFamily, cardBrandIcons,
    } = this.props;

    return (
      <View style={s.container}>
        <CreditCard focused={focused}
          brand={type}
          scale={cardScale}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc} />
        <ScrollView ref="Form"
          keyboardShouldPersistTaps="always"
          scrollEnabled={allowScroll}
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%', marginTop: 20, paddingHorizontal: 4, }}
        >
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            width: "100%",
            justifyContent: "flex-start",
            marginTop: 20
          }}>
            <Icon
              name="ios-alert"
              type="Ionicons"
              style={{ fontSize: 18 }}
            />
            <Text style={{ marginLeft: 10, marginTop: 1 }}>Card Number</Text>
          </View>
          <CardNumberInput
            placeholder="1234 5678 1234 5678"
            placeholderColor="gray"
            ref={this._inputProps("number").ref}
            status={this._inputProps("number").status}
            validColor={this._inputProps("number").validColor}
            value={this._inputProps("number").value}
            keyboardType="numeric"
            additionalInputProps={undefined}
            field="number"
            inputStyle={[{ height: 14 }, undefined]}
            invalidColor="red"
            labelStyle={this._inputProps("number").labelStyle}
            onChange={this._inputProps("number").onChange}
            onFocus={this._inputProps("number").onFocus}
            onBecomeValid={this._inputProps("number").onBecomeValid}
            onBecomeEmpty={this._inputProps("number").onBecomeEmpty}
            containerStyle={{
              marginTop: 10,
              padding: 15,
              borderWidth: 1,
              backgroundColor: "white",
              borderColor: "#939598",
              borderRadius: 10,
              fontFamily: 'Montserrat-Regular'
            }} />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            width: "100%",
            justifyContent: "flex-start",
            marginTop: 20
          }}>
            <Icon
              name="ios-calendar"
              type="Ionicons"
              style={{ fontSize: 18 }}
            />
            <Text style={{ marginLeft: 10, marginTop: 1 }}>Expiry Date</Text>
          </View>
          <CCInput
            inputStyle={[{ height: 14 }, undefined]}
            additionalInputProps={this._inputProps("expiry").additionalInputProps}
            field={this._inputProps("expiry").field}
            invalidColor={this._inputProps("expiry").invalidColor}
            onBecomeEmpty={this._inputProps("expiry").onBecomeEmpty}
            onBecomeValid={this._inputProps("expiry").onBecomeValid}
            onChange={this._inputProps("expiry").onChange}
            onFocus={this._inputProps("expiry").onFocus}
            placeholder={this._inputProps("expiry").placeholder}
            placeholderColor={this._inputProps("expiry").placeholderColor}
            ref={this._inputProps("expiry").ref}
            status={this._inputProps("expiry").status}
            validColor={this._inputProps("expiry").validColor}
            value={this._inputProps("expiry").value}
            keyboardType="numeric"
            containerStyle={{
              marginTop: 10,
              padding: 15,
              borderWidth: 1,
              backgroundColor: "white",
              borderColor: "#939598",
              borderRadius: 10,
              fontFamily: 'Montserrat-Regular'
            }} />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            width: "100%",
            justifyContent: "flex-start",
            marginTop: 20
          }}>
            <Icon
              name="md-lock"
              type="Ionicons"
              style={{ fontSize: 18 }}
            />
            <Text style={{ marginLeft: 10, marginTop: 1 }}>CCV Number</Text>
          </View>
          <CCInput
            inputStyle={[{ height: 14 }, undefined]}
            additionalInputProps={this._inputProps("cvc").additionalInputProps}
            field={this._inputProps("cvc").field}
            invalidColor={this._inputProps("cvc").invalidColor}
            onBecomeEmpty={this._inputProps("cvc").onBecomeEmpty}
            onBecomeValid={this._inputProps("cvc").onBecomeValid}
            onChange={this._inputProps("cvc").onChange}
            onFocus={this._inputProps("cvc").onFocus}
            placeholder={this._inputProps("cvc").placeholder}
            placeholderColor={this._inputProps("cvc").placeholderColor}
            ref={this._inputProps("cvc").ref}
            status={this._inputProps("cvc").status}
            validColor={this._inputProps("cvc").validColor}
            value={this._inputProps("cvc").value}
            keyboardType="numeric"
            containerStyle={{
              marginTop: 10,
              padding: 15,
              borderWidth: 1,
              backgroundColor: "white",
              borderColor: "#939598",
              borderRadius: 10,
              fontFamily: 'Montserrat-Regular'
            }} />
          <View style={{
            display: 'flex',
            flexDirection: 'row',
            width: "100%",
            justifyContent: "flex-start",
            marginTop: 20
          }}>
            <Icon
              name="person"
              type="MaterialIcons"
              style={{ fontSize: 18 }}
            />
            <Text style={{ marginLeft: 10, marginTop: 1 }}>Card Holder Name</Text>
          </View>
          <CCInput
            inputStyle={[{ height: 14 }, undefined]}
            additionalInputProps={this._inputProps("name").additionalInputProps}
            field={this._inputProps("name").field}
            invalidColor={this._inputProps("name").invalidColor}
            onBecomeEmpty={this._inputProps("name").onBecomeEmpty}
            onBecomeValid={this._inputProps("name").onBecomeValid}
            onChange={this._inputProps("name").onChange}
            onFocus={this._inputProps("name").onFocus}
            placeholder={this._inputProps("name").placeholder}
            placeholderColor={this._inputProps("name").placeholderColor}
            ref={this._inputProps("name").ref}
            status={this._inputProps("name").status}
            validColor={this._inputProps("name").validColor}
            value={this._inputProps("name").value}
            containerStyle={{
              marginTop: 10,
              padding: 15,
              borderWidth: 1,
              backgroundColor: "white",
              borderColor: "#939598",
              borderRadius: 10,
              fontFamily: 'Montserrat-Regular'
            }} />
          {requiresPostalCode &&
            <CCInput {...this._inputProps("postalCode")}
              keyboardType="numeric"
              containerStyle={[s.inputContainer, inputContainerStyle, { width: POSTAL_CODE_INPUT_WIDTH }]} />}
        </ScrollView>
      </View>
    );
  }
}
