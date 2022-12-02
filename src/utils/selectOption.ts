import { ISelectOption } from '../interfaces';

export const transformToSelectOption = <T>(
  array: T[],
  valueKey: keyof T,
  labelKey: keyof T,
  defaultOption: ISelectOption
): ISelectOption[] => {
  const options = array.map(
    (x) =>
      ({
        value: x[valueKey],
        label: x[labelKey],
        disabled: false,
      } as ISelectOption)
  );

  options.unshift(defaultOption);
  return options;
};
