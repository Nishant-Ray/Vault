interface AccountOptionsProps {
  top: number;
  left: number;
}

export default function AccountOptions({ top, left, ...rest }: AccountOptionsProps) {
  return (
    <div
      {...rest}
      className="absolute top-2"
    >
      <ul>
        <li>Edit</li>
        <li>Copy</li>
        <li>Delete</li>
      </ul>
    </div>
  );
}