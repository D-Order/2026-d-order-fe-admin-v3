import { useState } from 'react';
import * as S from './CategoryBox.styled';
import TabTitle, {
  type TabItem,
} from '@components/OperatorComponent/TabTitle/TabTitle';

export default function CategoryBox() {
  const [, setSelectedValue] = useState('tab-0');

  const tabs: TabItem[] = [
    { value: 'tab-0', status: 'click', type: 'tab-0', label: 'tab-0' },
    { value: 'tab-1', status: 'deactivated', type: 'tab-1', label: 'tab-1' },
    { value: 'tab-2', status: 'deactivated', type: 'tab-2', label: 'tab-2' },
    { value: 'tab-3', status: 'deactivated', type: 'tab-3', label: 'tab-3' },
    { value: 'tab-4', status: 'deactivated', type: 'tab-4', label: 'tab-4' },
    { value: 'tab-5', status: 'deactivated', type: 'tab-5', label: 'tab-5' },
    { value: 'tab-6', status: 'deactivated', type: 'tab-6', label: 'tab-6' },
    { value: 'tab-7', status: 'deactivated', type: 'tab-7', label: 'tab-7' },
    { value: 'tab-8', status: 'deactivated', type: 'tab-8', label: 'tab-8' },
    { value: 'tab-9', status: 'deactivated', type: 'tab-9', label: 'tab-9' },
  ];

  return (
    <S.CategoryBoxWrapper>
      {tabs.map((tab) => (
        <TabTitle
          key={tab.value}
          value={tab.value}
          status={tab.status}
          type={tab.type}
          label={tab.label}
          onClick={setSelectedValue}
        />
      ))}
    </S.CategoryBoxWrapper>
  );
}
