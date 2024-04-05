import { TreeSelect } from 'antd';

import { DataSearch } from 'models/table.model';

type Props = {
  /* eslint-disable no-unused-vars */
  propKey?: string;
  placeholder?: string;
  value?: string | undefined;
  options: DataSearch[];
  // eslint-disable-next-line no-unused-vars
  onChange?: (key: string, value: any) => void;
};

const TreeSelectFragment = (props: Props) => {
  const renderOption = (options: DataSearch[]) => {
    return options.map((option) => {
      if (!option.children || option.children.length === 0)
        return (
          <TreeSelect.TreeNode
            key={option.id + '__' + option.title}
            value={option.id + '__' + option.title}
            title={option.title}
          />
        );
      else
        return (
          <TreeSelect.TreeNode
            key={option.id + '__' + option.title}
            value={option.id + '__' + option.title}
            title={option.title}>
            {renderOption(option.children)}
          </TreeSelect.TreeNode>
        );
    });
  };

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={props.value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder={props.placeholder}
      allowClear
      // multiple
      treeDefaultExpandAll
      onChange={(value) => props.onChange && props.onChange(props.propKey || '', value)}>
      {renderOption(props.options)}
    </TreeSelect>
  );
};

export default TreeSelectFragment;
