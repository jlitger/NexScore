export type ButtonProps = {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

const Button = ({ children, type }: ButtonProps) => {
  return (
    <button type={type}>{ children }</button>
  )
}

export { Button };