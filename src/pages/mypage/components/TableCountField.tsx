// mypage/components/TableCountField.tsx
import InfoRow from './InfoRow';
import * as S from '../MyPage.styled';
import FieldActions from './FieldActions';

type Props = {
  editing: boolean;
  value: number;
  input: string;
  setInput: (v: string) => void;
  onEdit: () => void;
  onConfirm: () => void;
  onCancel: () => void;
};

const TableCountField = ({
  editing,
  value,
  input,
  setInput,
  onEdit,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <InfoRow label='테이블 수'>
      {editing ? (
        <S.NameInput
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/[^0-9]/g, ''))} // 숫자만 입력 가능
          placeholder='테이블 수 입력'
          style={{ maxWidth: '6rem' }}
        />
      ) : (
        <S.Value>{value ?? '-'}</S.Value>
      )}

      <div
        style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '0.75rem',
          marginRight: '1.6875rem',
        }}
      >
        <FieldActions
          editing={editing}
          onEdit={onEdit}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      </div>
    </InfoRow>
  );
};

export default TableCountField;
