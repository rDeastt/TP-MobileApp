import React from 'react';
import OptionPicker, { PickerOption } from '@/components/shared/OptionPicker';

interface Props {
  option1: PickerOption;
  option2: PickerOption;
  option3: PickerOption;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const TripleOptionPicker = ({ option1, option2, option3, selectedValue, onSelect }: Props) => (
  <OptionPicker
    options={[option1, option2, option3]}
    selectedValue={selectedValue}
    onSelect={onSelect}
  />
);

export default TripleOptionPicker;
