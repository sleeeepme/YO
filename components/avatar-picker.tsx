import { avatarIds, avatarNames } from '@/lib/avatars';
import { Avatar } from './avatar';
export function AvatarPicker({ value, onChange, disabled = false }: { value: number; onChange: (id: number) => void; disabled?: boolean }) {
  return <div className="avatar-options avatar-picker" role="group" aria-label="10種類からアバターを選ぶ">
    {avatarIds.map(id => <button type="button" key={id} disabled={disabled} aria-label={`${avatarNames[id]}を選ぶ`} aria-pressed={value === id} onClick={() => onChange(id)}>
      <Avatar seed={id} /><span className="avatar-selected-mark" aria-hidden="true">✓</span>
    </button>)}
  </div>;
}
