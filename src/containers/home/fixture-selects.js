import React, { Component } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { MultiSelect, Select } from "@blueprintjs/select";
import { connect } from "react-redux";

class FixtureSelectPre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionName: null
    };

    this.cb = this.cb.bind(this);

    this.elementList = [];
  }

  componentWillReceiveProps(nextProps) {
    const pName = this.props.propertyName;
    const currentFixture = this.props.fixtures[pName];
    const nextFixture = nextProps.fixtures ? nextProps.fixtures[pName] : null;

    if (currentFixture === nextFixture) {
      return;
    }

    if (!nextFixture) {
      this.elementList = [];
      return;
    }

    if (Array.isArray(nextFixture)) {
      this.elementList = nextFixture.map((t, i) => [i, t]);
    } else {
      this.elementList = Object.entries(nextFixture);
    }
  }

  cb([key, value]) {
    this.setState({ selectionName: value });
    this.props.callback(key);
  }

  static valuePredicate(pred, [index, value]) {
    return !pred ? true : value.indexOf(pred.trim()) > -1;
  }

  static renderItem([idx, value], { handleClick, modifiers }) {
    if (modifiers.filtered) {
      return null;
    }

    if (!modifiers.matchesPredicate) {
      return null;
    }

    return (
      <MenuItem key={idx} label={idx} text={value} onClick={handleClick} />
    );
  }

  render() {
    const btnText = this.state.selectionName || this.props.displayName;

    return (
      <label className="pt-label fixture-select">
        {this.props.displayName}
        <Select
          items={this.elementList}
          onItemSelect={this.cb}
          noResults={<MenuItem key={0} disabled={true} text="No results." />}
          itemPredicate={FixtureSelectPre.valuePredicate}
          itemRenderer={FixtureSelectPre.renderItem}
        >
          <Button
            className={"pt-align-left"}
            // This causes an error/warning in React!
            // alignText={Alignment.LEFT}
            text={btnText}
            rightIcon="caret-down"
          />
        </Select>
      </label>
    );
  }
}

class FixtureMultiSelectPre extends FixtureSelectPre {
  constructor(props) {
    super(props);

    this.state = {
      selected: []
    };

    this.selectedIndicies = new Set();

    this.toggleProp = this.toggleProp.bind(this);
  }

  toggleProp(index) {
    if (this.selectedIndicies.has(index)) {
      this.selectedIndicies.delete(index);
    } else {
      this.selectedIndicies.add(index);
    }

    const selected = Array.from(this.selectedIndicies);
    this.setState({ selected });

    return selected;
  }

  cb([index]) {
    this.props.callback(this.toggleProp(index));
  }

  render() {
    const fixture = this.props.fixtures[this.props.propertyName];

    return (
      <label className="pt-label fixture-multi-select">
        {this.props.displayName}
        <MultiSelect
          itemPredicate={FixtureMultiSelectPre.valuePredicate}
          itemRenderer={FixtureMultiSelectPre.renderItem}
          items={this.elementList}
          noResults={<MenuItem key={0} disabled={true} text="No results." />}
          onItemSelect={this.cb}
          tagRenderer={idx => <span data-index={idx}>{fixture[idx]}</span>}
          tagInputProps={{
            onRemove: value => {
              this.cb([value.props["data-index"]]);
            }
          }}
          selectedItems={this.state.selected}
        />
      </label>
    );
  }
}

const connectState = state => {
  return {
    fixtures: state.fixtures
  };
};

export const FixtureSelect = connect(connectState)(FixtureSelectPre);

export const FixtureMultiSelect = connect(connectState)(FixtureMultiSelectPre);
