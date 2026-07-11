import React from 'react';
import OptionPicker, { PickerOption } from '@/components/shared/OptionPicker';

interface Props {
  option1: PickerOption;
  option2: PickerOption;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const DoubleOptionPicker = ({ option1, option2, selectedValue, onSelect }: Props) => (
  <OptionPicker options={[option1, option2]} selectedValue={selectedValue} onSelect={onSelect} />
);

export default DoubleOptionPicker;
