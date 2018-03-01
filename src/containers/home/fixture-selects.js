import React, { Component } from "react";
import { Button, MenuItem } from "@blueprintjs/core";
import { MultiSelect, Select } from "@blueprintjs/select";
import { connect } from "react-redux";

class FixtureSelectBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionName: null
    };

    this.cb = this.cb.bind(this);

    this.elementList = [];

    this.insertBlank = true;
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

    this.elementList = Object.entries(nextFixture);

    if (this.insertBlank) {
      this.elementList.unshift([0, "None"]);
    }
  }

  cb([key, value]) {
    this.setState({ selectionName: value });
    this.props.callback(key);
  }

  static valuePredicate(pred, [index, value]) {
    const val = pred.trim().toLowerCase();
    return !val ? true : value.toLowerCase().indexOf(val) > -1;
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
    const btnText = this.state.selectionName || "None";

    return (
      <label className="pt-label fixture-select">
        {this.props.displayName}
        <Select
          items={this.elementList}
          onItemSelect={this.cb}
          noResults={<MenuItem key={0} disabled={true} text="No results." />}
          itemPredicate={FixtureSelectBase.valuePredicate}
          itemRenderer={FixtureSelectBase.renderItem}
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

class FixtureMultiSelectPre extends FixtureSelectBase {
  constructor(props) {
    super(props);

    this.state = {
      selected: []
    };

    this.selectedIndicies = new Set();

    this.toggleProp = this.toggleProp.bind(this);

    this.insertBlank = false;
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

class PayorSelectBase extends FixtureSelectBase {
  componentWillReceiveProps(nextProps) {
    const currentFixture = this.props.fixtures.plans;
    const nextFixture = nextProps.fixtures ? nextProps.fixtures.plans : null;
    const nextPayor = nextProps.payor ? parseInt(nextProps.payor, 10) : null;

    if (currentFixture === nextFixture && this.props.payor === nextPayor) {
      return;
    }

    if (!nextFixture || !nextPayor) {
      this.elementList = [];
      return;
    }

    this.elementList = Object.entries(nextFixture)
      .filter(([index, value]) => value.payorId === nextPayor)
      .map(([index, value]) => [index, value.name]);

    if (this.insertBlank) {
      this.elementList.unshift([0, "(All Plans)"]);
    }
  }
}

const connectState = state => {
  return {
    fixtures: state.fixtures
  };
};

export const FixtureSelect = connect(connectState)(FixtureSelectBase);

export const PayorSelect = connect(connectState)(PayorSelectBase);

export const FixtureMultiSelect = connect(connectState)(FixtureMultiSelectPre);
