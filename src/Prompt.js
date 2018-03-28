import React, { Component } from 'react';
import {
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import styles from './styles';

const disabledOpacity = 0.5;

export default class Prompt extends Component {
  /* static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool,
    modal: PropTypes.bool,
    defaultValue: PropTypes.string,
    placeholder: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    cancelText: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    borderColor: PropTypes.string,
    promptStyle: PropTypes.object,
    titleStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    buttonTextStyle: PropTypes.object,
    submitButtonStyle: PropTypes.object,
    submitButtonTextStyle: PropTypes.object,
    cancelButtonStyle: PropTypes.object,
    cancelButtonTextStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    textInputProps: PropTypes.object,
}; */

  static defaultProps = {
    visible: false,
    modal: false,
    defaultValue: '',
    cancelText: 'Cancel',
    submitText: 'OK',
    borderColor:'#ccc',
    promptStyle: {},
    titleStyle: {},
    buttonStyle: {},
    buttonTextStyle: {},
    submitButtonStyle: {},
    submitButtonTextStyle: {},
    cancelButtonStyle: {},
    cancelButtonTextStyle: {},
    inputStyle: {},
    shouldConfirmInput: true,
    onChangeText: () => {},
  };

  state = {
    value: '',
    confirmValue: '',
    visible: false,
    disable: true,
    submitOpacity: disabledOpacity,
  };

  componentWillMount() {
    this.processProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.processProps(nextProps);
  }

  processProps(props) {
      const { visible, defaultValue, shouldConfirm } = props;
      const disable = !defaultValue || shouldConfirm;
      this.setState({
          visible,
          disable,
          value: defaultValue,
          confirmValue: '',
          submitOpacity: disable ? disabledOpacity : 1.0,
      });
  }

  checkSubmit() {

  }

  _onChangeText = (value) => {
    this.setState({ value });
    this.props.onChangeText(value);

    this.props.shouldConfirm
      ? (
        value === this.state.confirmValue && value !== ''
          ? (
            this.setState({ disable: false, submitOpacity: 1 })
          )
          : (
            this.setState({ disable: true, submitOpacity: disabledOpacity })
          )
      )
      : (
        value !== ''
          ? (
            this.setState({ disable: false, submitOpacity: 1 })
          )
          : (
            this.setState({ disable: true, submitOpacity: disabledOpacity })
          )
    );

  };

_onChangeConfirmText = (confirmValue) => {
  this.setState({ confirmValue });

    confirmValue === this.state.value && confirmValue !== ''
      ? (
        this.setState({ disable: false, submitOpacity: 1 })
      )
      : (
        this.setState({ disable: true, submitOpacity: disabledOpacity })
      );
};

  _onSubmitPress = () => {
    const { value } = this.state;
    this.props.onSubmit(value);
  };

  _onCancelPress = () => {
    this.props.onCancel();
  };

  close = () => {
    this.setState({visible: false});
  };

  _renderDialog = () => {
    const {
      title,
      placeholder,
      confirmPlaceholder,
      shouldConfirm,
      defaultValue,
      cancelText,
      submitText,
      borderColor,
      promptStyle,
      titleStyle,
      buttonStyle,
      buttonTextStyle,
      submitButtonStyle,
      submitButtonTextStyle,
      cancelButtonStyle,
      cancelButtonTextStyle,
      inputStyle
    } = this.props;
    return (
      <View style={styles.dialog} key="prompt">
        <View style={styles.dialogOverlay}/>
        <View style={[styles.dialogContent, { borderColor }, promptStyle]}>
          <View style={[styles.dialogTitle, { borderColor }]}>
            <Text style={[styles.dialogTitleText, titleStyle]}>
              { title }
            </Text>
          </View>
          <View style={styles.dialogBody}>
            <TextInput
              style={[styles.dialogInput, inputStyle]}
              defaultValue={defaultValue}
              onChangeText={this._onChangeText}
              placeholder={placeholder}
              autoFocus={true}
              underlineColorAndroid="transparent"
              {...this.props.textInputProps} />
          {shouldConfirm && (
            <TextInput
              style={[styles.dialogInput, inputStyle]}
              defaultValue={defaultValue}
              onChangeText={this._onChangeConfirmText}
              placeholder={confirmPlaceholder}
              underlineColorAndroid="transparent"
              {...this.props.textInputProps} />
          )}

          </View>
          <View style={[styles.dialogFooter, { borderColor }]}>
            <TouchableWithoutFeedback onPress={this._onCancelPress}>
              <View style={[styles.dialogAction, buttonStyle, cancelButtonStyle]}>
                <Text style={[styles.dialogActionText, buttonTextStyle, cancelButtonTextStyle]}>
                  {cancelText}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this._onSubmitPress} disabled={this.state.disable}>
              <View style={[styles.dialogAction, buttonStyle, submitButtonStyle]}>
                <Text style={[{opacity: this.state.submitOpacity}, styles.dialogActionText, buttonTextStyle, submitButtonTextStyle]}>
                  {submitText}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  };

  renderContainer() {
      return (<View style={styles.container}>
          {this._renderDialog()}
      </View>);
  }

  render() {
    if (!this.props.visible) {
      return null;
    }
    if (Platform.OS === 'web' || !this.props.modal) {
        return this.renderContainer();
    }
    return (
      <Modal onRequestClose={() => this.close()} transparent={true} visible={this.props.visible}>
        {this._renderDialog()}
      </Modal>
    );
  }
};
