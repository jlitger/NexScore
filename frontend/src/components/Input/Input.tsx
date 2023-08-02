export type InputProps = {
  label?: string;
  placeholder?: string;
  required?: true;
};

function Input({ label, placeholder, required }: InputProps) {
  return (
    <input placeholder={placeholder} required/>
  );
}

export { Input };